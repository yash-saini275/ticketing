import {json} from 'body-parser';
import {currentUser, App} from '@ysaini_tickets/common';
const cookieSession = require('cookie-session');

import {ticketsRouter} from './tickets/controller';
import {DatabaseConfig} from './db-config';
import {natsWrapper} from './nats-wrapper';

class Application {
  private app: App;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      DatabaseConfig.connect();

      natsWrapper.connect(
        process.env.NATS_CLUSTER_ID!,
        process.env.NATS_CLIENT_ID!,
        process.env.NATS_URI!
      );

      natsWrapper.client.on('close', () => {
        console.log('NATS connection closed.');
        // eslint-disable-next-line no-process-exit
        process.exit();
      });

      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());
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
