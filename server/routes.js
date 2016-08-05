/* eslint no-console: 0 */


import TpTarget from './tp-api/target';
import {
    buildTargetFromSession,
    clearAuthSession,
    tryAuthenticate
} from './controllers/requestAuthentication';

import * as viewsApiController from './controllers/viewsApiController';

// TODO: brush up error handling and responses

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

    viewsApiController.initialize(app);

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