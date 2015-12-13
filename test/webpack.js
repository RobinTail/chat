var expect = require('chai').expect;
var webpackConfig = require('../webpack.config.js');

describe('Webpack', function() {
    describe('Config', function() {

        it('should be an object', function() {
            expect(webpackConfig).to.be.a('object');
        });

        it('should have an entry', function() {
            expect(webpackConfig).to.contain.key('entry');
        });

        it('should have an output object', function() {
            expect(webpackConfig).to.contain.key('output').to.be.a('object');
        });

        it('should have an output with path and filename', function() {
            expect(webpackConfig.output).to.contain.all.keys(['path', 'filename']);
        });

    });
});
