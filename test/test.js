'use strict';

var assert = require('assert');
var babelGlobals = require('../index');
var gulp = require('gulp');

module.exports = {
	testBuildGlobals: function(test) {
		gulp.src('test/assets/main.js')
			.pipe(babelGlobals())
			.on('data', function(bundle) {
				assert.ok(bundle);
				assert.strictEqual('bundle.js', bundle.path);

				eval(bundle.contents.toString()); // jshint ignore:line
				assert.ok(this.myGlobals);
				assert.ok(this.myGlobals.main);
				assert.strictEqual('foo bar', this.myGlobals.main);

				assert.ok(bundle.sourceMap);
				assert.strictEqual('bundle.js', bundle.sourceMap.file);
			})
			.on('end', function() {
				test.done();
			});
	},

	testBuildGlobalsBundleFileName: function(test) {
		gulp.src('test/assets/main.js')
			.pipe(babelGlobals({bundleFileName: 'foo.js'}))
			.on('data', function(bundle) {
				assert.ok(bundle);
				assert.strictEqual('foo.js', bundle.path);

				eval(bundle.contents.toString()); // jshint ignore:line
				assert.ok(this.myGlobals);
				assert.ok(this.myGlobals.main);
				assert.strictEqual('foo bar', this.myGlobals.main);

				assert.ok(bundle.sourceMap);
				assert.strictEqual('foo.js', bundle.sourceMap.file);
			})
			.on('end', function() {
				test.done();
			});
	},

	testErrorInvalidJs: function(test) {
		gulp.src('test/assets/invalid.js')
			.pipe(babelGlobals())
			.on('error', function(error) {
				assert.ok(error);
				test.done();
			});
	}
};
