var expect = require('chai').expect;
var db = require('../db');
var config = require('../config');

describe('Settings', function() {
    describe('db', function() {

        it('should be a string', function() {
            expect(db).to.be.a('string');
        });

        it('should be not empty', function() {
            expect(db).have.length.above(0);
        });

    });

    describe('config', function() {

        it('should be an object', function() {
            expect(config).to.be.a('object');
        });

        it('should not be empty', function() {
            expect(Object.keys(config)).to.have.length.above(0);
        });

    });
});
