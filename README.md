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

## Options

The following options are supported

```javascript
new WebComponentsPolyfill(
    esPolyfill,
    wcPolfyill,
    stringify
)
```

-   `esPolyfill` : The custom URL to be used for loading the ES Polyfill
-   `wcPolyfill` : The custom URL to be used for loading the WebComponents polyfill
-   `stringify`  : If set to `true` (default) then the values provide via `esPolyfill` and `wcPolyfill` will be run through `JSON.stringify()`. 

## Examples

### Use Custom URLs

```javascript
new WebComponentsPolyfill(
    "path/to/intranet/es6/polyfill.js",
    "path/to/intranet/wc/polyfill.js"
)
```

### Use Browser global variables for custom URLs

```javascript
new WebComponentsPolyfill(
    "window.ES_INTRANET_POLYFILL_URL",
    "window.WC_INTRANET_POLYFILL_URL",
    false //!! important
)
```


# License

[MIT](./LICENSE)

