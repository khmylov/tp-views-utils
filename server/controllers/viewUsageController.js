import pg from 'pg';
import * as _ from 'lodash';
import {logger} from '../logging';
import {nconf} from '../configuration';
import {getTargetFromSessionOrEnd} from './requestAuthentication';
import TpViewsApi from '../tp-api/views';

function connectAsync(client) {
    logger.info('connectAsync');
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                logger.error('pg connect', err);
                reject(err);
            } else {
                logger.info('pg connected');
                resolve();
            }
        });
    });
}

function queryAsync(client, ...args) {
    logger.info('queryAsync');
    return new Promise((resolve, reject) => {
        const actualArgs = args.concat((err, result) => {
            if (err) {
                logger.error('pg query', err);
                reject(err);
            } else {
                logger.info('pg query completed');
                resolve(result);
            }
        });
        client.query(...actualArgs);
    });
}

function endAsync(client) {
    logger.info('endAsync');
    client.end(err => {
        if (err) {
            logger.error('pg end', err);
        }
    });
}

function doWithPg(func) {
    const connectionString = nconf.get('taus:connectionString');

    logger.debug('clientConfig', connectionString);

    const client = new pg.Client(connectionString);

    return connectAsync(client)
        .then(() => func(client)
            .then(result => { endAsync(client); return result; }, () => endAsync(client)));
}

function getViewsUsage({host}) {
    return doWithPg(client => {
        const query =
            `
SELECT * FROM (
    SELECT view_id, COUNT(*) as view_count, MAX(server_date) as last_date
    FROM tauspy.views
    WHERE host = $1
    AND DATEDIFF(day, server_date, current_date) < 90
    GROUP BY view_id
    ORDER BY view_count DESC
)
LIMIT 100
`;
        return queryAsync(client, query, [host]);
    })
        .then(result => _.map(result.rows, row => ({
            viewId: row.view_id,
            viewCount: parseInt(row.view_count, 10),
            lastDate: row.last_date
        })));
}

function getViews({target}) {
    const api = new TpViewsApi(target);
    return api
        .getAllViews({
            select: '{key,name,itemType,viewMode}'
        })
        .then(response => JSON.parse(response))
        .then(response => {
            const sections = _
                .chain(response.items)
                .filter(item => item.itemType === 'section')
                .value();

            //console.log('~~~ sections', sections);

            const groups = _
                .chain(sections)
                .flatMap(section => section.children)
                .filter(item => item.itemType === 'group')
                .value();

            //console.log('~~~~~ groups', groups);

            const views = _
                .chain(groups)
                .flatMap(group => group.children)
                .map(item => item.itemData)
                .value();

            //console.log('~~~~~~~ views', views);

            return views;
        });
}

function mergeUsageInfo(viewsUsage, views) {
    return _.map(views, view => {
        const matchingUsageRecord = _.find(viewsUsage, x => x.viewId === view.key) || { viewCount: 0 };
        return _.extend({}, view, {
            usageInfo: matchingUsageRecord
        });
    });
}

function buildUsageInfo(viewsUsage, views) {
    return _.orderBy(
        mergeUsageInfo(viewsUsage, views),
        [view => view.usageInfo.viewCount],
        ['desc']);
}

export function initialize(app) {
    app.get('/api/views/usage', (req, res) => {
        const target = getTargetFromSessionOrEnd(req, res);
        if (!target) {
            return;
        }

        Promise.all([getViewsUsage({host: target.hostName}), getViews({target})])
            .then(([viewsUsage, views]) => buildUsageInfo(viewsUsage, views))
            .then(usageInfo => {
                res.end(JSON.stringify(usageInfo));
            })
            .catch(err => {
                logger.error('res.end');
                res.end(JSON.stringify(err));
            });
    });
}
