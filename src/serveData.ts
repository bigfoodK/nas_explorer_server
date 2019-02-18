import fs from 'fs';
import Koa from 'koa';
import path from 'path';
import mime from 'mime';
import { config } from './config';

type Range = {
  start: number;
  end: number;
  totalLength: number;
}

const rootDir = config.dataRood;

export default async function serveData(ctx: Koa.Context, next: () => Promise<any>) {
  const filePath = refinePath(ctx.params.path || '/');
  const stat = await getFileStat(filePath);

  if(!stat) {
    ctx.status = 404;
    return;
  }

  const range = parseRange(ctx.headers.range, stat.size);

  if(range === null) {
    return sendFile(ctx, filePath, stat.size);
  }

  if (range.start >= stat.size || range.end >= stat.size) {
    return endRequest(ctx, stat.size);
  }

  sendFileRange(ctx, filePath, range);
}

function refinePath(_path: string) {
  _path = path.normalize(_path);
  _path = _path.replace(/(..\\)*/, '');
  _path = path.join(rootDir, _path);
  return _path;
}

async function getFileStat(path: string) {
  try {
    const stats = await fs.promises.stat(path);

    if (stats.isDirectory()) return false;
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

function sendFile(ctx: Koa.Context, filePath: string, size: number) {
  const contentType = mime.getType(filePath) || 'application/octet-stream';

  ctx.set('Content-Type', contentType);
  ctx.set('Content-Length', `${size}`);
  ctx.set('Accept-Ranges', 'bytes');
  ctx.body = fs.createReadStream(filePath);
}

function sendFileRange(ctx: Koa.Context, filePath: string, range: Range) {
  const contentType = mime.getType(filePath) || 'application/octet-stream';
  const fileStream = fs.createReadStream(filePath, { start: range.start, end: range.end });

  ctx.set('Content-Type', contentType);
  ctx.set('Content-Length', `${range.end - range.start + 1}`);
  ctx.set('Accept-Ranges', 'bytes');
  ctx.set('Content-Range', `bytes ${range.start}-${range.end}/${range.totalLength}`);
  ctx.set('Cache-Control', 'no-cache');
  ctx.body = fileStream;
  ctx.status = 206;
}

function endRequest(ctx: Koa.Context, size: number) {
  ctx.set('Content-Range', 'bytes */' + size);
  ctx.body = null;
  ctx.status = 416;
}