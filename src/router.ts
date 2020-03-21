import Router from 'koa-router';
import serveData from './serveData';
import servePublic from './servePublic';
import restAPIRouter from './restAPI/restAPIRouter';

const router = new Router();

router.use('/restAPI', restAPIRouter.routes());

router.get('/', async (ctx, next) => {
  ctx.redirect('/explore/browse');
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

router.get('/:path*', servePublic);

export = router;