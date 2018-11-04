(function (
    WINDOW,
    DOCUMENT,
    ES6_POLYFILL,
    GE_POLYFILL,
    WC_POLYFILL,
    init
) {
    /**
     * A Custom Elements (Web Components) polyfill loader.
     * Use it to wrap modules that use CEs and it will take care of
     * only executing the module initialization function when the
     * polyfill is loaded.
     * This loader wrapper also loads the `core-js` library if it
     * finds that he current environment does not support Promises
     * (ex. IE)
     *
     * The loader contains default URLs for polyfills, however, the
     * following global variables can control those:
     *
     * -    `window.WC_POLYFILL`: url to Web Components polyfill
     * -    `window.ES_POLYFILL`: the url to the ES6 core polyfill library
     * -    `window.GE_POLYFILL`: the url to the Generator polyfill library
     * -    `window.SKIP_ES_POLYFILL`: A boolean indicating if polyfiling
     *      the browser to be ES6 compliant should be skipped.
     *
     * In addition, this loader will add the following global
     * variable, which is used to store module initialization
     * functions until the environment is patched:
     *
     * -    `window.WC_ENV"`: an Array with callbacks. To store a new one, use
     *      `window.WC_ENV.then(callbackHere)`
     */
    if (!('customElements' in WINDOW)) {
        var WC_SETUP = "WC_ENV";

        // If in the mist of loading the polyfills, then just add init to when that is done
        if (WINDOW[WC_SETUP]) {
            WINDOW[WC_SETUP].then(init);
            return;
        }

        var getCallbackQueue = function getCallbackQueue() {
            var callbacks = [];
            var execCallback = function (callback) {
                try {
                    callback();
                } catch (error) {
                    console.error(error); // eslint-disable-line
                }
            };
            callbacks.isDone = false;
            callbacks.exec = function () {
                callbacks.splice(0).forEach(execCallback);
            };
            callbacks.then = function(callback){
                if (callbacks.isDone) {
                    callback();
                } else {
                    callbacks.push(callback);
                }
                return callbacks;
            };
            return callbacks;
        };

        var loadScript = function loadScript(url, callback) {
            var script = DOCUMENT.createElement("script");

            script.type = "text/javascript";

            if (script.readyState){ // IE
                script.onreadystatechange = function(){
                    if (script.readyState == "loaded" || script.readyState == "complete"){
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = function(){
                    callback();
                };
            }

            script.src = url;
            DOCUMENT.getElementsByTagName("head")[0].appendChild(script);
        };

        var WC_SETUP_CALLBACKS = WINDOW[WC_SETUP] = getCallbackQueue();
        WC_SETUP_CALLBACKS.then(init);

        //----------------------------------------------------- Load Polyfills -------------
        var WEB_COMPONENTS_POLYFILL = WINDOW.WC_POLYFILL || WC_POLYFILL;
        var pending = 0;
        var execWcSetupCallbacks = function () {
            --pending;
            if (!pending) {
                WC_SETUP_CALLBACKS.isDone = true;
                WC_SETUP_CALLBACKS.exec();
            }
        };
        var supportsGenerators = function() {
            // Code taken from Modernizr:
            // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/es6/generators.js
            try {
                new Function('function* test() {}')();
            } catch (e) {
                return false;
            }
            return true;
        };


        if (!("Reflect" in WINDOW) && !WINDOW.SKIP_ES_POLYFILL) {
            pending++;
            loadScript(
                WINDOW.ES_POLYFILL || ES6_POLYFILL,
                function () {
                    loadScript(
                        WEB_COMPONENTS_POLYFILL,
                        execWcSetupCallbacks
                    );
                }
            );

            if (GE_POLYFILL && !supportsGenerators() && !WINDOW.regeneratorRuntime) {
                pending++;
                loadScript(
                    window.GE_POLYFILL || GE_POLYFILL,
                    execWcSetupCallbacks
                )
            }
        } else {
            pending++;
            loadScript(
                WEB_COMPONENTS_POLYFILL,
                execWcSetupCallbacks
            );
        }

    // Environment seems to support Web Components... Just run callbakc.
    } else {
        init();
    }
})(
    window,
    document,
    /* ES6 POLYFILL */ ("/" + "/cdnjs.cloudflare.com/ajax/libs/core-js/2.5.3/core.min.js"),
    /* GENERATOR POLYFILL */ ("/" + "/unpkg.com/regenerator-runtime@0.12.1/runtime.js"),
    /* WC POLYFILL */ ("/" + "/cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/2.0.2/webcomponents-bundle.js"),
    function () {

        // YOUR CODE HERE

    }
);