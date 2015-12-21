import React from 'react';
import Avatar from './avatar';
import moment from 'moment';
import './message.scss';

export default React.createClass({
    render: function() {
        let avatar = (
            <Avatar
                url={this.props.avatar}
                provider={this.props.provider}
            />
        );
        let at = '';
        if (this.props.at) {
            at = moment(this.props.at).format('HH:mm');
        }
        let info = (
            <div className='message-info-wrapper'>
                <div className='message-info'>
                    <div className='message-info-author'>{this.props.name}</div>
                    <div className='message-info-at'>{at}</div>
                </div>
            </div>
        );
        let messageClass = '';
        if (this.props.isSystem) {
            if (this.props.isCritical) {
                messageClass = 'message-system-critical';
            } else {
                messageClass = 'message-system';
            }
        } else if (this.props.isMy) {
            messageClass = 'message-my';
        }
        return (
            <li className={'message ' + messageClass}>
                {info}
                {avatar}
                <div className='message-corner'></div>
                <div className='message-text'>{this.props.text}</div>
            </li>
        );
    }
});
