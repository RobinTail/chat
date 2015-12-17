var newXhr = require('socket.io-client-cookie');
var srv = require('../server');
var ioc = require('socket.io-client');
var expect = require('chai').expect;
var https = require('https');
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

function cookieSession(encoded) {
    return testConfig.cookieName + '=' + encoded;
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

    describe('Client connection', function() {

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

            afterEach('Close server connections', function() {
                srv.close();
            });

            it('Should encode session properly', function() {
                var encoded = encodeSession(testConfig.sessionUnsigned);
                expect(testConfig.sessionEncoded).to.be.equals(encoded);
            }.bind(this));

            it('Should feed latest', function(done) {
                this.timeout(12000);
                this.isLoaded = false;
                newXhr.setCookies(cookieSession(testConfig.cookieValue));
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
