export default new class appData {
    constructor() {
        this._store = {};
        let element = document.getElementById('applicationData');
        if (element) {
            this._store = JSON.parse(element.textContent);
        }
    }

    get(name) {
        return this._store[name];
    }

    set(name, value) {
        this._store[name] = value;
    }
};
