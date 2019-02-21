import fs from 'fs';
import Koa from 'koa';
import path from 'path';
import mime from 'mime';
import { config } from './config';

const rootDir = config.publicRoot;

export default async function servePublic(ctx: Koa.Context, next: () => Promise<any>) {
  const normalizedPath = path.normalize(ctx.params.path || '/');
  const isUpperPath = normalizedPath.startsWith('../') || normalizedPath.startsWith('..\\') || normalizedPath === '..';

  if(isUpperPath) {
    ctx.status = 403;
    return;
  }

  const filePath = path.join(rootDir, normalizedPath);
  const stat = await getFileStat(filePath);

  if(!stat) {
    ctx.status = 404;
    return;
  }

  sendFile(ctx, filePath, stat.size);
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

function sendFile(ctx: Koa.Context, filePath: string, size: number) {
  const contentType = mime.getType(filePath) || 'application/octet-stream';
    
  ctx.set('Content-Type', contentType);
  ctx.set('Content-Length', `${size}`);
  ctx.set('Accept-Ranges', 'bytes');
  ctx.body = fs.createReadStream(filePath);
}