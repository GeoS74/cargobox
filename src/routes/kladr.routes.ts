import Router from 'koa-router';
import * as kladr from '../controllers/kladr.controller';
import tempFolder from '../middleware/temp.folder';

const router = new Router({ prefix: '/api/cargobox/kladr' });

router.get(
  '/update',
  // tempFolder,
  kladr.startBot,
  // kladr.isRunningBot,
  kladr.update,
);
router.get(
  '/state',
  kladr.startBot,
  kladr.state,
);
router.get('/stop', kladr.stopBot);

export default router.routes();
