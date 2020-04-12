import Koa from 'koa';
import { AuthenticationSigninRequest, AuthenticationSigninResponseMessage, AuthenticationSigninResponseData } from '../../responseTypes';
import { sendResponse } from '../../commonUtils';
import User from '../../user';

export default async function signin(ctx: Koa.Context, next: () => Promise<any>) {
  const request = ctx.request.body as AuthenticationSigninRequest;
  const {
    id,
    password,
  } = request;

  if (!id) {
    return;
  }
  if (!password) {
    return;
  }
  const uuid = await User.signin({
    id,
    password,
  });

  if (!uuid) {
    sendResponse<AuthenticationSigninResponseMessage, AuthenticationSigninResponseData>(ctx, {
      isSuccessful: false,
      message: "No such account exist or Incorrect password",
      data: {
        jwt: '',
        id: '',
        nickname: '',
      },
    });
    return;
  }

  const jwt = await User.issueJwt({
    uuid,
  });

  const user = await User.getAccount(uuid);
  if (!user) {
    throw(new Error('user not found'));
  }

  sendResponse<AuthenticationSigninResponseMessage, AuthenticationSigninResponseData>(ctx, {
    isSuccessful: true,
    message: "Successfully logged in",
    data: {
      jwt,
      id,
      nickname: user.nickname,
    },
  });
}
