'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { TEST_DATABASE_URL } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const User = require('../models/user');

const expect = chai.expect;
chai.use(chaiHttp);
// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

describe('Lookmark API - Users', function () {
    const fullname = 'Example User';
    const email ='example@gmail.com'
    const username = 'exampleUser';
    const password = 'examplePass';

    before(function () {
      return mongoose.connect(TEST_DATABASE_URL)
        .then(() => mongoose.connection.db.dropDatabase());
    });

    beforeEach(function () {
       User.ensureIndexes();
    });

    afterEach(function () {
        return mongoose.connection.db.dropDatabase();
    });

    after(function () {
        return mongoose.disconnect();
    });

describe('/api/users', function () {
    describe('POST', function () {
        it('should reject users with a missing username', function () {
            const user = { password, email, fullname };
            return chai.request(app)
            .post('/api/users')
            .send(user)
            .catch(err => err.response)
            .then(res => {
                expect(res).to.have.status(422);
                expect(res.body.message).to.equal('Missing username in request body');
            });
        });

        it('should reject users with a missing password', function() {
            const user = { username, fullname, email };
            return chai.request(app)
            .post('/api/users')
            .send(user)
            .catch(err => err.response)
            .then(res => {
                expect(res).to.have.status(422);
                expect(res.body.message).to.equal('Missing password in request body');
            });
        });

        
        })
    });
});