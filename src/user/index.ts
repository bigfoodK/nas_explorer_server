import { getAccount } from './account';
import signup from './signup';
import signin from './passwordAuthenticate';
import issueJwt from './issueJwt';
export { Account } from './account';

const User = {
  getAccount,
  signup,
  signin,
  issueJwt,
};

export default User;
