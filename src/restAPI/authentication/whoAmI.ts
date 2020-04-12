import Koa from 'koa';
import { sendResponse } from '../../commonUtils';
import { CustomState } from '../../commonInterfaces';

export default async function whoAmI(ctx: Koa.ParameterizedContext<CustomState>, next: () => Promise<any>) {
  const user = ctx.state.user;

  if (!user) {
    sendResponse(ctx, {
      isSuccessful: true,
      message: "Successfully logged in",
      data: {},
    });
    return;
  }

  const {
    id,
    nickname,
  } = user;

  sendResponse(ctx, {
    isSuccessful: true,
    message: "Successfully logged in",
    data: {
      id,
      nickname,
    },
  });
}
