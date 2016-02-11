import _ from 'lodash';

function assertNotEmptyString(s, argumentName) {
    if (!_.isString(s) || !s.length) {
        throw new Error(`'${argumentName}' should be a non-empty string`);
    }
}

class Target {
    constructor({accountName, token}) {
        assertNotEmptyString(accountName);
        assertNotEmptyString(token);

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