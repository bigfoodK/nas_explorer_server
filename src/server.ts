import Koa from 'koa';
import Router from 'koa-router';
import { config } from './config';
import logger from './logger';

const serverPort = config.port;

const app = new Koa();
const router = new Router();

app.use(logger);

router.get('/*', async (ctx) => {
    ctx.body = 'Hello World!';
});
app.use(router.routes());

app.listen(serverPort);

console.log(`Server running on port ${serverPort}`);