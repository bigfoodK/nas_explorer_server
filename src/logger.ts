import Koa from 'koa';

interface AppLogData {
  method: string;
  url: string;
  query: string;
  remoteAddress: string;
  host: string;
  userAgent: string;
  statusCode: number;
  errorMessage: string;
  errorStack: string;
  data: any;
  responseTime: number;
}

function printLog(data: Partial<AppLogData>, thrownError: any) {
  console.log(`${data.statusCode} ${data.method} ${data.url} from ${data.remoteAddress} ${data.userAgent} in ${data.responseTime}ms`);

  if (thrownError) {
      console.error(thrownError);
  }
}

export default async function logger(ctx: Koa.Context, next: () => Promise<any>) {
  const start = new Date().getMilliseconds();

  const logData: Partial<AppLogData> = {
      method: ctx.method,
      url: ctx.url,
      query: ctx.query,
      remoteAddress: ctx.request.ip,
      host: ctx.headers['host'],
      userAgent: ctx.headers['user-agent'],
  };

  let errorThrown: any = null;
  try {
      await next();
      logData.statusCode = ctx.status;
  }
  catch (e) {
      errorThrown = e;
      logData.errorMessage = e.message;
      logData.errorStack = e.stack;
      logData.statusCode = e.status || 500;
      if (e.data) {
          logData.data = e.data;
      }
  }

  logData.responseTime = new Date().getMilliseconds() - start;
  printLog(logData, errorThrown);

  if (errorThrown) {
      throw errorThrown;
  }
}