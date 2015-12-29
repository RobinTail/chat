import React from 'react';
import Reflux from 'reflux';
import ChatStore from '../../stores/chat';
import Actions from '../../actions';
import MessagesList from './messagesList';
import smoothscroll from 'smoothscroll';
import appData from '../../appData';
import './chat.scss';
import 'ion-sound';

const TYPING_TIMEOUT = 800;

ion.sound({
    sounds: [
        {name: 'notice'}
    ],
    path: '/static/sounds/',
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
        Actions.getLatestChatMessages();
    },
    render: function() {
        return (
            <div className='chat-holder'>
                <MessagesList
                    messages={this.state.messages}
                    isLoaded={this.state.isLoaded}
                />
                {this.renderSendMessageContainer()}
            </div>
        );
    },
    renderTypingContainer: function() {
        // todo: add smooth transition on appear
        if (this.state.typing.length) {
            let verb = this.state.typing.length > 1 ?
                <span>are</span> : <span>is</span>;
            let msg = <span> {verb} typing...</span>;
            let names = null;
            if (this.state.typing.length > 3) {
                names = (
                    <strong>{this.state.typing.length + ' persons'}</strong>
                );
            } else {
                names = this.state.typing.map(function(user, i) {
                    return [
                        <strong key={'name_' + i}>{user.name}</strong>,
                        <em key={'sep_' + i}> &amp; </em>
                    ];
                });
                names[names.length - 1].pop();
            }
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
            let now = (new Date()).getTime();
            let typingDiff = now - this.state.lastTyping;
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
                // make a copy of stored messages (prevent link)
                // see: messagesList.shouldComponentUpdate()
                messages: ChatStore.messages.slice(),
                isLoaded: ChatStore.isLatestReceived
            });
            smoothscroll(document.body.scrollHeight);
        }
    }
});
