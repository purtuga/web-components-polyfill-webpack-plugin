# web-components-polyfill-webpack-plugin
A webpack plugin that will wrap your bundles with code that ensure polyfills are loaded first if the browser does not support web components. Ensures that your web component is only executed when the environment is ready.

Currently only for webpack 4 and above.

## Install

```bash
npm i -D @purtuga/web-comonents-polyfill-webpack-plugin
```

## Usage

In your `webpack.config.js` file, add an instance of this plugin to the `plugins` array:

```javascript
const WebComponentsPolyfill = require("web-components-polyfill-webpack-plugin");

module.exports = {
    //...
    plugins: [
        new WebComponentsPolyfill()
    ]
}
``` 

>   NOTE: Depending on your setup, the order of the plugin within the `plugins` array may make a difference. In most cases, having it at the end of the array will generate the expected bundle. 


## Options

The following options are supported

```javascript
new WebComponentsPolyfill({
    esPolyfill: "",
    wcPolfyill: "",
    generatorPolyfill: "",
    stringify: true
})
```

-   `esPolyfill` : The custom URL to be used for loading the ES Polyfill
-   `wcPolyfill` : The custom URL to be used for loading the WebComponents polyfill
-   `generatorPolyfill` : The custom URL to be used for loading the Generators polyfill.
-   `stringify`  : If set to `true` (default) then the values provide via `esPolyfill` and `wcPolyfill` will be run through `JSON.stringify()`. 

## Global Overrides

The polyfill loader will use the following from the global scope (`window`) if defined, overriding any value provided to the Plugin:

-   `window.WC_POLYFILL` : The URL to the Web Component's Polyfill
-   `window.ES_POLYFILL` : The URL for the ES Polyfill
-   `window.SKIP_ES_POLYFILL` : If set to `true`, then ES Polyfill will not be done

NOTE: Once the environment starts to get polyfilled, `window.WC_ENV` will be set with an array holding the callbacks to be executed once environment is ready. Additional ones can be added to this Array safely (aka: assured to be executed) by using the `then()` method. Example:

```javascript
window.WC_ENV.then(function(){
    console.log("Ok.. Environment is ready");
})
```

>   Note that this is only true, if the environment needed to be polyfilled!


## Examples

### Use Custom URLs

```javascript
new WebComponentsPolyfill({
    esPolyfill: "path/to/intranet/es6/polyfill.js",
    wcPolyfill: "path/to/intranet/wc/polyfill.js",
    generatorPolyfill: "path/to/intranet/generator/polyfill.js"
})
```

### Use Browser global variables for custom URLs

```javascript
new WebComponentsPolyfill({
    esPolyfill: "window.ES_INTRANET_POLYFILL_URL",
    wcPolyfill: "window.WC_INTRANET_POLYFILL_URL",
    generatorPolyfill: "window.GENERATOR_POLYFILL_URL",
    false //!! important
})
```


# License

[MIT](./LICENSE)

