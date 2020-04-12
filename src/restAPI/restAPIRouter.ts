import Router from 'koa-router';
import Explore from './explore';
import plugins from '../plugins';
import authentication from './authentication';

const router = new Router();

plugins.forEach(plugin => {
  router.use('/' + plugin.info.name, plugin.router.routes());
});
router.use('/explore', Explore.router.routes());
router.use('/authentication', authentication.router.routes());

export default router;
