import Koa from 'koa';
import verifyJwt from './user/verifyJwt';
import User from './user';
import { CustomState } from './commonInterfaces';

export default async function authenticate(ctx: Koa.ParameterizedContext<CustomState>, next: () => Promise<any>) {
  const jwt = ctx.cookies.get('Authorization');
  if (!jwt) {
    await next();
    return;
  }
  const verifiedUserJwtPayload = await verifyJwt(jwt);
  ctx.state.user = await User.getAccount(verifiedUserJwtPayload.uuid);
  next();
}
