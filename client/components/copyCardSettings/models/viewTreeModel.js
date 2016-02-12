import _ from 'lodash';
import $ from 'jquery';
import Immutable from 'immutable';
import guard from '../../../../shared/utils/guard';
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

    getApi() {
        return this._api;
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

    static _createGroupModel(groupDto) {
        return new ViewGroupModel(groupDto, this.log);
    }
}

export default ViewTreeModel;