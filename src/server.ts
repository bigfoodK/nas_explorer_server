import Fs from 'fs';
import Koa from 'koa';
import Http from 'http';
import Https from 'https';
import Greenlock from 'greenlock-koa';
import KoaBodyParser from 'koa-bodyparser';
import Config from './config';
import logger from './logger';
import router from './router';
import redirectToHttps from './redirectToHttps';

const greenlock = Greenlock.create(Config.greenlock);

const app = new Koa();
app.use(logger);
app.use(redirectToHttps);
app.use(KoaBodyParser());
app.use(router.routes());

const httpServer = Config.debug
  ? Http.createServer(app.callback())
  : Http.createServer(greenlock.middleware(app.callback()));

const httpsServer = Config.debug
  ? Https.createServer({
      key: Fs.readFileSync(Config.https.keyPath),
      cert: Fs.readFileSync(Config.https.certPath),
    }, app.callback())
  : Https.createServer(greenlock.tlsOptions, greenlock.middleware(app.callback()));

httpServer.listen(Config.http.port, undefined, undefined, () => {
  const date = new Date();
  console.log(`http server running on ${Config.http.port} [${date.toLocaleString()}]`);
});

httpsServer.listen(Config.https.port, undefined, undefined, () => {
  const date = new Date();
  console.log(`https server running on ${Config.https.port} [${date.toLocaleString()}]`);
});
