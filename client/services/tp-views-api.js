import $ from 'jquery';

/**
 * @class TpViewsApi
 */
export default class TpViewsApi {
    constructor() {

    }

    updateView(viewId, updateData) {
        return this.doRequest(`/views/view/${viewId}`, {type: 'POST', data: updateData});
    }

    //noinspection JSMethodCanBeStatic
    doRequest(url, {type = 'GET', data = null} = {}) {
        const fullUrl = `/api` + url;
        return $.ajax({
            url: fullUrl,
            type: type,
            data: data != null ? JSON.stringify(data) : null,
            contentType: 'application/json',
            dataType: 'json'
        });
    }
};