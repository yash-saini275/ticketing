import {randomBytes} from 'crypto';
import * as nats from 'node-nats-streaming';

import {TicketCreatedListener} from './events/ticket-created-listener';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222/',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed.');
    // eslint-disable-next-line no-process-exit
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
