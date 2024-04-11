import newXhr from 'socket.io-client-cookie';
import srv from '../../lib/server';
import ioc from 'socket.io-client';
import {expect} from 'chai';
import User from '../../lib/user';
import Session from '../../schema/test.session';
import signature from 'cookie-signature';
import testConfig from './socketConfig';

const USER_OAUTH = 1234567890;
const USER_NAME = 'test';
const USER_PROVIDER = 'test_provider';
const USER_AVATAR = 'test_avatar';
const TEST_MESSAGE = 'this is the test message';

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
    return ioc(url, {forceNew: true});
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

describe('Chat Intergation Tests', () => {

    context('Not authenticated', () => {

        afterEach('Close server connections', () => {
            srv.close();
        });

        it('should connect', function(done) {
            this.timeout(5000);
            newXhr.setCookies('');
            var socket = client(srv);
            socket.on('connect', () => {
                socket.removeAllListeners();
                done();
            });
        });

        it('should not broadcast messages', function(done) {
            this.timeout(10000);
            newXhr.setCookies('');
            let socket1 = client(srv);
            let socket2 = client(srv);
            let test = true;
            socket2.on('new', () => {
                test = false;
                done();
            });
            expect(test).to.eq(true);
            socket1.emit('submit', {text: TEST_MESSAGE});
            setTimeout(() => {
                socket2.removeAllListeners();
                done();
            }, 5000);
        });

    });

    context('Authenticated', () => {

        before('Remove test users and sessions', function(done) {
            this.timeout(5000);
            User.find({oauthID: USER_OAUTH, provider: USER_PROVIDER}).remove(() => {
                Session.find({isTest: true}).remove(done);
            });
        });

        after('Remove test user and session', function(done) {
            this.timeout(5000);
            User.findByIdAndRemove(testConfig.testUserID, () => {
                Session.findByIdAndRemove(testConfig.testSessionID, done);
            });
        });

        context('Prepare', () => {

            it('should encode session properly', () => {
                var encoded = encodeSession(testConfig.sessionUnsigned);
                expect(testConfig.sessionEncoded).to.be.equals(encoded);
            });

            it('should create test user', function(done) {
                this.timeout(5000);
                var user = new User({
                    oauthID: USER_OAUTH,
                    name: USER_NAME,
                    created: Date.now(),
                    provider: USER_PROVIDER,
                    avatar: USER_AVATAR
                });
                user.save((err, newuser) => {
                    if (err) {
                        done(err);
                    } else {
                        testConfig.user = newuser;
                        expect(testConfig.user._id).to.not.eq(undefined);
                        expect(testConfig.user._id).to.not.eq(null);
                        expect(testConfig.user.oauthID).to.eq(USER_OAUTH);
                        expect(testConfig.user.name).to.eq(USER_NAME);
                        expect(testConfig.user.provider).to.eq(USER_PROVIDER);
                        expect(testConfig.user.avatar).to.eq(USER_AVATAR);
                        done();
                    }
                });
            });

            it('should create test session', (done) => {
                var session = new Session({
                    _id: 'test_' + Date.now().toString(),
                    session: JSON.stringify({
                        cookie: {
                            expires: null,
                            path: '/'
                        },
                        passport: {
                            user: {
                                _id: testConfig.user._id,
                                name: testConfig.user.name,
                                provider: testConfig.user.provider,
                                avatar: testConfig.user.avatar
                            }
                        }
                    }),
                    expires: Date.now() + 3600,
                    isTest: true
                });
                session.save((err, newsession) => {
                    if (err) {
                        done(err);
                    } else {
                        testConfig.testSessionID = newsession._id;
                        expect(testConfig.testSessionID).to.not.eq(undefined);
                        expect(testConfig.testSessionID).to.not.eq(null);
                        done();
                    }
                });
            });

        });

        context('Test connection', () => {

            afterEach('Close server connections', () => {
                srv.close();
            });

            it('should emit \'new\' event with latest messages', function(done) {
                this.timeout(12000);
                newXhr.setCookies(cookieSession(testConfig.testSessionID));
                let socket = client(srv);
                socket.on('connect', () => {
                    socket.on('new', data => {
                        expect(data.error).to.eq(false);
                        expect(data.areLatest).to.eq(true);
                        expect(data.messages).to.be.an('array');
                        socket.removeAllListeners();
                        done();
                    });
                });
            });

            it('should broadcast messages on \'submit\' event', function(done) {
                this.timeout(15000);
                newXhr.setCookies(cookieSession(testConfig.testSessionID));
                let socket1 = client(srv);
                let socket2 = client(srv);
                socket2.on('connect', () => {
                    socket2.on('new', data => {
                        if (!data.areLatest) {
                            expect(data.error).to.eq(false);
                            expect(data.messages).to.be.an('array');
                            expect(data.messages.length).to.eq(1);
                            expect(data.messages[0]).to.be.an('object');
                            expect(data.messages[0]).to.contain.all.keys(['_id', 'author', 'text', 'at']);
                            expect(data.messages[0].author).to.be.an('object');
                            expect(data.messages[0].author.id).to.eq(testConfig.user._id.toString());
                            expect(data.messages[0].author.name).to.eq(testConfig.user.name);
                            expect(data.messages[0].author.provider).to.eq(testConfig.user.provider);
                            expect(data.messages[0].author.avatar).to.eq(testConfig.user.avatar);
                            expect(data.messages[0].text).to.eq(TEST_MESSAGE);
                            socket2.removeAllListeners();
                            done();
                        }
                    });
                });
                socket1.on('connect', () => {
                    socket1.emit('submit', {text: TEST_MESSAGE});
                    socket1.removeAllListeners();
                });
            });

        });

    });

});
