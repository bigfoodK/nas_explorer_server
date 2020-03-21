import Router from 'koa-router';
import Explore from './explore';

const router = new Router();

router.use('/explore', Explore.router.routes());

export default router;
