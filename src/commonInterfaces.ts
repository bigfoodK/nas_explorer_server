export enum FileType {
  'directory',
  'text',
  'image',
  'audio',
  'video',
  'binary',
}

export type FileIndex = {
  type: FileType;
  name: string;
  path: string;
  size: number;
  createdAtMs: number;
  modifiedAtMs: number;
}
