import React from 'react';
import chatStore from '../../stores/chat';
import MessagesList from './messagesList';
import MessageComposer from './messageComposer';
import smoothscroll from 'smoothscroll';
import appData from '../../appData';
import './chat.scss';
import 'ion-sound';

window.ion.sound({
    sounds: [
        {name: 'notice'}
    ],
    path: '/static/sounds/',
    preload: true,
    multiplay: true,
    volume: 0.4
});

function getDataFromStore() {
    return {
        messages: chatStore.getMessages(),
        typing: chatStore.getTyping()
    };
}

export default React.createClass({
    getInitialState: function() {
        return getDataFromStore();
    },

    componentDidMount: function() {
        chatStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        chatStore.removeChangeListener(this._onChange);
    },

    render: function() {
        return (
            <div className='chat-holder'>
                <MessagesList
                    messages={this.state.messages}
                />
                <MessageComposer typing={this.state.typing} />
            </div>
        );
    },

    _onChange: function(section) {
        this.setState(getDataFromStore());
        if (section === 'messages') {
            if (appData.get('sounds')) {
                window.ion.sound.play('notice');
            }
            smoothscroll(document.body.scrollHeight);
        }
    }
});
