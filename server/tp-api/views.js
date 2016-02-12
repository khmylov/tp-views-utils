import rp from 'request-promise';

class TpViewsApi {
    constructor(target) {
        this._target = target;
    }

    getAllViews({select} = {}) {
        console.log('~select:', select);
        const qs = {};
        if (select) {
            qs.select = select;
        }

        return this
            ._doRequest('/', {qs: qs});
    }

    createOrUpdateView(viewId, data) {
        return this
            ._doRequest(`/view/${viewId}`, {type: 'POST', data});
    }

    _doRequest(relativeUrl, config) {
        return rp(this._target.createRequestOptions('/api/views/v1' + relativeUrl, config));
    }
}

export default TpViewsApi;