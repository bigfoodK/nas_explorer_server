import Router from 'koa-router';
import serveData from './serveData';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.params.path = 'hello.html';
  await serveData(ctx, next);
});

router.get('/data/:path*', serveData);

export { router };