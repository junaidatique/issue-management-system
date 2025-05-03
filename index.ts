import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import config from './config';
import router from './lib/routes';

const app: Koa = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port);
console.log(`Listening on http://localhost:${config.port}`);
