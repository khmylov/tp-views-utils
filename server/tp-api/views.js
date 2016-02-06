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
            ._doRequest(`/${viewId}`, 'POST', data);
    }

    _doRequest(relativeUrl, type = 'GET', data = null) {
        const options = {
            method: type,
            uri: `${this._target.url}/api/views/v1` + relativeUrl,
            qs: {
                token: this._target.token
            },
            body: data,
            json: true
        };

        return rp(options);
    }
}

export default TpViewsApi;