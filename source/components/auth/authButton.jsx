import React from 'react';
import './authButton.scss';

export default React.createClass({
    render: function() {
        return (
            <div
                className={'authButton ' + this.props.type}
                onClick={this.handleClick}
            >
            </div>
        );
    },
    handleClick: function() {
        window.location = this.props.url;
    }
});
