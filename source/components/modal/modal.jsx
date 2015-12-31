import React from 'react';
import modalStore from '../../stores/modal';
import modalActionCreators from '../../actions/modalActionCreators';
import './modal.scss';

function getDataFromStore() {
    return {
        title: modalStore.getTitle(),
        message: modalStore.getMessage(),
        show: modalStore.isShow()
    };
}

export default React.createClass({
    getInitialState: function() {
        return getDataFromStore();
    },

    componentDidMount: function() {
        modalStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        modalStore.removeChangeListener(this._onChange);
    },

    render: function() {
        if (this.state.show) {
            return (
                <div>
                    <div className='modal-wrapper' onClick={this._handleClose}>
                        <div className='modal' onClick={this._handleOutsideClick}>
                            <div className='modal-header'>
                                <h4>{this.state.title}</h4>
                                <span className='modal-closer' onClick={this._handleClose}>&times;</span>
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

    _handleClose: function() {
        modalActionCreators.modalHide();
    },

    _handleOutsideClick: function(e) {
        e.stopPropagation();
    },

    _onChange: function() {
        this.setState(getDataFromStore());
    }
});
