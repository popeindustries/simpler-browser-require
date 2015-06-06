(function(root) {
	/**
	 * Load or retrieve cached version of requested module with id 'path' or 'path/index'
	 * @param {String} path
	 * @returns {Object}
	 */
	function require (path) {
		// Find in cache
		var m = require.modules[path] || require.modules[path + '/index'];

		if (!m) {
			// Handle versioned modules when called without version number
			var p, idx;
			for (var p in require.modules) {
				if ((idx = p.indexOf('#')) != -1) {
					if (path == p.slice(0, idx)) {
						m = require.modules[p];
						break;
					}
				}
			}
			if (!m) throw new Error("Couldn't find module for: " + path);
		}

		// Instantiate the module if it's export object is not yet defined
		if (!m.exports) {
			// Convert 'lazy' evaluated string to Function
			if ('string' == typeof m) {
				// 'm' is key to raw source
				m = require.modules[path] = new Function('require', 'module', 'exports', require.modules[m]);
			}
			m.exports = {};
			m.filename = path;
			m.call(null, require, m, m.exports);
		}

		// Return the exports object
		return m.exports;
	}

	// Cache of module objects
	require.modules = {};

	/**
	 * Retrieve raw 'lazy' module source
	 * @param {String} path
	 * @returns {String}
	 */
	require.raw = function requireRaw (path) {
		return require.modules['raw:' + path] || '';
	};

	/**
	 * Register a module with id of 'path' and callback of 'fn'
	 * Alternatively accepts 'fn' string for lazy evaluation
	 * @param {String} path
	 * @param {Function|String} fn [signature should be of type (require, module, exports)]
	 */
	require.register = function requireRegister (path, fn) {
		if ('string' == typeof fn) {
			// Store raw source
			var key = 'raw:' + path;
			require.modules[key] = fn;
			require.modules[path] = key;
		} else {
			require.modules[path] = fn;
		}
	};

	// Expose
	root.require = require;

})((typeof window !== 'undefined') ? window : global);