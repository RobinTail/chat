var isTest = process.env.NODE_ENV === 'test';

export default {
    log: function() {
        if (!isTest) {
            console.log.apply(this, arguments);
        }
    }
};
