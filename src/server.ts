import Koa from 'koa';
import { config } from './config';
import logger from './logger';
import { router } from './router';

const serverPort = config.port;

const app = new Koa();

app.use(logger);

app.use(router.routes());

app.listen(serverPort);

console.log(`Server running on port ${serverPort}`);