import React from 'react';
import Reflux from 'reflux';
import Store from '../../stores/modal';
import './modal.scss';

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
                <div>
                    <div className='modal-wrapper' onClick={this.handleClose}>
                        <div className='modal' onClick={this.stopPropagation}>
                            <div className='modal-header'>
                                <h4>{this.state.title}</h4>
                                <span className='modal-closer' onClick={this.handleClose}>&times;</span>
                            </div>
                            <div className='modal-body'>
                                {this.state.message}
                            </div>
                        </div>
                    </div>
                    <div className='modal-shade'></div>
                </div>
            );
        } else {
            return null;
        }
    },
    handleClose: function() {
        this.setState({
            show: false
        });
    },
    stopPropagation: function(e) {
        e.stopPropagation();
    },
    onChange: function(e, data) {
        this.setState({
            title: data.title,
            message: data.message,
            show: true
        });
    }
});
