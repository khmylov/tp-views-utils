import $ from 'jquery';
import _ from 'lodash';
import Immutable from 'immutable';

class ViewsUsageApi {
    doRequest(url, {type = 'GET', data = null} = {}) {
        const fullUrl = `/api` + url;

        var dataToSend;
        if (!data) {
            dataToSend = null;
        } else {
            if (type === 'GET') {
                dataToSend = data;
            } else {
                dataToSend = JSON.stringify(data);
            }
        }

        return $.ajax({
            url: fullUrl,
            type: type,
            data: dataToSend,
            contentType: 'application/json',
            dataType: 'json'
        });
    }
}

export class ViewItemUsageInfo {
    constructor({viewId, viewName, groupName, usageCount, lastUsageDate}) {
        this._viewId = viewId;
        this._viewName = viewName;
        this._usageCount = usageCount;
        this._lastUsageDate = lastUsageDate;
        this._groupName = groupName;
    }

    get viewId() {
        return this._viewId;
    }

    get viewName() {
        return this._viewName;
    }

    get usageCount() {
        return this._usageCount;
    }

    get lastUsageDate() {
        return this._lastUsageDate;
    }

    get groupName() {
        return this._groupName;
    }
}

export class ViewsUsageModel {
    constructor() {
        this._api = new ViewsUsageApi();
        this.viewItems = Immutable.List();
    }

    loadAllViewUsages() {
        return this._api
            .doRequest('/views/usage')
            .then(({items}) => {
                return _.map(items, item => new ViewItemUsageInfo({
                    viewId: item.key,
                    viewName: item.name,
                    usageCount: item.usageInfo.viewCount,
                    lastUsageDate: item.usageInfo.lastDate,
                    groupName: item.groupName
                }));
            })
            .then(items => this.viewItems = Immutable.List(items));
    }
}