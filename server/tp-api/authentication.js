import rp from 'request-promise';

export default class TpAuthenticationApi {
    constructor(target) {
        this._target = target;
    }

    tryAuthenticate() {
        return rp(this._target.createRequestOptions('/api/v1/Users/loggedUser', {
            qs: {
                format: 'json',
                include: '[firstName,lastName,login]'
            }
        }));
    }
};