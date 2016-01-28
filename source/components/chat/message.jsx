import React from 'react';
import Avatar from './avatar';
import moment from 'moment';
import './message.scss';

export default React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        return (nextProps.data !== this.props.data) || (nextState !== this.state);
    },

    render: function() {
        let data = this.props.data;
        let avatar = data.isSameAuthor ? (
            <div className='message-same-author-placeholder'></div>
        ) : (
            <Avatar
                url={data.author.avatar}
                provider={data.author.provider}
            />
        );
        let at = '';
        if (data.at) {
            at = moment(data.at).format('HH:mm');
        }
        let info = data.isSameAuthor ? null : (
            <div className='message-info-wrapper'>
                <div className='message-info'>
                    <div className='message-info-author'>{data.author.name}</div>
                    <div className='message-info-at'>{at}</div>
                </div>
            </div>
        );
        let corner = data.isSameAuthor ? null : (
            <div className='message-corner'></div>
        );
        let messageClass = '';
        if (data.isSystem) {
            if (data.isCritical) {
                messageClass = 'message-system-critical';
            } else if (data.isWarning) {
                messageClass = 'message-system-warning';
            } else {
                messageClass = 'message-system';
            }
        } else if (data.isMy) {
            messageClass = 'message-my';
        }
        let text = <div className='message-text'>{data.text}</div>;
        if (data.html) {
            text = (
                <div className='message-text'>
                    <div
                        dangerouslySetInnerHTML={{__html: data.html}}
                    ></div>
                </div>
            );
        }
        return (
            <li className={'message ' + messageClass}>
                {info}
                {avatar}
                {corner}
                {text}
            </li>
        );
    }
});
