import Router from 'koa-router';
import serveData from './serveData';
import serveIndexes from './serveIndex';
import servePublic from './servePublic';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.redirect('/explore');
});

router.get('/explore/:path*', async (ctx, next) => {
  ctx.params.path = 'index.html'
  await servePublic(ctx, next);
});

router.get('/data/:path*', serveData);

router.get('/download/:path*', async (ctx, next) => {
  ctx.params.isDownload = true;
  await serveData(ctx, next);
});

router.get('/index/:path*', serveIndexes);

router.get('/:path*', servePublic);

export { router };