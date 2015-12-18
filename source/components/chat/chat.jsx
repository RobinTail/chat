import React from 'react';
import Reflux from 'reflux';
import ChatStore from '../../stores/chat.jsx';
import Actions from '../../actions.jsx';
import TextField from 'material-ui/lib/text-field';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import Loading from '../loading.jsx';
import Message from './message.jsx';
import smoothscroll from 'smoothscroll';
import appData from '../../appData.jsx';
import './chat.scss';
import 'ion-sound';

const TYPING_TIMEOUT = 800;

ion.sound({
    sounds: [
        {name: 'button_click'}
    ],
    path: 'static/sounds/',
    preload: true,
    multiplay: true,
    volume: 0.5
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
                {this.renderTypingContainer()}
                <div className='send-message-holder'>
                    <div className='send-message-subholder'>
                        <div>
                            <div>
                                <TextField className='my-message'
                                    hintText='Your message'
                                    // jscs:disable maximumLineLength
                                    floatingLabelText='Start typing your message here'
                                    // jscs:enable maximumLineLength
                                    value={this.state.myMessage}
                                    onEnterKeyDown={this.messageEnterKeyPressed}
                                    onChange={this.messageChanged}
                                    fullWidth={true}
                                    autoComplete='off'
                                />
                            </div>
                            <div>
                                <FloatingActionButton
                                    primary={true}
                                    mini={true}
                                >
                                    <FontIcon
                                        className='material-icons'
                                        onClick={this.sendMessage}
                                    >
                                        message
                                    </FontIcon>
                                </FloatingActionButton>
                            </div>
                        </div>
                    </div>
                </div>
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
        if (this.state.typing.length) {
            var verb = this.state.typing.length > 1 ?
                <span>are</span> : <span>is</span>;
            var msg = <span> {verb} typing...</span>;
            var names = this.state.typing.map(function(user) {
                return user.name;
            }).join(', ');
            return (
                <div className='typing-holder'>
                {names}
                {msg}
                </div>
            );
        } else {
            return null;
        }
    },
    messageEnterKeyPressed: function() {
        this.sendMessage();
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
        Actions.submitChatMessage(this.state.myMessage);
        this.setState({
            myMessage: ''
        });
    },
    onChange: function(section) {
        if (section === 'messages' &&
            appData.get('sounds') &&
            this.state.isLoaded) {
            ion.sound.play('button_click');
        }
        this.setState({
            messages: ChatStore.messages,
            typing: ChatStore.typing,
            isLoaded: ChatStore.isLatestReceived
        });
        smoothscroll(document.body.scrollHeight);
    }
});
