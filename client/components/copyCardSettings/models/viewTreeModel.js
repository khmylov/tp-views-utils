import _ from 'lodash';
import $ from 'jquery';
import Immutable from 'immutable';
import Api from '../../../services/tp-views-api';
import Log from './log';

import Transforms from './viewTransforms';
import Validation from './validation';

const nullLog = new Log();
const nullProgress = {
    onNext: _.noop,
    onCompleted: _.noop
};

class ViewModel {
    constructor(itemData) {
        this._itemData = _.cloneDeep(itemData);
    }

    get key() {
        return this._itemData.key;
    }

    get name() {
        return this._itemData.name;
    }

    getViewData() {
        // TODO: use immutable data here to avoid cloning?
        return _.cloneDeep(this._itemData);
    }
}

class ViewGroupModel {
    constructor({itemData, children}, log) {
        const {key, name} = itemData;
        this.name = name;
        this.key = key;
        this._log = log;

        this.children = Immutable
            .Seq(children)
            .map(x => ViewGroupModel._createViewModel(x))
            .toList();
    }

    static _createViewModel({itemData}) {
        return new ViewModel(itemData);
    }
}

class ViewTreeModel {
    constructor() {
        this._api = new Api();
        this.groupModels = Immutable.List();
        this.log = new Log();
    }

    loadAllViews() {
        return this._api
            .doRequest('/views')
            .then(response => {
                this.groupModels = Immutable
                    .Seq(response.items)
                    .flatMap(s => s.children)
                    .map(g => ViewTreeModel._createGroupModel(g))
                    .toList();
            });
    }

    getAllViews() {
        return Transforms.flattenViews(this.groupModels);
    }

    updateView(viewId, updateData) {
        return this._api
            .doRequest(`/views/view/${viewId}`, {type: 'POST', data: updateData});
    }

    copyCardSettings({fromViewId, toViewIds, optionIds}, log = nullLog, progress = nullProgress) {
        const sourceView = Transforms.findViewById(this.groupModels, fromViewId);

        if (!sourceView) {
            return $.Deferred().reject(`Unable to find source view with id '${fromViewId}'`);
        }

        const sourceViewData = sourceView.getViewData();

        const {targetViews, targetErrors} = _.reduce(toViewIds, (acc, viewId) => {
            const targetView = Transforms.findViewById(this.groupModels, viewId);
            if (!targetView) {
                acc.targetErrors.push(`Unable to find target view with id '${viewId}'`);
                return acc;
            }

            const targetViewData = targetView.getViewData();
            const validationResult = Validation.validateViewForCopySettings(sourceViewData, targetViewData, optionIds);
            if (!validationResult.success) {
                acc.targetErrors.push(`Validation error for target view '${viewId}': ${validationResult.error}`);
                return acc;
            }

            acc.targetViews.push(targetView);
            return acc;
        }, {targetViews: [], targetErrors: []});

        if (targetErrors.length) {
            return $.Deferred().reject(`Unable to start an update:\n\n${targetErrors.join('\n')}`);
        }

        const runForView = targetView => {
            const updateData = this._createUpdateRequestBody(sourceViewData, targetView.getViewData(), optionIds);
            const viewId = targetView.key;
            const displayName = `${viewId} ${targetView.name}`;
            log.append(`Updating view ${displayName}...`);
            return this
                .updateView(targetView.key, updateData)
                .done(() => log.append(`Finished updating ${displayName}.`))
                .fail(() => log.append(`Error when updating ${displayName}`));
            //log.append(`POST /api/views/${targetView.key} ${JSON.stringify(updateData)}`);
            //const def = $.Deferred();
            //setTimeout(() => def.resolve(), 1500);
            //return def.promise();
        };

        return this
            ._runPromiseSeq(targetViews, runForView)
            .then(() => log.append('All done'));
    }

    _runPromiseSeq(items, createPromise) {
        const safe = x => {
            const def = $.Deferred();
            createPromise(x).always(() => def.resolve());
            return def.promise();
        };

        return _.reduce(items, (acc, item) => {
            return acc.then(() => safe(item));
        }, $.Deferred().resolve());
    }

    _createUpdateRequestBody(sourceViewData, targetViewData, optionIds) {
        const result = {};

        if (_.includes(optionIds, 'units-cells')) {
            result.cardSettings = _.cloneDeep(sourceViewData.cardSettings);
        }

        if (_.includes(optionIds, 'colors-cells')) {
            result.colorSettings = _.cloneDeep(sourceViewData.colorSettings);
        }

        return result;
    }

    static _createGroupModel(groupDto) {
        return new ViewGroupModel(groupDto, this.log);
    }
}

export default ViewTreeModel;