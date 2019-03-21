import Fs from 'fs';
import Koa from 'koa';
import Path from 'path';
import Config from './config';
import { getFileStatAsync, sendFile, getMimeTypeFromExtname, setCORS } from './commonUtils';

type Range = {
  start: number;
  end: number;
  totalLength: number;
}

const rootDir = Config.dataRoot;

export default async function serveData(ctx: Koa.Context, next: () => Promise<any>) {
  const normalizedPath = Path.normalize(ctx.params.path || '/');
  const isUpperPath = normalizedPath.startsWith('../') || normalizedPath.startsWith('..\\') || normalizedPath === '..';
  
  setCORS(ctx);
  ctx.set('Accept-Ranges', 'bytes');

  if(isUpperPath) {
    ctx.status = 403;
    return;
  }

  const filePath = Path.join(rootDir, normalizedPath);
  const stat = await getFileStatAsync(filePath);

  if(!stat || stat.isDirectory()) {
    ctx.status = 404;
    return;
  }

  const range = parseRange(ctx.headers.range, stat.size);
  const isDownload = ctx.params.isDownload ? true : false;

  if(range === null) {
    return sendFile(ctx, filePath, stat.size, isDownload);
  }

  if (range.start >= stat.size || range.end >= stat.size) {
    return endRequestByInvaildRange(ctx, stat.size);
  }

  sendFileRange(ctx, filePath, range, isDownload);
}

function parseRange(range: string, totalLength: number): Range | null {
  if (typeof range === 'undefined' || range === null || range.length === 0) {
    return null;
  }

  const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
  const result = {
    start: parseInt(array[1]),
    end: parseInt(array[2]),
    totalLength: totalLength,
  };

  if (isNaN(result.end) || result.end < 0) result.end = totalLength - 1;
  if (isNaN(result.start) || result.start < 0) result.start = 0;

  return result;
}

function sendFileRange(ctx: Koa.Context, filePath: string, range: Range, isDownload: boolean) {
  const contentType = isDownload
  ? 'application/octet-stream'
  : getMimeTypeFromExtname(filePath);

  const fileStream = Fs.createReadStream(filePath, { start: range.start, end: range.end });

  ctx.set('Content-Type', contentType);
  ctx.set('Content-Length', `${range.end - range.start + 1}`);
  ctx.set('Accept-Ranges', 'bytes');
  ctx.set('Content-Range', `bytes ${range.start}-${range.end}/${range.totalLength}`);
  ctx.set('Cache-Control', 'no-cache');
  ctx.body = fileStream;
  ctx.status = 206;
}

function endRequestByInvaildRange(ctx: Koa.Context, size: number) {
  ctx.set('Content-Range', 'bytes */' + size);
  ctx.body = null;
  ctx.status = 416;
}