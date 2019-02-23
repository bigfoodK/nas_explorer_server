import Koa from 'koa';
import Fs from 'fs';
import Mime from 'mime';
import { config } from './config';

export async function getFileStatAsync(path: string) {
  try {
    const stats = await Fs.promises.stat(path);
    return stats;
  } catch (e) {
    if(e.code === 'ENOENT') return false;
    throw e;
  }
}

export function sendFile(ctx: Koa.Context, filePath: string, size: number, isDownload: boolean) {
  const contentType = isDownload
    ? 'application/octet-stream'
    : getMimeTypeFromExtname(filePath);

  ctx.set('Content-Type', contentType);
  ctx.set('Content-Length', `${size}`);
  ctx.body = Fs.createReadStream(filePath);
}

export function getMimeTypeFromExtname(filePath: string) {
  return Mime.getType(filePath) || 'application/octet-stream';
}

export function setCORS(ctx: Koa.Context) {
  const originName = ctx.request.header.origin;
  if(config.corsAllows.indexOf(originName) === -1) return;
  ctx.set('Access-Control-Allow-Origin', originName);
}