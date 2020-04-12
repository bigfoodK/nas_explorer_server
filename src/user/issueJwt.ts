import Jwt from 'jsonwebtoken';
import config from '../config';

export type IssueJwtOption = {
  uuid: string;
  expiresIn?: string;
}

export default function issueJwt(option: IssueJwtOption): Promise<string> {
  const {
    uuid,
    expiresIn,
  } = option;
  return new Promise((resolve, reject) => {
    Jwt.sign({
      uuid
    }, config.user.jwtSecreatKey, {
      expiresIn: expiresIn || '7d',
      issuer: 'issueJwt',
    }, (error, jwt) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(jwt);
    });
  });
}
