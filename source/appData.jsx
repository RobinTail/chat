var element = document.getElementById('applicationData');
var store = {};
if (element) {
    store = JSON.parse(element.textContent);
}

/**
 * Returns the value of stored application data (injected by NodeJS)
 */

export default {
    get: function(name) {
        return store[name];
    },
    set: function(name, value) {
        store[name] = value;
    }
};
