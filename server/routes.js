import fs from 'fs'
import path from 'path'

import TpTarget from './tp-api/target'
import TpViewsApi from './tp-api/views'
import defaultTargetConfig from './tp-api/defaultTarget.private.json'

export default app => {
    app.get('/api/views/', (req, res) => {
        const target = new TpTarget(defaultTargetConfig);
        const api = new TpViewsApi(target);
        api
            .getAllViews()
            .then(r => {
                res.end(JSON.stringify(r));
            })
            .catch(e => {
                console.error(req.url, 'getAllViews() failed', e);
                res.sendStatus(500);
            });
    });

    app.post('/api/views/:viewId', (req, res) => {
        const viewId = req.params.viewId;

        const target = new TpTarget(defaultTargetConfig);
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

    app.get('/', (req, res) => {
        const HTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Targetprocess view utils</title>
            </head>
            <body>
              <div id="rootElement">Loading..</div>
              <script type="text/javascript" src="static/frontend.js"></script>
            </body>
          </html>
        `;

        res.end(HTML);
    });
}