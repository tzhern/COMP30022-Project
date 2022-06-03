/*
  Original from https://blog.stvmlbrn.com/2018/06/18/test-jwt-authenticated-express-routes-with-jest-and-supertest.html
  Modified by Yifei Wang on Oct 1, 2021
*/

const request = require('supertest');
const app = require('../../app'); // the express server

let token;

beforeAll((done) => {
  request(app)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({
      emailAddress: 'test@test.com',
      password: 'test123456',
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe('Integration test: GET /profile to test JWT-Authenticated', () => {
  // token not being sent - should respond with a 401
  test('It should require authorization', () => {
    return request(app)
      .get('/profile')
      .then((response) => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test('It responds with JSON', () => {
    return request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('application/json');
      });
  });
});
