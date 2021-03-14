import {json} from 'body-parser';
import {currentUser, App} from '@ysaini_tickets/common';
const cookieSession = require('cookie-session');

import {OrdersController} from './orders/controllers';
import {DatabaseConfig} from './db-config';
import {natsWrapper} from './nats-wrapper';
import {TicketCreatedListener} from './events/listeners/ticket-created-listener';
import {TicketUpdatedListener} from './events/listeners/ticket-updated-listener';
import {ExpirationCompleteListener} from './events/listeners/expiration-complete-listener';

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

      new TicketCreatedListener(natsWrapper.client).listen();
      new TicketUpdatedListener(natsWrapper.client).listen();
      new ExpirationCompleteListener(natsWrapper.client).listen();
    }

    this.app = new App(
      [OrdersController.controller()],
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
