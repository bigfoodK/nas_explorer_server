export interface AppConfig {
  port: number;
  dataRoot: string;
}

const config: AppConfig = {
  port: 3000,
  dataRoot: __dirname + './../testData',
};

export { config };