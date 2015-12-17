var isTest = process.env.NODE_ENV === 'test';

module.exports = {
    log: function() {
        if (!isTest) {
            console.log.apply(this, arguments);
        }
    }
};
