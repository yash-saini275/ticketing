import * as mongoose from 'mongoose';

import {app} from './app';
import {config} from './config';

const start = async () => {
  if (!process.env.JWT_KEY) {
    console.log('JWT_KEY must be defined.');
  }
  await mongoose
    .connect(config.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(value => {
      console.log('Successfully Connected to DB.');
      app.listen(3000, () => {
        console.log('Listening on port 3000');
      });
    })
    .catch(reason => {
      console.error(reason);
    });
};

start();
