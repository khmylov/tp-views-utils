import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import setupRoutes from './routes';
import path from 'path';
import {nconf} from './configuration';

import session from 'express-session';

const app = express();
app.use('/static', express.static(path.join(__dirname, '../build/static')));
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: nconf.get('SESSION_SECRET')
}));

setupRoutes(app);

const port = nconf.get('PORT');
const nodeEnv = nconf.get('NODE_ENV');
const server = app.listen(port, () => {
    console.log(`Listening on *:${port}. NODE_ENV: ${nodeEnv}.`);
});