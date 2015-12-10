var React = require('react');
var CircularProgress = require('material-ui/lib/circular-progress');

module.exports = React.createClass({
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
