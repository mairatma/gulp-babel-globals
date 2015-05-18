var assert = require('assert');
var babelGlobals = require('../index');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');

module.exports = {
	testBuildGlobals: function(test) {
		buildGlobals([loadStreamFile('main.js')], null, function(bundle) {
			assert.ok(bundle);
			assert.strictEqual('bundle.js', bundle.path);

			eval(bundle.contents.toString());
			assert.ok(this.myGlobals);
			assert.ok(this.myGlobals.main);
			assert.strictEqual('foo bar', this.myGlobals.main);

			assert.ok(bundle.sourceMap);
			assert.strictEqual('bundle.js', bundle.sourceMap.file);
			test.done();
		});
	},

	testBuildGlobalsBundleFileName: function(test) {
		buildGlobals([loadStreamFile('main.js')], {bundleFileName: 'foo.js'}, function(bundle) {
			assert.ok(bundle);
			assert.strictEqual('foo.js', bundle.path);

			eval(bundle.contents.toString());
			assert.ok(this.myGlobals);
			assert.ok(this.myGlobals.main);
			assert.strictEqual('foo bar', this.myGlobals.main);

			assert.ok(bundle.sourceMap);
			assert.strictEqual('foo.js', bundle.sourceMap.file);
			test.done();
		});
	}
};


function loadStreamFile(filePath) {
	var basePath = path.join(__dirname, 'assets');
	filePath = path.resolve(basePath, filePath);
    return new gutil.File({
        cwd: __dirname,
        base: basePath,
        path: filePath,
        contents: fs.readFileSync(filePath)
    });
}

function buildGlobals(sources, options, callback) {
    var stream = babelGlobals(options);
    var bundle;
    stream.on('data', function(file) {
    	bundle = file;
    });
    stream.on('end', function() {
    	callback(bundle);
    });
    sources.forEach(function(source) {
        stream.write(source);
    });
    stream.end();
}
