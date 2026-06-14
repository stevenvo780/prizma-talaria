import path from 'path';
import Database from '.';
import config from '..';

export default function initializeDatabase(baseDir: string): Database {
  const { database } = config;

  return new Database({
    ...database,
    entitiesPath: path.join(baseDir, database.entitiesPath),
  });
}
