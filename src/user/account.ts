import db from '../db';

export type Account = {
  id: string;
  nickname: string;
}

export async function getAccount(uuid: string) {
  try {
    return await db.get('Account.' + uuid) as Account;
  } catch (error) {
    return undefined;
  }
}

export async function putAccount(uuid: string, account: Account) {
  return await db.put('Account.' + uuid, account);
}
