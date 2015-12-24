import React from 'react';
import Avatar from './avatar';
import moment from 'moment';
import './message.scss';

export default React.createClass({
    render: function() {
        let avatar = this.props.isSameAuthor ? (
            <div className='message-same-author-placeholder'></div>
        ) : (
            <Avatar
                url={this.props.avatar}
                provider={this.props.provider}
            />
        );
        let at = '';
        if (this.props.at) {
            at = moment(this.props.at).format('HH:mm');
        }
        let info = this.props.isSameAuthor ? null : (
            <div className='message-info-wrapper'>
                <div className='message-info'>
                    <div className='message-info-author'>{this.props.name}</div>
                    <div className='message-info-at'>{at}</div>
                </div>
            </div>
        );
        let corner = this.props.isSameAuthor ? null : (
            <div className='message-corner'></div>
        );
        let messageClass = '';
        if (this.props.isSystem) {
            if (this.props.isCritical) {
                messageClass = 'message-system-critical';
            } else if (this.props.isWarning) {
                messageClass = 'message-system-warning';
            } else {
                messageClass = 'message-system';
            }
        } else if (this.props.isMy) {
            messageClass = 'message-my';
        }
        let text = <div className='message-text'>{this.props.text}</div>;
        if (this.props.isParsed) {
            text = (
                <div
                    className='message-text'
                    dangerouslySetInnerHTML={{__html: this.props.html}}
                ></div>
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
