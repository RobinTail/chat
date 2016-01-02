import {expect} from 'chai';
import * as chatCore from '../../lib/chatCore';
import EventEmitter from 'events';

describe('Chat Core Tests', () => {
    let socket;

    before('Init Mock Object', () => {
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

    describe('sendError()', () => {

        it('should emit an event \'new\' with error message', (done) => {
            socket.on('new', (data) => {
                expect(data).to.be.an('object');
                expect(data).to.contain.all.keys(['error','message']);
                expect(data.error).to.eq(true);
                expect(data.message).to.eq('test');
                done();
            });
            chatCore.sendError(socket, 'test');
        });

    });

    describe('enterChat()', () => {

        it('should broadcast an event \'new\' with system message', (done) => {
            socket.broadcast.on('new', (data) => {
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

});
