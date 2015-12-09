var React = require('react');
var Reflux = require('reflux');
var Dialog = require('material-ui/lib/dialog');
var Store = require('../stores/modal.jsx');

module.exports = React.createClass({
    mixins: [
        Reflux.listenTo(Store, 'onChange')
    ],
    getInitialState: function() {
        return {
            title: '',
            message: '',
            show: false
        };
    },
    render: function() {
        if (this.state.show) {
            return (
                <Dialog
                    title={this.state.title}
                    modal={false}
                    actions={
                        [
                            {text: 'OK'}
                        ]
                    }
                    openImmediately={true}>
                    {this.state.message}
                </Dialog>
            );
        } else {
            return null;
        }
    },
    onChange: function(e, data) {
        this.setState({
            title: data.title,
            message: data.message,
            show: true
        });
    }
});
