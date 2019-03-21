import Koa from 'koa';
import Config from './config';
import logger from './logger';
import { router } from './router';

const serverPort = Config.port;

const app = new Koa();

app.use(logger);

app.use(router.routes());

app.listen(serverPort);

console.log(`Server running on port ${serverPort}`);
