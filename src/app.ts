import Koa from 'koa';
import cors from '@koa/cors';
import config from './config';
import errorCatcher from './middleware/error.catcher';
import kladrRoutes from './routes/kladr.routes';
import dellineRoutes from './routes/delline.routes';
import calculateRoutes from './routes/calculate.routes';

const app = new Koa();

app.use(errorCatcher);
if (config.node.env === 'dev') {
  app.use(cors());
}
app.use(kladrRoutes);
app.use(dellineRoutes);
app.use(calculateRoutes);

export default app;
