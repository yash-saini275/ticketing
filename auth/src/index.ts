import * as express from 'express';
// import 'express-async-errors';
import {json} from 'body-parser';
import * as mongoose from 'mongoose';
const cookieSession = require('cookie-session');

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';
import {config} from './config';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req: express.Request, res: express.Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  await mongoose
    .connect(config.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(value => {
      console.log('Successfully Connected to DB.');
    })
    .catch(reason => {
      console.error(reason);
    });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
