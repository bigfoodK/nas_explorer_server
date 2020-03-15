import Fs from 'fs';
import Koa from 'koa';
import Path from 'path';
import { getFileStatAsync, setCORS } from './commonUtils';
import Config from './config';
import { FileType, FileIndex } from './commonInterfaces';

const rootDir = Config.dataRoot;

export default async function serveData(ctx: Koa.Context, next: () => Promise<any>) {
  const normalizedPath = Path.posix.normalize(ctx.params.path || '/');
  const isUpperPath = normalizedPath.startsWith('../') || normalizedPath.startsWith('..\\') || normalizedPath === '..';
  
  setCORS(ctx);

  if(isUpperPath) {
    ctx.status = 403;
    return;
  }

  const directoryPath = Path.join(rootDir, normalizedPath);
  const stat = await getFileStatAsync(directoryPath);

  if(!stat || stat.isFile()) {
    ctx.status = 404;
    return;
  }

  const directoryEntries = await Fs.promises.readdir(directoryPath);
  const promisesMakingFileIndex: Promise<void>[] = [];
  const fileIndexes: FileIndex[] = [];

  directoryEntries.forEach(fileName => {
    const filePath = Path.join(directoryPath, fileName);
    const urlFilePath = Path.posix.join('/', normalizedPath, fileName);
    
    promisesMakingFileIndex.push(
      Fs.promises.stat(filePath)
      .then(fileStats => {
        const type = fileStats.isDirectory()
          ? FileType.directory 
          : identifyFileType(fileName);
        
        fileIndexes.push({
          type: type,
          name: fileName,
          path: urlFilePath,
          size: fileStats.size,
          createdAtMs: fileStats.birthtimeMs,
          modifiedAtMs: fileStats.mtimeMs,
        });
      })
    );
  });

  await Promise.all(promisesMakingFileIndex);

  sendIndex(ctx, fileIndexes);
}

function sendIndex(ctx: Koa.Context, fileIndexes: FileIndex[]) {
  ctx.set('Content-Type', 'application/json');
  ctx.body = fileIndexes;
}

function identifyFileType(name: string) {
  const extensionName = Path.extname(name);

  switch (extensionName) {
    case '.txt':
    case '.html':
    case '.smi':
    return FileType.text;

    case '.jpg':
    case '.png':
    case '.webp':
    return FileType.image;

    case '.mp3':
    return FileType.audio;

    case '.mp4':
    case '.mkv':
    case '.wepm':
    return FileType.video;

    default:
    return FileType.binary;
  }
}
