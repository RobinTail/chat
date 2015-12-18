import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

export default React.createClass({
    render: function() {
        return (
            <RaisedButton
                linkButton={true}
                primary={true}
                href='/auth/google'
                label='Google'
            />
        );
    }
});
