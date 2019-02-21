import fs from 'fs';
import Koa from 'koa';
import path, { extname } from 'path';
import { config } from './config';

type FileIndex = {
  type: ('directory' | 'text' | 'image' | 'audio' | 'video' | 'binary');
  name: string;
  path: string;
  size: number;
  createdAtMs: Date;
  modifiedAtMs: Date;
}

const rootDir = config.dataRoot;

export default async function serveData(ctx: Koa.Context, next: () => Promise<any>) {
  const normalizedPath = path.posix.normalize(ctx.params.path || '/');
  const isUpperPath = normalizedPath.startsWith('../') || normalizedPath.startsWith('..\\') || normalizedPath === '..';

  if(isUpperPath) {
    ctx.status = 403;
    return;
  }

  const directoryPath = path.join(rootDir, normalizedPath);
  const stat = await getDirectoryStat(directoryPath);

  if(!stat) {
    ctx.status = 404;
    return;
  }

  const directoryEntries = await fs.promises.readdir(directoryPath);
  const promisesMakingFileIndex: Promise<void>[] = [];
  const fileIndexes: FileIndex[] = [];

  directoryEntries.forEach(fileName => {
    const filePath = path.join(directoryPath, fileName);
    const urlFilePath = path.posix.join(normalizedPath, fileName);
    
    promisesMakingFileIndex.push(
      fs.promises.stat(filePath)
      .then(fileStats => {
        const type = fileStats.isDirectory()
          ? 'directory' 
          : identifyFileType(fileName);
        
        fileIndexes.push({
          type: type,
          name: fileName,
          path: urlFilePath,
          size: fileStats.size,
          createdAtMs: fileStats.birthtime,
          modifiedAtMs: fileStats.mtime,
        });
      })
    );
  });

  await Promise.all(promisesMakingFileIndex);

  sendIndex(ctx, fileIndexes);
}

async function getDirectoryStat(path: string) {
  try {
    const stats = await fs.promises.stat(path);

    if (!stats.isDirectory()) return false;
    return stats;

  } catch (e) {
    switch (e.code) {
      case 'ENOENT':
        return false;
    
      default:
        throw e;
    }
  }
}

function sendIndex(ctx: Koa.Context, fileIndexes: FileIndex[]) {
  ctx.set('Content-Type', 'application/json');
  ctx.body = fileIndexes;
}

function identifyFileType(name: string) {
  const extensionName = path.extname(name);

  switch (extensionName) {
    case '.txt':
    case '.html':
    return 'text';

    case '.jpg':
    case '.png':
    return 'image';

    case '.mp3':
    return 'audio';

    case '.mp4':
    return 'video';

    default:
    return 'binary';
  }
}
