import * as _ from 'lodash';
import TpAuthenticationApi from '../tp-api/authentication';
import TpTarget from '../tp-api/target';

export function buildTargetFromSession({tokenValue, accountName}) {
    if (!accountName || !accountName.length || !tokenValue || !tokenValue.length) {
        return null;
    }

    return new TpTarget({accountName: accountName, token: tokenValue});
}

export function getTargetFromSessionOrEnd(req, res) {
    const target = buildTargetFromSession(req.session);
    if (!target) {
        clearAuthSession(req.session);
        res.sendStatus(401);
        return;
    }

    return target;
}

export function clearAuthSession(session) {
    /* eslint no-console: 0 */
    console.log('Clearing out session');

    session.tokenType = null;
    session.tokenValue = null;
    session.accountName = null;
}

export function tryAuthenticate(req, res, target) {
    if (!target) {
        clearAuthSession(req.session);
        res.sendStatus(401);
        return;
    }

    const api = new TpAuthenticationApi(target);
    return api
        .tryAuthenticate()
        .then(r => {
            const authenticatedUserInfo = JSON.parse(r);
            const accountName = target.accountName;
            _.assign(req.session, {
                tokenType: 'password-based',
                tokenValue: target.token,
                accountName: accountName
            });

            res.end(JSON.stringify({
                accountName: accountName,
                firstName: authenticatedUserInfo.FirstName,
                lastName: authenticatedUserInfo.LastName,
                login: authenticatedUserInfo.Login,
                userId: authenticatedUserInfo.Id,
                isAdministrator: authenticatedUserInfo.IsAdministrator
            }));
        })
        .catch(e => {
            clearAuthSession(req.session);
            res.sendStatus(401);
            return e;
        });
}
