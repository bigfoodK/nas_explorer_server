import Router from 'koa-router';

export interface PluginInfo {
  name: string;
  author: string;
  version: number[];
  description: string;
}

export default abstract class PluginBase {
  public abstract readonly info: PluginInfo;

  public abstract router: Router;
}
