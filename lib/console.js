var isTest = process.env.NODE_ENV === 'test';

export default {
    log: function() {
        if (!isTest) {
            /* eslint-disable no-console */
            console.log.apply(this, arguments);
            /* eslint-enable no-console */
        }
    }
};
