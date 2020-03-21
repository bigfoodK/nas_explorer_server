import Fs from 'fs';
import Koa from 'koa';
import Path from 'path';
import { getFileStatAsync, setCORS, sendResponse } from '../../commonUtils';
import Config from '../../config';
import { FileType, FileIndex } from '../../commonInterfaces';
import { ServeIndexResponseData, ServeIndexResponseMessage } from '../../responseTypes';

const rootDir = Config.dataRoot;

export default async function serveData(ctx: Koa.Context, next: () => Promise<any>) {
  const normalizedPath = Path.posix.normalize(ctx.params.path || '/');
  const isUpperPath = normalizedPath.startsWith('../') || normalizedPath.startsWith('..\\') || normalizedPath === '..';
  
  setCORS(ctx);

  if(isUpperPath) {
    sendResponse<ServeIndexResponseMessage, ServeIndexResponseData>(ctx, {
      isSuccessful: false,
      message: "Upper path not allowed",
      data: {
        fileIndexes: []
      }
    });
    return;
  }

  const directoryPath = Path.join(rootDir, normalizedPath);
  const stat = await getFileStatAsync(directoryPath);

  if(!stat || stat.isFile()) {
    sendResponse<ServeIndexResponseMessage, ServeIndexResponseData>(ctx, {
      isSuccessful: false,
      message: "No such dir exist",
      data: {
        fileIndexes: []
      }
    });
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

  sendResponse<ServeIndexResponseMessage, ServeIndexResponseData>(ctx, {
    isSuccessful: true,
    message: "Successfully fetched index",
    data: {
      fileIndexes
    }
  });
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
