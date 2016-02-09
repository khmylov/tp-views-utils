import _ from 'lodash';
import $ from 'jquery';
import Immutable from 'immutable';
import Api from '../../../services/tp-views-api';
import Log from './log';

class ViewModel {
    constructor({key, name}) {
        this.key = key;
        this.name = name;
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
        this.groupModels = [];
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
        return this.groupModels
            .flatMap(g => g.children);
    }

    getViewById(viewId) {
        return this
            .getAllViews()
            .find(v => v.key === viewId);
    }

    copyCardSettings(fromViewId, toViewIds) {
        var def = $.Deferred();
        const log = this.log;
        log.append(`Started copying ${fromViewId} to ${toViewIds.join(', ')}`);
        setTimeout(() => log.append('First completed'), 1000);
        setTimeout(() => log.append('Second completed'), 2000);

        setTimeout(() => def.resolve(), 3000);
        return def
            .then(() => log.append('All done'));
    }

    static _createGroupModel(groupDto) {
        return new ViewGroupModel(groupDto, this.log);
    }
}

export default ViewTreeModel;