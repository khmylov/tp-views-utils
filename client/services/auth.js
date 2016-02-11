import Immutable from 'immutable';
import $ from 'jquery';

const SessionRecord = Immutable.Record({accountName: ''});

export default class Auth {
    constructor() {
        this._sessionInfo = null;
    }

    isLoggedIn() {
        return Boolean(this._sessionInfo);
    }

    getAccountName() {
        return this._sessionInfo ? this._sessionInfo.accountName : null;
    }

    tryBuildSession() {
        this._sessionInfo = null;

        return $
            .ajax({
                url: '/login',
                type: 'GET',
                dataType: 'json'
            })
            .then(r => {
                this._sessionInfo = new SessionRecord({accountName: r.accountName});
                return this._sessionInfo;
            })
    }

    tryAuthorize({accountName, token}) {
        const verifiedAccountName = Auth._tryParseAccountName(accountName);
        if (!verifiedAccountName) {
            return $.Deferred().reject('Account name should either be a simple string ("someaccount") or on-demand url ("https://someaccount.tpondemand.com"))');
        }

        return $
            .ajax({
                url: '/login',
                type: 'POST',
                data: JSON.stringify({accountName: verifiedAccountName, token: token}),
                contentType: 'application/json',
                dataType: 'json'
            })
            .then(r => {
                this._sessionInfo = new SessionRecord({accountName: verifiedAccountName});
                return this._sessionInfo;
            });

        //var def = $.Deferred();
        //setTimeout(() => {
        //    this._sessionInfo = new SessionRecord({accountName: verifiedAccountName, token: token});
        //    def.resolve(this._sessionInfo);
        //}, 1000);
        //
        //return def.promise();
    }

    signOut() {
        this._sessionInfo = null;
        return $.ajax({
            url: '/logout',
            type: 'POST',
            dataType: 'json'
        });
    }

    static _tryParseAccountName(input) {
        const matched = input.match(/^(?:https?:\/\/)?(\w+)(?:\.tpondemand\.com)?$/);
        if (matched) {
            return matched[1];
        }

        return null;
    }
}