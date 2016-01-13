[![NPM Version](https://img.shields.io/npm/v/simpler-browser-require.svg?style=flat)](https://npmjs.org/package/simpler-browser-require)
[![Build Status](https://img.shields.io/travis/popeindustries/browser-require.svg?style=flat)](https://travis-ci.org/popeindustries/simpler-browser-require)

# simpler-browser-require

**simpler-browser-require** is an even simpler, node.js-like ```require()``` for the browser. *It is not an asynchronous script loader*, and it only works with **absolute** paths (hence *simpler*).

## Usage

Wrapping each module in a ```require.register``` call:

```js
require.register('my/module/id', function (require, module, exports) {
	// module code here
});
```

...allows the ```require``` function to return the module's public contents:

```js
var lib = require('my/module/id');
```

...exposed by decorating the ```exports``` object:

```js
var myModuleVar = 'my module';

exports.myModuleMethod = function() {
  return myModuleVar;
};
```

...or overwritting the ```exports``` object completely:

```js
function MyModule() {
  this.myVar = 'my instance var';
};

MyModule.prototype.myMethod = function() {
  return this.myVar;
};

module.exports = MyModule;
```

### Lazy modules

Passing a string (instead of a function) to `require.register` enables lazy evaluation of module contents. The module will be parsed and evaluated only when `require`'d:

```js
require.register('my/module/id', "function (require, module, exports) {\n  exports.foo = 'foo';\n}");
```

The raw source is retrievable via `require.raw(path)`:

```js
localStorage.setItem('my/module/id', window.require.raw('my/module/id'));
window.require.register('my/module/id', localStorage.getItem('my/module/id'));
// ...
var myModule = require('my/module/id');
console.log(myModule.foo); //=> 'foo'
```
