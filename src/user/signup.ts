import { v4 as uuid } from 'uuid';
import { getPasswordAuthenticationData, putPasswordAuthenticationData } from './passwordAuthenticationData';
import { putAccount } from './account';
import { getRandomString } from '../commonUtils';
import hashPassword from './hashPassword';

type SignupOption = {
  id: string;
  password: string;
  nickname: string;
}

export default async function signup(option: SignupOption) {
  const {
    id,
    password,
    nickname,
  } = option;
  const isDuplicatedId = await getPasswordAuthenticationData(id);
  if (isDuplicatedId) {
    return false;
  }

  const userUuid = uuid();
  const salt = getRandomString(8);

  await Promise.all([
    putAccount(userUuid, {
      id,
      nickname,
    }),
    putPasswordAuthenticationData(id, {
      hashedPassword: hashPassword(password, salt),
      salt,
      uuid: userUuid,
    })
  ]);
  return true;
}
