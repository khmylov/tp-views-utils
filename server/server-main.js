import express from 'express'
import setupRoutes from './routes'
import path from 'path'

console.log('~~~~', path.join(__dirname, 'static'));

const app = express();
app.use('/static', express.static(path.join(__dirname, '../build/static')));
setupRoutes(app);


const port = 3000;
const server = app.listen(port, () => {
    console.log('listening on *:3000');
});