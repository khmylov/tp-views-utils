import rp from 'request-promise';

export default class TpTestAuthApi {
    constructor(target) {
        this._target = target;
    }

    tryAuthenticate() {
        return rp(this._target.createRequestOptions('/api/v1/Authentication', {
            qs: {
                format: 'json'
            }
        }));
    }
};