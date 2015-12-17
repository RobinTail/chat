var newXhr = require('socket.io-client-cookie');
var srv = require('../server');
var ioc = require('socket.io-client');
var expect = require('chai').expect;
var https = require('https');
var testConfig = require('../test.confg');

// Creates a socket.io client for the given server
function client(srv) {
    var addr = srv.address();
    if (!addr) { addr = srv.listen().address(); }
    var url = 'ws://localhost:' + addr.port;
    return ioc(url);
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

            it('Should feed latest', function(done) {
                this.timeout(12000);
                this.isLoaded = false;
                this.promiseRequest = function(socket) {
                    socket.emit('latest', {});
                    var checkLoaded = new Promise(function(resolve, reject) {
                        setTimeout(function() {
                            if (this.isLoaded) {
                                resolve();
                            } else {
                                reject();
                            }
                        }.bind(this), 3000);
                    }.bind(this));
                    checkLoaded.catch(function() {
                        console.log('response timeout');
                        this.promiseRequest(socket);
                    }.bind(this));
                };
                newXhr.setCookies(testConfig.cookie);
                var socket = client(srv);
                socket.on('connect', function() {
                    this.promiseRequest(socket);
                    socket.on('latest', function(data) {
                        this.isLoaded = true;
                        expect(data.error).to.be.false;
                        expect(data.messages).to.be.an('array');
                        done();
                    }.bind(this));
                }.bind(this));
            });

        });

    }); // connection
}); // chat
