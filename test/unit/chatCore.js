import {expect} from 'chai';
import * as chatCore from '../../lib/chatCore';
import EventEmitter from 'events';

const USER_ID = '56a9f63452a330ef5aaa166a';
const USER_NAME = 'test';
const USER_PROVIDER = 'test_provider';
const USER_AVATAR = 'test_avatar';

describe('Chat Core Tests', function() {
    let socket;

    beforeEach('Init Mock Object', function() {
        socket = new EventEmitter();
        socket.broadcast = new EventEmitter();
        socket.handshake = {
            session: {
                passport: {
                    user: {
                        _id: USER_ID,
                        name: USER_NAME,
                        provider: USER_PROVIDER,
                        avatar: USER_AVATAR
                    }
                }
            }
        };
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
                expect(data.messages[0]).to.contain.all.keys(['author','isSystem','isWarning','at','text']);
                expect(data.messages[0].author).to.be.an('object');
                expect(data.messages[0].author.name).to.eq('System');
                expect(data.messages[0].isSystem).to.eq(true);
                expect(data.messages[0].isWarning).to.eq(true);
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
                expect(data.messages[0]).to.contain.all.keys(['author','isSystem','isWarning','at','text']);
                expect(data.messages[0].author).to.be.an('object');
                expect(data.messages[0].author.name).to.eq('System');
                expect(data.messages[0].isSystem).to.eq(true);
                expect(data.messages[0].isWarning).to.eq(true);
                done();
            });
            chatCore.leaveChat(socket);
        });

    });

    describe('startTyping()', function() {

        it('should broadcast an event \'start_typing\' with name', function(done) {
            socket.broadcast.on('start_typing', data => {
                expect(data).to.be.an('object');
                expect(data).to.contain.all.keys(['id','name']);
                expect(data.id).to.be.eq(USER_ID);
                expect(data.name).to.be.eq(USER_NAME);
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
                expect(data.id).to.be.eq(USER_ID);
                expect(data.name).to.be.eq(USER_NAME);
                done();
            });
            chatCore.stopTyping(socket);
        });

    });

});
