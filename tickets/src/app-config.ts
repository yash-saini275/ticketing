import {json} from 'body-parser';
import {currentUser, App} from '@ysaini_tickets/common';
const cookieSession = require('cookie-session');

import {ticketsRouter} from './tickets/controller';
import {DatabaseConfig} from './db-config';

class Application {
  private app: App;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      DatabaseConfig.connect();
    }

    this.app = new App(
      [ticketsRouter],
      [
        json(),
        cookieSession({
          signed: false,
          secure: process.env.NODE_ENV !== 'test',
        }),
        currentUser,
      ]
    );
  }

  public start(portNumber: number) {
    this.app.start(portNumber);
  }

  public getApp() {
    return this.app.getApp();
  }
}

export {Application};
