var newXhr = require('socket.io-client-cookie');
var srv = require('../server');
var ioc = require('socket.io-client');
var expect = require('chai').expect;
var https = require('https');
var User = require('../schema/user');
var Session = require('../schema/test.session');
var signature = require('../node_modules/express-session/' +
                'node_modules/cookie-signature');
var testConfig = require('../test.confg');

/**
 * Creates a socket.io client for the given server
 *
 * @param {object} srv
 * @returns {object}
 */
function client(srv) {
    var addr = srv.address();
    if (!addr) { addr = srv.listen().address(); }
    var url = 'ws://localhost:' + addr.port;
    return ioc(url);
}

/**
 * Sign and encode session for cookie
 *
 * @param {string} value
 * @returns {string}
 */
function encodeSession(value) {
    return encodeURIComponent(
        's:' + signature.sign(
            value, testConfig.sessionSecret
        ));
}

/**
 * Prepare encoded session cookie
 *
 * @param {string} session
 * @returns {string}
 */
function cookieSession(session) {
    return testConfig.cookieName + '=' + encodeSession(session);
}

/**
 * Request latest messages in Promise
 * Checks test.isLoaded
 *
 * @param {object} socket
 * @param {object} test
 */
function promiseRequest(socket, test) {
    socket.emit('latest', {});
    var checkLoaded = new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (test.isLoaded) {
                resolve();
            } else {
                reject();
            }
        }, 3000);
    });
    checkLoaded.catch(function() {
        console.log('response timeout');
        promiseRequest(socket, test);
    });
}

describe('Chat Intergation Tests', function() {

    context('Not authenticated', function() {

        afterEach('Close server connections', function() {
            srv.close();
        });

        it('Should connect', function(done) {
            this.timeout(5000);
            newXhr.setCookies('');
            var socket = client(srv);
            socket.on('connect', function() {
                expect('everything').to.be.ok;
                done();
            });
        });

        it('Should reply with error', function(done) {
            this.timeout(5000);
            newXhr.setCookies('');
            var socket = client(srv);
            socket.on('new', function(data) {
                expect(data.error).to.be.true;
                done();
            });
        });

    });

    context('Authenticated', function() {

        before('Remove test users and sessions', function(done) {
            this.timeout(5000);
            User.find({oauthID: 0, provider: 'test'}).remove(function() {
                Session.find({isTest: true}).remove(done);
            });
        });

        after('Remove test user and session', function(done) {
            this.timeout(5000);
            User.findByIdAndRemove(testConfig.testUserID, function() {
                Session.findByIdAndRemove(testConfig.testSessionID, done);
            });
        });

        context('Prepare', function() {

            it('Should encode session properly', function() {
                var encoded = encodeSession(testConfig.sessionUnsigned);
                expect(testConfig.sessionEncoded).to.be.equals(encoded);
            });

            it('Should create test user', function(done) {
                this.timeout(5000);
                user = new User({
                    oauthID: 0,
                    name: 'test',
                    created: Date.now(),
                    provider: 'test'
                });
                user.save(function(err, user) {
                    if (err) {
                        done(err);
                    } else {
                        testConfig.testUserID = user._id;
                        expect(testConfig.testUserID).not.to.be.undefined;
                        expect(testConfig.testUserID).not.to.be.null;
                        done();
                    }
                });
            });

            it('Should create test session', function(done) {
                var session = new Session({
                    _id: 'test_' + Date.now().toString(),
                    session: JSON.stringify({
                        cookie: {
                            expires: null,
                            path: '/'
                        },
                        passport: {
                            user: testConfig.testUserID
                        }
                    }),
                    expires: Date.now() + 3600,
                    isTest: true
                });
                session.save(function(err, session) {
                    if (err) {
                        done(err);
                    } else {
                        testConfig.testSessionID = session._id;
                        expect('everything').to.be.ok;
                        done();
                    }
                });
            });

        });

        context('Test connection', function() {

            afterEach('Close server connections', function() {
                srv.close();
            });

            it('Should feed latest', function(done) {
                this.timeout(12000);
                this.isLoaded = false;
                newXhr.setCookies(cookieSession(testConfig.testSessionID));
                var socket = client(srv);
                socket.on('connect', function() {
                    promiseRequest(socket, this);
                    socket.on('latest', function(data) {
                        if (!this.isLoaded) {
                            this.isLoaded = true;
                            expect(data.error).to.be.false;
                            expect(data.messages).to.be.an('array');
                            done();
                        }
                    }.bind(this));
                }.bind(this));
            });

        });

    });

}); // chat
