export interface AppConfig {
  port: number;
  dataRoot: string;
  publicRoot: string
  corsAllows: string[];
}

const config: AppConfig = {
  port: 3000,
  dataRoot: __dirname + './../testData',
  publicRoot: __dirname + './../public',
  corsAllows: [
    // for debug client
    'http://localhost:3001'
  ],
};

export { config };