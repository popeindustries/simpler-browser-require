require('../require.js');
var should = require('should')
	, req = global.require;

describe('require', function () {
	beforeEach(function () {
		req.modules = {};
	});

	describe('require.register(path, fn)', function () {
		it('should store a module by it\'s id', function () {
			req.register('mymodule', function (require, module, exports) {
				module.exports = 'mymodule';
			});
			should.exist(req.modules.mymodule);
		});
		it('should store a raw index for a lazy module', function () {
			req.register('mymodule', "module.exports = 'foo';");
			should.exist(req.modules['raw:mymodule']);
			req.modules.mymodule.should.equal('raw:mymodule');
		});
	});

	describe('require(path)', function () {
		it('should return an empty object when an exports object is not defined', function () {
			req.register('mymodule', function (require, module, exports) { });
			should.exist(req('mymodule'));
			req('mymodule').should.eql({});
		});
		it('should return an exports object when defined', function () {
			req.register('mymodule', function (require, module, exports) {
				exports.hi = 'mymodule';
			});
			should.exist(req('mymodule'));
			req('mymodule').hi.should.eql('mymodule');
		});
		it('should allow a module to replace it\'s exports object', function () {
			req.register('mymodule', function (require, module, exports) {
				module.exports = 'mymodule';
			});
			req('mymodule').should.eql('mymodule');
		});
		it('should support neseted require()s', function () {
			req.register('foo', function (require, module, exports) {
				module.exports = 'foo';
			});
			req.register('bar', function (require, module, exports) {
				exports.foo = require('foo');
			});
			req('bar').foo.should.eql('foo');
		});
		it('should support package indexes', function () {
			req.register('dir/foo', function (require, module, exports) {
				module.exports = 'foo';
			});
			req.register('dir/bar', function (require, module, exports) {
				module.exports = 'bar';
			});
			req.register('dir/index', function (require, module, exports) {
				exports.foo = require('dir/foo');
				exports.bar = require('dir/bar');
			});
			req('dir').foo.should.eql('foo');
			req('dir').bar.should.eql('bar');
		});
		it('should resolve versioned modules when called without version number', function () {
			req.register('foo#1.0.0', function (require, module, exports) {
				module.exports = 'foo';
			});
			req('foo').should.eql('foo');
			req('foo#1.0.0').should.eql('foo');
		});
		it('should support lazy evaluation of modules as strings', function () {
			req.register('foo', "module.exports = 'foo';");
			req('foo').should.eql('foo');
		});
		it('should throw an error when called with an unrecognized path', function () {
			try {
				req('foo');
				throw new Error('oops');
			} catch (err) {
				should.exist(err);
			}
		});
	});

	describe('require.raw(path)', function () {
		it('should return an empty string if no lazy module registered', function () {
			req.register('foo', function (require, module, exports) {
				module.exports = 'foo';
			});
			req.raw('foo').should.eql('');
		});
		it('should return string content for a registered lazy module', function () {
			req.register('foo', "module.exports = 'foo';");
			req.raw('foo').should.eql("module.exports = 'foo';");
		});
	});
});