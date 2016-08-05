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