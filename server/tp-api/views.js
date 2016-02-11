import rp from 'request-promise'

class TpViewsApi {
    constructor(target) {
        this._target = target;
    }

    getAllViews() {
        return this
            ._doRequest('/');
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