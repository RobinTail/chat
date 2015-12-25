import React from 'react';
import Loading from '../loading';
import Message from './message';
import './messagesList.scss';

export default React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.messages !== this.props.messages;
    },
    render: function() {
        if (this.props.isLoaded) {
            if (this.props.messages.length) {
                return (
                    <ul className='messages-list'>
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
        return this.props.messages.map(function(message, id) {
            return <Message key={id} {...message} />;
        });
    }
});
