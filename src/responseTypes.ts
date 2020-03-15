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
