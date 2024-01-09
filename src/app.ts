import Koa from 'koa';
import errorCatcher from './middleware/error.catcher';

const app = new Koa();

app.use(errorCatcher);

export default app;
