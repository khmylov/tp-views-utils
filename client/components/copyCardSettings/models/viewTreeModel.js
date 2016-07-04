import _ from 'lodash';
import Immutable from 'immutable';
import Api from '../../../services/tp-views-api';
import Log from './log';

import Transforms from './viewTransforms';

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

    get itemType() {
        return this._itemData.itemType;
    }

    get viewMode() {
        return this._itemData.viewMode;
    }

    getViewData() {
        // TODO: use immutable data here to avoid cloning?
        return _.cloneDeep(this._itemData);
    }
}

class ViewGroupModel {
    constructor({itemData, children}, log) {
        this.name = itemData.name;
        this.key = itemData.key;
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
            .doRequest('/views', {
                data: {
                    select: '{key,name,menuGroupKey,ownerIds,x,y,cells,colorSettings,cardSettings,viewMode,itemType}'
                }
            })
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