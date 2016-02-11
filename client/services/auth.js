import Immutable from 'immutable';
import $ from 'jquery';

const SessionRecord = Immutable.Record({accountName: '', token: ''});

export default class Auth {
    constructor() {
        this._sessionInfo = null;
    }

    isLoggedIn() {
        return Boolean(this._sessionInfo);
    }

    tryAuthorize({accountName, token}) {
        var def = $.Deferred();
        setTimeout(() => {
            this._sessionInfo = new SessionRecord({accountName: accountName, token: token});
            def.reject('Unable to complete');
        }, 1000);

        return def.promise();
    }
}