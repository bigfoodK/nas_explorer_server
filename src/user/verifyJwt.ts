import Jwt from 'jsonwebtoken';
import config from '../config';

export type VerifiedUserJwtPayload = {
  uuid: string;
}

export default function verifyJwt(jwt: string): Promise<VerifiedUserJwtPayload> {
  return new Promise((resolve, reject) => {
    Jwt.verify(jwt, config.user.jwtSecreatKey, (error, payload) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(payload as VerifiedUserJwtPayload);
    });
  });
}
