var element = document.getElementById('applicationData');
var store = {};
if (element) {
    store = JSON.parse(element.textContent);
}

/**
 * Getter and setter for stored application data
 * (injected by NodeJS into view)
 */

export default {
    get: function(name) {
        return store[name];
    },
    set: function(name, value) {
        store[name] = value;
    }
};
