import Fs from 'fs';

interface ServerConfig {
  port: number;
  dataRoot: string;
  publicRoot: string
  corsAllows: string[];
}

const configPath = './config.json';

const defaultConfig: ServerConfig = {
  port: 3000,
  dataRoot: '../testData',
  publicRoot: '../nas_explorer_client/build',
  corsAllows: [

  ],
}

function checkConfigFile(piece: any, defaultPiece: any) {
  let resultPiece: any;

  if ((typeof defaultPiece === 'object') && !(defaultPiece instanceof Array)) {
    resultPiece = {};
    Object.keys(defaultPiece).forEach(key => {
      resultPiece[key] = (typeof piece[key] === 'undefined')
        ? defaultPiece[key]
        : checkConfigFile(piece[key], defaultPiece[key]);
    });
  } else {
    resultPiece = (typeof piece === undefined)
      ? defaultPiece
      : piece;
  }

  return resultPiece;
}

function renewConfigFile(inputConfig: ServerConfig): ServerConfig {
  const config = checkConfigFile(inputConfig, defaultConfig) as ServerConfig;
  const configString = JSON.stringify(config, undefined, 2);

  // TODO: Find better condition
  const shouldRenew = !(configString === JSON.stringify(inputConfig, undefined, 2));
  if(shouldRenew) {
    Fs.writeFile(configPath, configString, error => {
      if(!error) return console.log('Renewed configuration file.');
      console.error('Failed to renew configuration file.');
      console.error(error) 
    });
  }

  return config;
}

function makeConfigFile() {
  const configString = JSON.stringify(defaultConfig, undefined, 2);

  Fs.writeFile(configPath, configString, error => {
    if(!error) return console.log('Created a configuration file.');
    console.error('Failed to create configuration file.');
    console.error(error) 
  });
}

function getConfigFile(): ServerConfig {
  try {
    const inputConfigString = Fs.readFileSync(configPath, 'utf8');
    const inputConfig = JSON.parse(inputConfigString);
    const config = renewConfigFile(inputConfig);
    return config;
  } catch (error) {
    if(error.code !== 'ENOENT') throw error;
    makeConfigFile();
    return defaultConfig;
  }
}

export = getConfigFile();
