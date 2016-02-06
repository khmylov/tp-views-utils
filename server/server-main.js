import express from 'express'
import bodyParser from 'body-parser'
import setupRoutes from './routes'
import path from 'path'

const app = express();
app.use('/static', express.static(path.join(__dirname, '../build/static')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
setupRoutes(app);

const port = 3000;
const server = app.listen(port, () => {
    console.log(`listening on *:${port}`);
});