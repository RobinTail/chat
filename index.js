require('babel-register')(Object.assign({
    ignore: /node_modules/
}, require('./package.json').babel));
module.exports = require('./server').default;
