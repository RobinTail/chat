import {expect} from 'chai';
import db from '../../db';
import config from '../../config';
import webpackConfig from '../../webpackConfig.js';

describe('Settings', function() {
    describe('Database settings', function() {

        it('should be a string', function() {
            expect(db).to.be.a('string');
        });

        it('should be not empty', function() {
            expect(db).have.length.above(0);
        });

    });

    describe('oAuth settings', function() {

        it('should be an object', function() {
            expect(config).to.be.an('object');
        });

        it('should not be empty', function() {
            expect(Object.keys(config)).to.have.length.above(0);
        });

    });

    describe('Webpack settings', function() {

        it('should be an object', function() {
            expect(webpackConfig).to.be.an('object');
        });

        it('should have an entry', function() {
            expect(webpackConfig).to.contain.key('entry');
        });

        it('should have an output object', function() {
            expect(webpackConfig).to.contain.key('output').to.be.an('object');
        });

        it('should have an output with path and filename', function() {
            expect(webpackConfig.output).to.contain
                .all.keys(['path', 'filename']);
        });

    });
});
