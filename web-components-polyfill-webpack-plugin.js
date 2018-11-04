const fs = require("fs");
const path = require("path");
const ConcatSource = require("webpack-sources").ConcatSource;
const PLUGIN_NAME = "WebComponentsPolyfillWebpackPlugin";
const [HEADER, FOOTER] = getWrapperTemplate();

/**
 * Add ESM `export` statements to the bottom of a webpack chunk
 * with the exposed exports.
 *
 */
module.exports = class WebComponentsPolyfillWebpackPlugin {
    /**
     * @param {String} [esPolyfill]
     * @param {String} [wcPolyfill]
     * @param {Boolean} [stringify=true]
     */
    constructor(esPolyfill, wcPolyfill, stringify = true) {
        const isOptionsAnObject = "object" === typeof esPolyfill;

        if (esPolyfill && !isOptionsAnObject) {
            console.warn("[WARN] web-components-polyfill-webpack-plugin: input options should be set using an object");
        }

        this._options = Object.assign(
            {
                esPolyfill: "",
                generatorPolyfill: "",
                wcPolyfill: "",
                stringify: true
            },
            isOptionsAnObject ? esPolyfill : { esPolyfill, wcPolyfill, stringify }
        );
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, compilationTap.bind(this));
    }
};


function compilationTap(compilation) {
    compilation.hooks.optimizeChunkAssets.tapAsync(PLUGIN_NAME, (chunks, done) => {
        chunks.forEach(chunk => {
            chunk.files.forEach(fileName => {
                compilation.assets[fileName] = new ConcatSource(
                    setCustomPolyfills(this),
                    compilation.assets[fileName],
                    FOOTER
                );
            });
        });

        done();
    });
}

function getWrapperTemplate() {
    return fs.readFileSync(path.join(__dirname, "polyfill-wrapper.js"), "utf8").split("// YOUR CODE HERE");
}

function setCustomPolyfills(pluginInstance) {
    let response = HEADER;
    const { stringify, esPolyfill, wcPolyfill, generatorPolyfill } = pluginInstance._options;

    if (esPolyfill) {
        response = response.replace(
            /\/\* ES6 POLYFILL \*\/.*[\r\n]/,
            `${ stringify ? JSON.stringify(esPolyfill) : esPolyfill },`);
    }

    if (generatorPolyfill) {
        response = response.replace(
            /\/\* GENERATOR POLYFILL \*\/.*[\r\n]/,
            `${ stringify ? JSON.stringify(generatorPolyfill) : generatorPolyfill },`);
    }

    if (wcPolyfill) {
        response = response.replace(
            /\/\* WC POLYFILL \*\/.*[\r\n]/,
            `${ stringify ? JSON.stringify(wcPolyfill) : wcPolyfill },`
        );
    }

    return response;
}
