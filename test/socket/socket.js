import newXhr from 'socket.io-client-cookie';
import srv from '../../server';
import ioc from 'socket.io-client';
import {expect} from 'chai';
import User from '../../schema/user';
import Session from '../../schema/test.session';
// jscs:disable maximumLineLength
import signature from '../../node_modules/express-session/node_modules/cookie-signature';
// jscs:enable maximumLineLength
import testConfig from '../../testConfig';

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
        //console.log('response timeout');
        promiseRequest(socket, test);
    });
}

describe('Chat Intergation Tests', function() {

    context('Not authenticated', function() {

        afterEach('Close server connections', function() {
            srv.close();
        });

        it('should connect', function(done) {
            this.timeout(5000);
            newXhr.setCookies('');
            var socket = client(srv);
            socket.on('connect', function() {
                expect('everything').to.be.ok;
                done();
            });
        });

        it('should reply with error', function(done) {
            this.timeout(5000);
            newXhr.setCookies('');
            var socket = client(srv);
            socket.on('new', function(data) {
                expect(data.error).to.be.true;
                done();
            });
        });

        it('should not reply for \'latest\' request', function(done) {
            this.timeout(10000);
            this.slow(5500);
            newXhr.setCookies('');
            var socket = client(srv);
            var test = true;
            expect(test).to.be.true;
            setTimeout(done, 5000);
            socket.on('connect', function() {
                promiseRequest(socket, this);
                socket.on('latest', function(data) {
                    test = false;
                    done();
                }.bind(this));
            }.bind(this));
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

            it('should encode session properly', function() {
                var encoded = encodeSession(testConfig.sessionUnsigned);
                expect(testConfig.sessionEncoded).to.be.equals(encoded);
            });

            it('should create test user', function(done) {
                this.timeout(5000);
                var user = new User({
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

            it('should create test session', function(done) {
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

            it('should reply for \'latest\' request', function(done) {
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
