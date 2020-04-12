import Sha256 from 'sha256';

export default function hashPassword(password: string, salt: string) {
  return Sha256(password + salt);
}
