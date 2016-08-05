import TpViewsApi from '../tp-api/views';
import {
    getTargetFromSessionOrEnd
} from './requestAuthentication';
import {logger} from '../logging';

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
                logger.error('getAllViews() failed', e);
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
                logger.error('createOrUpdateView() failed', {error: e, url: req.url});
                res.sendStatus(500);
            });
    });

}