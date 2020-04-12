import hashPassword from "./hashPassword";
import { getPasswordAuthenticationData } from "./passwordAuthenticationData";

type PasswordAuthenticateOption = {
  id: string;
  password: string;
}

export default async function passwordAuthenticate(option: PasswordAuthenticateOption) {
  const {
    id,
    password,
  } = option;
  const passwordAuthenticationData = await getPasswordAuthenticationData(id);
  if (!passwordAuthenticationData) {
    return false;
  }
  const {
    uuid,
    salt,
    hashedPassword,
  } = passwordAuthenticationData;

  const isCorrectPassword = hashPassword(password, salt) === hashedPassword;
  if (isCorrectPassword) {
    return uuid;
  }
  return false;
}
