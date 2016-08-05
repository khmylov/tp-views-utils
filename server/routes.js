/* eslint no-console: 0 */

import _ from 'lodash';
import TpTarget from './tp-api/target';
import TpViewsApi from './tp-api/views';
import TpAuthenticationApi from './tp-api/authentication';

// TODO: brush up error handling and responses

function buildTargetFromSession({tokenValue, accountName}) {
    if (!accountName || !accountName.length || !tokenValue || !tokenValue.length) {
        return null;
    }

    return new TpTarget({accountName: accountName, token: tokenValue});
}

function getTargetFromSessionOrEnd(req, res) {
    const target = buildTargetFromSession(req.session);
    if (!target) {
        clearAuthSession(req.session);
        res.sendStatus(401);
        return;
    }

    return target;
}

function clearAuthSession(session) {
    console.log('Clearing out session');

    session.tokenType = null;
    session.tokenValue = null;
    session.accountName = null;
}

function tryAuthenticate(req, res, target) {
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

export default app => {
    app.get('/login', (req, res) => {
        tryAuthenticate(req, res, buildTargetFromSession(req.session));
    });

    app.post('/login', (req, res) => {
        const {accountName, token} = req.body;

        if (!accountName || !accountName.length || !token || !token.length) {
            console.log('Invalid request arguments', req.body);
            res.sendStatus(500);
            return;
        }

        const target = new TpTarget({accountName: accountName, token: token});
        tryAuthenticate(req, res, target)
            .catch(e => {
                console.error(req.url, 'POST /login failed', e);
            });
    });

    app.post('/logout', (req, res) => {
        clearAuthSession(req.session);
        res.end('');
    });

    app.get('/api/views/', (req, res) => {
        const target = getTargetFromSessionOrEnd(req, res);
        if (!target) {
            return;
        }

        const api = new TpViewsApi(target);
        api
            .getAllViews({select: req.query.select})
            .then(r => {
                res.end(r);
            })
            .catch(e => {
                console.error(req.url, 'getAllViews() failed', e);
                res.sendStatus(500);
            });
    });

    app.post('/api/views/view/:viewId', (req, res) => {
        const target = getTargetFromSessionOrEnd(req, res);
        if (!target) {
            return;
        }

        const viewId = req.params.viewId;
        const api = new TpViewsApi(target);
        api
            .createOrUpdateView(viewId, req.body)
            .then(r => {
                res.end(JSON.stringify(r));
            })
            .catch(e => {
                console.error(req.url, 'createOrUpdateView() failed', e);
                res.sendStatus(500);
            });
    });

    app.get('*', (req, res) => {
        const HTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Targetprocess view utils</title>
            </head>
            <body>
              <div id="rootElement"><div class="rootElement__loading-placeholder"></div></div>
              <script type="text/javascript" src="/static/frontend.js"></script>
            </body>
          </html>
        `;

        res.end(HTML);
    });
};