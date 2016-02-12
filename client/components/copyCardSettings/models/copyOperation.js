import _ from 'lodash';
import $ from 'jquery';
import Log from './log';

import Transforms from './viewTransforms';
import Validation from './validation';

const nullLog = new Log();
const nullProgress = {
    onNext: _.noop,
    onCompleted: _.noop
};

export default class CopyOperation {
    /**
     * @param {Immutable.Iterable} groupModels
     * @param {SessionInfo} session
     * @param {TpViewsApi} api
     * @param {string} fromViewId
     * @param {string[]} toViewIds
     * @param {string[]} optionIds
     * @param {Log=} log
     * @returns {Promise}
     */
    static execute({groupModels, session, api, fromViewId, toViewIds, optionIds, log = nullLog}) {
        const sourceView = Transforms.findViewById(groupModels, fromViewId);

        if (!sourceView) {
            return $.Deferred().reject(`Unable to find source view with id '${fromViewId}'`);
        }

        const sourceViewData = sourceView.getViewData();

        const {targetViews, targetErrors} = _.reduce(toViewIds, (acc, viewId) => {
            const targetView = Transforms.findViewById(groupModels, viewId);
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
            const updateData = CopyOperation._createUpdateRequestBody(sourceViewData, targetView.getViewData(), optionIds);
            const viewId = targetView.key;
            const displayName = `${viewId} ${targetView.name}`;
            log.append(`Updating view ${displayName}...`);
            return api
                .updateView(targetView.key, updateData)
                .done(() => log.append(`Finished updating ${displayName}.`))
                .fail(() => log.append(`Error when updating ${displayName}`));
        };

        return CopyOperation
            ._runPromiseSeq(targetViews, runForView)
            .then(() => log.append('All done'))
    }

    static _runPromiseSeq(items, createPromise) {
        const safe = x => {
            const def = $.Deferred();
            createPromise(x).always(() => def.resolve());
            return def.promise();
        };

        return _.reduce(items, (acc, item) => {
            return acc.then(() => safe(item));
        }, $.Deferred().resolve());
    }

    static _createUpdateRequestBody(sourceViewData, targetViewData, optionIds) {
        const result = {};

        if (_.includes(optionIds, 'units-cells')) {
            result.cardSettings = _.cloneDeep(sourceViewData.cardSettings);
        }

        if (_.includes(optionIds, 'colors-cells')) {
            result.colorSettings = _.cloneDeep(sourceViewData.colorSettings);
        }

        return result;
    }
}