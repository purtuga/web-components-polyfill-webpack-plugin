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

# License

[MIT](./LICENSE)

