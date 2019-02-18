export interface AppConfig {
  port: number;
  dataRood: string;
}

const config: AppConfig = {
  port: 3000,
  dataRood: __dirname + './../testData',
};

export { config };