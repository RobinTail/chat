import React from 'react';
import './authButton.scss';

export default React.createClass({
    render: function() {
        return (
            <div
                className={'authButton ' + this.props.type + ' ' + (this.props.disabled ? '_disabled' : '')}
                onClick={this.props.disabled ? null : this.handleClick}
            >
            </div>
        );
    },
    handleClick: function() {
        window.location = this.props.url;
    }
});
