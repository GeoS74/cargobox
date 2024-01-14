import Router from 'koa-router';
import * as kladr from '../controllers/kladr.controller';

const router = new Router({ prefix: '/api/cargobox/kladr' });

router.get(
  '/update',
  kladr.startBot,
  kladr.update,
  // kladr.foo,
);
router.get(
  '/state',
  kladr.startBot,
  kladr.state,
);
router.get('/stop', kladr.stopBot);

export default router.routes();
