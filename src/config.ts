export interface AppConfig {
  port: number;
  dataRoot: string;
  publicRoot: string
}

const config: AppConfig = {
  port: 3000,
  dataRoot: __dirname + './../testData',
  publicRoot: __dirname + './../public',
};

export { config };