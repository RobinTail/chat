import Reflux from 'reflux';
import Actions from '../actions';

export default Reflux.createStore({
    listenables: [Actions],
    modal: {
        title: '',
        message: ''
    },
    updateModal: function(title, message) {
        this.modal = {
            title: title,
            message: message
        };
        this.triggerChange();
    },
    triggerChange: function() {
        this.trigger('change', this.modal);
    }
});
