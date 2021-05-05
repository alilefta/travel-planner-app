/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../server');
describe('Post Endpoints', () => {
  it('should create a new get', async () => {
    const res = await request(app).get('/');
    try{
      expect(res.statusCode).toEqual(200);
      expect(res.ok).toEqual(true);
    }catch(err){
      expect(err).toEqual(err);
    }
    
  });

  it('Should make post request test ', async () => {
    const res = await request(app).post('/helloWorld').send({
      msg: 'hello'
    });
    expect(res.body).toEqual({});
  });

  it('Make post request to get trips', async () => {
    const tripData = [{
        date: "2021-05-20",
        destination: "baghdad",
        endDate: "",
        id: "1620240363765"
    }];
    const res = await request(app).post('/trips').send(tripData).then(data => data);
    expect(res.body).toEqual({"trips": tripData})
  });
});


