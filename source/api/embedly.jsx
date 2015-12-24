import 'whatwg-fetch';
import {embedlyKey} from '../../config';
let rootUrl = 'http://api.embed.ly/1/oembed?key=' +
    embedlyKey + '&format=json&maxwidth=400&urls=';

export default {
    get: function(urls) {
        return fetch(rootUrl + urls.map(encodeURIComponent).join(','), {})
            .then(function(res) {
                if (res.status >= 200 && res.status < 300) {
                    return res;
                } else {
                    var error = new Error(res.statusText);
                    error.res = res;
                    throw error;
                }
            })
            .then(function(res) {
                return res.json();
            })
            .catch(function(e) {
                return {
                    type: 'error',
                    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                    // use api response style
                    error_message: e.message
                    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                };
            });
    }
};
