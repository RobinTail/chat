import React from 'react';

export default React.createClass({
    render: function() {
        return (
            <div
                className={this.props.type}
                onClick={this.handleClick}
            >
            </div>
        );
    },
    handleClick: function() {
        window.location = this.props.url;
    }
});
