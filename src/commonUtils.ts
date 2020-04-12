import Koa from 'koa';
import Fs from 'fs';
import Mime from 'mime';
import Config from './config';
import { JSONResponse } from './responseTypes';

const alpabets = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

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

export function sendResponse<M, D>(ctx: Koa.Context, response: JSONResponse<M, D>) {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify(response);
}

export function getMimeTypeFromExtname(filePath: string) {
  return Mime.getType(filePath) || 'application/octet-stream';
}

export function setCORS(ctx: Koa.Context) {
  const originName = ctx.request.header.origin;
  if(Config.corsAllows.indexOf(originName) === -1) return;
  ctx.set('Access-Control-Allow-Origin', originName);
}

export function getRandomString(length: number) {
  let result = '';
  while (result.length < length) {
    result += alpabets[Math.floor(Math.random() * alpabets.length)];
  }
  return result;
}
