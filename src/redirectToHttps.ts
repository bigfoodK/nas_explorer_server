import Koa from 'koa';
import Config from './config';

export default async function redirectToHttps(ctx: Koa.Context, next: () => Promise<any>) {
  if(!ctx.secure) ctx.redirect(`https://${ctx.hostname}:${Config.https.port}${ctx.path}`);
  await next();
}
