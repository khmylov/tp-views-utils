import $ from 'jquery';
import SessionInfo from './sessionInfo';

/**
 * @class AuthService
 */
export default class AuthService {
    constructor() {
        this._sessionInfo = null;
    }

    isLoggedIn() {
        return Boolean(this._sessionInfo);
    }

    /**
     * @returns {null|SessionInfo}
     */
    getSessionInfo() {
        return this._sessionInfo;
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
            .then(response => {
                this._sessionInfo = AuthService._createSessionFromResponse(response);
                return this._sessionInfo;
            });
    }

    tryAuthorize({accountName, token}) {
        const verifiedAccountName = AuthService.tryParseAccountName(accountName);
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
            .then(response => {
                this._sessionInfo = AuthService._createSessionFromResponse(response);
                return this._sessionInfo;
            });
    }

    signOut() {
        this._sessionInfo = null;
        return $.ajax({
            url: '/logout',
            type: 'POST',
            dataType: 'json'
        });
    }

    static _createSessionFromResponse(loginResponse) {
        return new SessionInfo(loginResponse);
    }

    static tryParseAccountName(input) {
        if (!input || !input.length) {
            return null;
        }

        const matched = input.match(/^(?:https?:\/\/)?(\w+)(?:\.tpondemand\.com)?$/);
        if (matched) {
            return matched[1];
        }

        return null;
    }
}