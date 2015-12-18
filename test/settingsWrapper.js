require('babel-register')(Object.assign({
    ignore: /node_modules/
}, require('../package.json').babel));
require('./settings/settings.js');
