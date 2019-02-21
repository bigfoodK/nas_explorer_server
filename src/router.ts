import Router from 'koa-router';
import serveData from './serveData';
import serveIndexes from './serveIndex';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.redirect('/explore');
});

router.get('/data/:path*', serveData);

router.get('/download/:path*', async (ctx, next) => {
  ctx.params.isDownload = true;
  await serveData(ctx, next);
});

router.get('/index/:path*', serveIndexes);

export { router };