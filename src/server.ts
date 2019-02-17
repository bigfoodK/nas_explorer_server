import Koa from 'koa';
import Router from 'koa-router';
import { config } from './config';

const serverPort = config.port;

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
    // Log the request to the console
    console.log('Url:', ctx.url);
    // Pass the request to the next middleware function
    await next();
});

router.get('/*', async (ctx) => {
    ctx.body = 'Hello World!';
});
app.use(router.routes());

app.listen(serverPort);

console.log(`Server running on port ${serverPort}`);