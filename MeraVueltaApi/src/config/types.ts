import { ServerApplicationState } from '@hapi/hapi';
import { Connection } from 'typeorm';
import firebase from 'firebase-admin';

export enum Environments {
  DEV = 'DEV',
  QA = 'QA',
  PROD = 'PROD',
}

export interface ApplicationState extends ServerApplicationState {
  connection: Connection;
  publicFirebaseService: firebase.app.App;
}

export interface FirebaseAuthOptions {
  firebaseContext: firebase.app.App;
  loadUser: boolean;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
  synchronize: boolean;
  logging: boolean;
  entitiesPath: string;
  migrationsPath: string;
}

export interface Options {
	routePrefix: string;
}
