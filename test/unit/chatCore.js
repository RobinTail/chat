import {expect} from 'chai';
import * as chatCore from '../../lib/chatCore';
import EventEmitter from 'events';

describe('Chat Core Tests', function() {
    let socket;

    beforeEach('Init Mock Object', function() {
        socket = new EventEmitter();
        socket.broadcast = new EventEmitter();
        socket.handshake = {
            session: {
                passport: {
                    user: 0,
                    userName: 'test',
                    provider: 'test'
                }
            }
        };
    });

    describe('sendError()', function() {

        it('should emit an event \'new\' with error message', function(done) {
            socket.on('new', data => {
                expect(data).to.be.an('object');
                expect(data).to.contain.all.keys(['error','message']);
                expect(data.error).to.eq(true);
                expect(data.message).to.eq('test');
                done();
            });
            chatCore.sendError(socket, 'test');
        });

    });

    describe('enterChat()', function() {

        it('should broadcast an event \'new\' with system message', function(done) {
            socket.broadcast.on('new', data => {
                expect(data).to.be.an('object');
                expect(data).to.contain.all.keys(['error','messages']);
                expect(data.error).to.eq(false);
                expect(data.messages).to.be.an('array');
                expect(data.messages.length).to.be.eq(1);
                expect(data.messages[0]).to.be.an('object');
                expect(data.messages[0]).to.contain.key('isSystem');
                expect(data.messages[0].isSystem).to.eq(true);
                done();
            });
            chatCore.enterChat(socket);
        });

    });

    describe('leaveChat()', function() {

        it('should broadcast an event \'new\' with system message', function(done) {
            socket.broadcast.on('new', data => {
                expect(data).to.be.an('object');
                expect(data).to.contain.all.keys(['error','messages']);
                expect(data.error).to.eq(false);
                expect(data.messages).to.be.an('array');
                expect(data.messages.length).to.be.eq(1);
                expect(data.messages[0]).to.be.an('object');
                expect(data.messages[0]).to.contain.key('isSystem');
                expect(data.messages[0].isSystem).to.eq(true);
                done();
            });
            chatCore.enterChat(socket);
        });

    });

    describe('startTyping()', function() {

        it('should broadcast an event \'start_typing\' with name', function(done) {
            socket.broadcast.on('start_typing', data => {
                expect(data).to.be.an('object');
                expect(data).to.contain.all.keys(['id','name']);
                expect(data.id).to.be.eq(0);
                expect(data.name).to.be.eq('test');
                done();
            });
            chatCore.startTyping(socket);
        });

    });

    describe('stopTyping()', function() {

        it('should broadcast an event \'stop_typing\' with name', function(done) {
            socket.broadcast.on('stop_typing', data => {
                expect(data).to.be.an('object');
                expect(data).to.contain.all.keys(['id','name']);
                expect(data.id).to.be.eq(0);
                expect(data.name).to.be.eq('test');
                done();
            });
            chatCore.stopTyping(socket);
        });

    });

});
