import Koa from 'koa';
import errorCatcher from './middleware/error.catcher';
import kladrRoutes from './routes/kladr.routes';
import dellineRoutes from './routes/delline.routes';

const app = new Koa();

app.use(errorCatcher);
app.use(kladrRoutes);
app.use(dellineRoutes);

export default app;
