import Koa from 'koa';
import { AuthenticationSignupRequest, AuthenticationSignupResponseMessage, AuthenticationSignupResponseData } from '../../responseTypes';
import { sendResponse } from '../../commonUtils';
import User from '../../user';

export default async function signup(ctx: Koa.Context, next: () => Promise<any>) {
  const request = ctx.request.body as AuthenticationSignupRequest;
  const {
    id,
    nickname,
    password,
  } = request;

  if (!id) {
    throw new Error('No id served');
  }
  if (!nickname) {
    throw new Error('No nickname served');
  }
  if (!password) {
    throw new Error('No password served');
  }
  const isSignedupSuccessfully = await User.signup({
    id,
    nickname,
    password,
  });

  if (!isSignedupSuccessfully) {
    sendResponse<AuthenticationSignupResponseMessage, AuthenticationSignupResponseData>(ctx, {
      isSuccessful: false,
      message: "Id already exist",
      data: {
        id,
        nickname,
      },
    });
    return;
  }

  sendResponse<AuthenticationSignupResponseMessage, AuthenticationSignupResponseData>(ctx, {
    isSuccessful: true,
    message: "Successfully signed up",
    data: {
      id,
      nickname,
    },
  });
}
