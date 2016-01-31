import {expect} from 'chai';
import {dbConnectionUrl, oAuth} from '../../config';
import webpackConfig from '../../webpack.config';

describe('App Settings Tests', () => {

    describe('Database settings', () => {

        it('should be a string', () => {
            expect(dbConnectionUrl).to.be.a('string');
        });

        it('should be not empty', () => {
            expect(dbConnectionUrl).have.length.above(0);
        });

    });

    describe('oAuth settings', () => {

        it('should be an object', () => {
            expect(oAuth).to.be.an('object');
        });

        it('should not be empty', () => {
            expect(Object.keys(oAuth)).to.have.length.above(0);
        });

    });

    describe('Webpack settings', () => {

        it('should be an object', () => {
            expect(webpackConfig).to.be.an('object');
        });

        it('should have an entry', () => {
            expect(webpackConfig).to.contain.key('entry');
        });

        it('should have an output object', () => {
            expect(webpackConfig).to.contain.key('output').to.be.an('object');
        });

        it('should have an output with path and filename', () => {
            expect(webpackConfig.output).to.contain
                .all.keys(['path', 'filename']);
        });

    });
});
