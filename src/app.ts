import Koa from 'koa';
import errorCatcher from './middleware/error.catcher';
import kladrRoutes from './routes/kladr.routes'

const app = new Koa();

app.use(errorCatcher);
app.use(kladrRoutes);

export default app;
