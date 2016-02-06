import _ from 'lodash'
import Api from './api'
import Immutable from 'immutable';

class ViewModel {
    constructor({key, name}) {
        this.key = key;
        this.name = name;
    }
}

class ViewGroupModel {
    constructor({itemData, children}) {
        const {key, name} = itemData;
        this.name = name;
        this.key = key;

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

    static _createGroupModel(groupDto) {
        return new ViewGroupModel(groupDto);
    }
}

export default ViewTreeModel;