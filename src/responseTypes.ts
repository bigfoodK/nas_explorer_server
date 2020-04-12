import { FileIndex } from './commonInterfaces'

export type JSONResponse<M, D> = {
  isSuccessful: boolean;
  message: M;
  data: D;
}

export type ServeIndexResponseMessage = (
  | 'Successfully fetched index'
  | 'No such dir exist'
  | 'Upper path not allowed'
)

export type ServeIndexResponseData = {
  fileIndexes: FileIndex[];
}

export type AuthenticationSignupRequest = {
  id: string;
  password: string;
  nickname: string;
}

export type AuthenticationSignupResponseMessage = (
  | 'Successfully signed up'
  | 'Id already exist'
)

export type AuthenticationSignupResponseData = {
  id: string,
  nickname: string,
}

export type AuthenticationSigninRequest = {
  id: string;
  password: string;
}

export type AuthenticationSigninResponseMessage = (
  | 'Successfully logged in'
  | 'No such account exist or Incorrect password'
)

export type AuthenticationSigninResponseData = {
  jwt: string;
  id: string;
  nickname: string;
}
