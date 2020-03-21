import Router from 'koa-router';
import serveIndexes from './serveIndex';

const router = new Router();

router.get('/index/:path*', serveIndexes);

export default router;
