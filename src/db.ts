import Level from 'level-ts';
import config from './config';

const db = new Level(config.levelDb);

export default db;
