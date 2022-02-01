const request = require('supertest');
const app = require('../server');
const expect = require('chai').expect;

describe('/POST Login', function() {
    it('Should success if username and password is correct', function(done) {
        request(app)
           .post('/api/user/login')
           .set('Accept', 'application/json')
           .set('Content-Type', 'application/json')
           .send({ username: 'jun', password: '123' })
           .expect(200)
           .expect('Content-Type', /json/)
           .expect(function(response) {
              expect(response.body).not.to.be.empty;
              expect(response.body).to.be.an('object');
              expect(response.body).to.have.property('message').eql('Successfully logged in!');
              expect(response.body.data.dataUser).to.have.property('username').eql('judy');
           })
           .end(done);
    }); 
});


describe('/POST Register', function() {
    it('Should success if unique username and valid password', function(done) {
        request(app)
           .post('/api/user/register')
           .set('Accept', 'application/json')
           .set('Content-Type', 'application/json')
           .send({ username: 'david2', password: '12345' })
           .expect(200)
           .expect('Content-Type', /json/)
           .expect(function(response) {
              expect(response.body).not.to.be.empty;
              expect(response.body).to.be.an('object');
              expect(response.body).to.have.property('status').eql(201);
              expect(response.body).to.have.property('message').eql('Register successful!');
              expect(response.body.data.user).to.have.property('username').eql('david2');
           })
           .end(done);
    }); 
}); //this unit test for register api also needs to verify valid password, currently missing this part