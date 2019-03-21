import Fs from 'fs';
import Koa from 'koa';
import Http from 'http';
import Https from 'https';
import Config from './config';
import logger from './logger';
import router from './router';
import redirectToHttps from './redirectToHttps';

const app = new Koa();
app.use(logger);
app.use(redirectToHttps);
app.use(router.routes());

const httpServer = Http.createServer(app.callback());

const httpsServer = Https.createServer({
  key: Fs.readFileSync(Config.https.keyPath),
  cert: Fs.readFileSync(Config.https.certPath),
}, app.callback());

httpServer.listen(Config.http.port, undefined, undefined, () => {
  const date = new Date();
  console.log(`http server running on ${Config.http.port} [${date.toLocaleString()}]`);
});

httpsServer.listen(Config.https.port, undefined, undefined, () => {
  const date = new Date();
  console.log(`https server running on ${Config.https.port} [${date.toLocaleString()}]`);
});
