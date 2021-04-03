// eslint-disable-next-line node/no-unpublished-import
import * as request from 'supertest';
import {app} from '../../app';

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'testtest.com',
      password: 'test',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({password: 'sagsda'})
    .expect(400);

  await request(app)
    .post('/api/users/signin')
    .send({email: 'test@test.com'})
    .expect(400);

  await request(app).post('/api/users/signin').send({}).expect(400);
});

it('sets a cookie after successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('fails when a email that does not exist supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(400);
});

it('fails when incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'asfd',
    })
    .expect(400);
});
