class Target {
    constructor({url, token}) {
        this._url = url;
        this._token = token;
    }

    get url() {
        return this._url;
    }

    get token() {
        return this._token;
    }
}

export default Target;