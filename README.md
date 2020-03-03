# Boost Pow Javascript Library
> [matterpool.io](https://www.matterpool.io)

See examples at: https://github.com/MatterPool/boostpow-js/blob/master/test/boost-magic-string.test.js

# DOCUMENTATION NEEDS IMPROVEMENT

[VIEW COMPLETE DEVELOPER DOCUMENTATION](https://developers.matterpool.io)

---

## Quick Start

_Small < 24KB library size_
**Installation**
```sh
npm install boostpow-js --save
```

**Include**

```javascript

var boost = require('boostpow-js').instance(options);

```

[VIEW COMPLETE DEVELOPER DOCUMENTATION](https://developers.mattercloud.net)

## Detailed Installation and Usage

**Installation**
```sh
npm install mattercloudjs --save
```

**Include**
```javascript
// Node
var boostpow = require('boostpow-js').instance(options);

```

```html
<!-- Browser -->
<script src="dist/boostpow.js"></script>
<script language="javascript">
    // mattercloud.setApiKey('my key');
    var result = await boostpow.getUtxos('12XXBHkRNrBEb7GCvAP4G8oUs5SoDREkVX');
    console.log('result', result);
</script>
```
See browser usage examples: https://github.com/matterpool/boostpow/blob/master/dist/basic.html

### Promises vs. Callback

Both `await` and callback styles are supported for all methods.

Example:

```javascript

// Await style with promises
var result = await boostpow.requestBoost('...');

// Callback style
boostpow.requestBoost('...', function(result) {
    // ...
});

```

## Detailed Documentation

[VIEW COMPLETE DEVELOPER DOCUMENTATION](https://developers.mattercloud.net)


## Build and Test

```
npm install
npm run build
npm run test
```

-----------


 ## Any questions or ideas?

 We would love to hear from you!

 https://www.mattercloud.net

 https://twitter.com/MatterCloud


