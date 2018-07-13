const fs = require("fs");
const path = require("path");
const ConcatSource = require("webpack-sources").ConcatSource;
const PLUGIN_NAME = "WebComponentsPolyfillWebpackPlugin";
const [HEADER, FOOTER] = getWrapperTemplate().split("____SPLIT____");

/**
 * Add ESM `export` statements to the bottom of a webpack chunk
 * with the exposed exports.
 */
module.exports = class WebComponentsPolyfillWebpackPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, compilationTap);
    }
};


function compilationTap(compilation) {
    compilation.hooks.optimizeChunkAssets.tapAsync(PLUGIN_NAME, (chunks, done) => {
        chunks.forEach(chunk => {
            chunk.files.forEach(fileName => {
                compilation.assets[fileName] = new ConcatSource(
                    HEADER,
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
