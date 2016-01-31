import 'whatwg-fetch';
import {embedlyKey} from '../../config';

export default new class embedlyAPI {
    constructor() {
        this._rootUrl = 'http://api.embed.ly/1/oembed?key=' + embedlyKey + '&format=json&maxwidth=400&urls=';
    }

    get(urls) {
        return fetch(this._rootUrl + urls.slice(0,10).map(encodeURIComponent).join(','), {})
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    return res;
                } else {
                    var error = new Error(res.statusText);
                    error.res = res;
                    throw error;
                }
            })
            .then(res => {
                return res.json();
            })
            .catch(e => {
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
