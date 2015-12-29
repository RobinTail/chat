import React from 'react';
import Reflux from 'reflux';
import Dialog from 'material-ui/lib/dialog';
import Store from '../stores/modal';

export default React.createClass({
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
                    actions={
                        [
                            {text: 'OK'}
                        ]
                    }
                    defaultOpen={true}
                >
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
