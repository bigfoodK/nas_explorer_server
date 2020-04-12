import db from "../db";

export type PasswordAuthenticationData = {
  uuid: string;
  salt: string;
  hashedPassword: string;
}

export async function getPasswordAuthenticationData(id: string) {
  try {
    return await db.get('PasswordAuthentication.' + id) as PasswordAuthenticationData;
  } catch (error) {
    return null;
  }
}

export async function putPasswordAuthenticationData(id: string, passwordAuthenticationData: PasswordAuthenticationData) {
  return await db.put('PasswordAuthentication.' + id, passwordAuthenticationData);
}
