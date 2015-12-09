var Reflux = require('reflux');
var Actions = require('../actions.jsx');

module.exports = Reflux.createStore({
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
