import Koa from 'koa';
import cors from "@koa/cors"
import config from "./config"
import errorCatcher from './middleware/error.catcher';
import kladrRoutes from './routes/kladr.routes';
import dellineRoutes from './routes/delline.routes';

const app = new Koa();

app.use(errorCatcher);
if (config.node.env === 'dev') {
  app.use(cors());
}
app.use(kladrRoutes);
app.use(dellineRoutes);

export default app;
