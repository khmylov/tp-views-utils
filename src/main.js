import express from 'express'
import setupRoutes from './routes'

const app = express();
setupRoutes(app);

const port = 3000;
const server = app.listen(port, () => {
    console.log('listening on *:3000');
});