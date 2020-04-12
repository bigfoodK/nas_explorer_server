import Router from 'koa-router';
import signup from './signup';
import signin from './signin';
import whoAmI from './whoAmI';

const router = new Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/whoAmI', whoAmI);

export default router;
