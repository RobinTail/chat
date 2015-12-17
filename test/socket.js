var srv = require('../server');
var ioc = require('socket.io-client');
var expect = require('chai').expect;
var https = require('https');

// Creates a socket.io client for the given server
function client(srv, opts) {
    var addr = srv.address();
    if (!addr) { addr = srv.listen().address(); }
    if (!opts) { opts = {}; }
    var url = 'ws://localhost:' + addr.port;
    return ioc(url);
}

describe('Chat', function() {
    describe('Server', function() {

        describe('Not authenticated connection', function() {

            afterEach(function() {
                srv.close();
            });

            it('Should connect in 5 seconds', function(done) {
                this.timeout(5000);
                var socket = client(srv);
                socket.on('connect', function() {
                    expect('everything').to.be.ok;
                    done();
                });
            });

            it('Should connect with auth error', function(done) {
                this.timeout(5000);
                var socket = client(srv);
                socket.on('new', function(data) {
                    expect(data.error).to.be.true;
                    done();
                });
            });

        });

    });
});
