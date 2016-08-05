import TpViewsApi from '../tp-api/views';
import {
    getTargetFromSessionOrEnd
} from './requestAuthentication';

export function initialize(app) {

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

}