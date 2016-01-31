export default new class myConsole {
    constructor() {
        this._isTest = process.env.NODE_ENV === 'test';
    }

    log() {
        if (!this._isTest) {
            /* eslint-disable no-console */
            console.log.apply(this, arguments);
            /* eslint-enable no-console */
        }
    }
};
