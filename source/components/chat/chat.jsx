import React from 'react';
import Reflux from 'reflux';
import ChatStore from '../../stores/chat';
import Actions from '../../actions';
import Loading from '../loading';
import Message from './message';
import moment from 'moment';
import smoothscroll from 'smoothscroll';
import appData from '../../appData';
import './chat.scss';
import 'ion-sound';

const TYPING_TIMEOUT = 800;

ion.sound({
    sounds: [
        {name: 'notice'}
    ],
    path: 'static/sounds/',
    preload: true,
    multiplay: true,
    volume: 0.4
});

export default React.createClass({
    mixins: [
        Reflux.listenTo(ChatStore, 'onChange')
    ],
    getInitialState: function() {
        return {
            myMessage: '',
            messages: [],
            typing: [],
            isLoaded: false,
            isTyping: false,
            lastTyping: (new Date()).getTime()
        };
    },
    componentWillMount: function() {
        this.request();
    },
    request: function() {
        Actions.getLatestChatMessages();
        var checkLoaded = new Promise(function(resolve, reject) {
            window.setTimeout(function() {
                if (this.state.isLoaded) {
                    resolve();
                } else {
                    reject();
                }
            }.bind(this), 3000);
        }.bind(this));
        checkLoaded.catch(function() {
            console.log('response timeout');
            this.request();
        }.bind(this));
    },
    render: function() {
        return (
            <div className='chat-holder'>
                {this.renderMessagesContainer()}
                {this.renderSendMessageContainer()}
            </div>
        );
    },
    renderMessagesContainer: function() {
        if (this.state.isLoaded) {
            if (this.state.messages.length) {
                return (
                    <ul className='messages-holder'>
                        {this.renderMessages()}
                    </ul>
                );
            } else {
                return (
                    <h4><em>
                        No messages yet. Write your first one :)
                    </em></h4>
                );
            }
        } else {
            return <Loading />;
        }

    },
    renderMessages: function() {
        return this.state.messages.map(function(message, id) {
            return <Message key={id} {...message} />;
        });
    },
    renderTypingContainer: function() {
        // todo: add smooth transition on appear
        if (this.state.typing.length) {
            var verb = this.state.typing.length > 1 ?
                <span>are</span> : <span>is</span>;
            var msg = <span> {verb} typing...</span>;
            var names = this.state.typing.map(function(user, i) {
                return [
                    <strong key={'name_' + i}>{user.name}</strong>,
                    <em key={'sep_' + i}> &amp; </em>
                ];
            });
            names[names.length - 1].pop();
            return (
                <div className='typing'>
                    {names}
                    {msg}
                </div>
            );
        } else {
            return null;
        }
    },
    renderSendMessageContainer: function() {
        return (
            <div className='send-message-wrapper'>
                {this.renderTypingContainer()}
                <div className='send-message'>
                    <input
                        className='send-message-input'
                        type='text'
                        placeholder='Start typing here'
                        autofocus='autofocus'
                        value={this.state.myMessage}
                        onKeyDown={this.messageKeyPressed}
                        onChange={this.messageChanged}
                        autoComplete='off'
                    />
                    <input
                        className='send-message-button'
                        type='button'
                        onClick={this.sendMessage}
                    />
                </div>
            </div>
        );
    },
    messageKeyPressed: function(e) {
        if (e.keyCode === 13 || e.which === 13) {
            this.sendMessage();
        }
    },
    messageChanged: function(e) {
        if (!this.state.isTyping) {
            Actions.iStartTypingChatMessage();
        }
        this.setState({
            myMessage: e.target.value,
            isTyping: true,
            lastTyping: (new Date()).getTime()
        });
        setTimeout(function() {
            var now = (new Date()).getTime();
            var typingDiff = now - this.state.lastTyping;
            if (typingDiff >= TYPING_TIMEOUT && this.state.isTyping) {
                this.setState({
                    isTyping: false
                });
                Actions.iStopTypingChatMessage();
            }
        }.bind(this), TYPING_TIMEOUT);
    },
    sendMessage: function() {
        if (this.state.myMessage.trim().length > 0) {
            Actions.submitChatMessage(this.state.myMessage);
            this.setState({
                myMessage: ''
            });
        }
    },
    onChange: function(section) {
        if (section === 'typing') {
            this.setState({
                typing: ChatStore.typing
            });
        } else if (section === 'messages') {
            if (appData.get('sounds') && this.state.isLoaded) {
                ion.sound.play('notice');
            }
            this.setState({
                messages: this.processMessages(ChatStore.messages),
                isLoaded: ChatStore.isLatestReceived
            });
            smoothscroll(document.body.scrollHeight);
        }
    },
    processMessages: function(messages) {
        // add first date message when loaded
        if (!this.state.isLoaded) {
            let d = moment();
            if (messages.length) {
                let msg = messages[0];
                if (msg.at) {
                    d = moment(msg.at);
                }
            }
            messages.unshift({
                name: 'System',
                isSystem: true,
                text: d.format('MMMM Do') + '. What a lovely day!'
            });
        }
        // add isMy shorthand property
        messages.forEach(function(message) {
            message.isMy = message.userID === appData.get('userID');
        });
        // todo: add date message on new day start
        // combine messages from same author
        let lastUserID = '';
        messages.forEach(function(message) {
            if (lastUserID === message.userID && !message.isSystem) {
                message.isSameAuthor = true;
            }
            lastUserID = message.userID;
        });
        return messages;
    }
});
