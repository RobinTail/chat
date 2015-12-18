import React from 'react';
import CircularProgress from 'material-ui/lib/circular-progress';

export default React.createClass({
    render: function() {
        return (
            <div style={{textAlign: 'center'}}>
                <CircularProgress
                    mode='indeterminate'
                    size={2}
                    style={{margin: 150}}
                />
            </div>
        );
    }
});
