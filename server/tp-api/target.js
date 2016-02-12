import _ from 'lodash';
import guard from '../../shared/utils/guard';

class Target {
    constructor({accountName, token}) {
        guard.notEmptyString(accountName);
        guard.notEmptyString(token);

        this._accountName = accountName;
        this._token = token;
    }

    get accountName() {
        return this._accountName;
    }

    get url() {
        return `https://${this._accountName}.tpondemand.com`;
    }

    get token() {
        return this._token;
    }

    createRequestOptions(relativeUrl, {type = 'GET', data = null, qs = null} = {}) {
        return {
            method: type,
            uri: `${this.url}${relativeUrl}`,
            qs: _.assign({
                token: this.token
            }, qs),
            json: data
        };
    }
}

export default Target;