/* eslint-disable node/no-unpublished-import */
import * as mongoose from 'mongoose';
import {Express} from 'express';
import {MongoMemoryServer} from 'mongodb-memory-server';
import * as jwt from 'jsonwebtoken';
import {Application} from '../app-config';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
      app: Express;
    }
  }
}

let mongo: MongoMemoryServer;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload.
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT.
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the session object.
  const session = {jwt: token};

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take that JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string
  return [`express:sess=${base64}`];
};

global.app = new Application().getApp();
