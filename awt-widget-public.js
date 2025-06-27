
    (function () {
        'use strict';
        var _onReadyCallbacks = [];


        /**
         * Exposition temporaire du builder avec la méthode onReady.
         * Il sera écrasé par le véritable builder une fois le JS awt-bundle chargé.
         * @type {{extendDefaultConfig: Window.awtPchBuilder.extendDefaultConfig, onReady: Window.awtPchBuilder.onReady}}
         */
        window.awtPchBuilder = {
            onReady: function (callback) {
                _onReadyCallbacks.push(callback);
            }
        };

        function loadScriptAsync(src, callback) {
            var scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.charset = "UTF-8";
            scriptElement.src = src;

            if (scriptElement.addEventListener) { // IE9+, Chrome, Firefox
                scriptElement.addEventListener("load", callback, false);
            } else if (scriptElement.readyState) { // IE8
                scriptElement.onreadystatechange = function () {
                    if (this.readyState === "loaded" || this.readyState === "complete") {
                        callback.apply(this, arguments);
                    }
                };
            }

            // fire the loading
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(scriptElement);
        }

        loadScriptAsync("/icd/static/pch-front-js/3.5.0/awtPchBuilder.js", function () {
            

window.awtPchBuilder = window.awtPchBuilder || {};
window.awtPchBuilder.defaultConfiguration = {
    awtResourcesUrlPrefix: "/icd/static/pch-front-js/3.5.0",
    awtBffUrlPrefix: "/icd/pch",
    awtSilentRoutes: true,
    context: {
        
            marche: "PRI",
            enseigne: "BDDF",
            banque: "bddf",
        
            media: "site-web",
        
    },
    
        isSupervisorMode: false,
    
};

            var _onReadyCallback;
            window.awtPchBuilder.extendDefaultConfig({
                gdaResourcesUrlPrefix: '/swm/resources',
                logServicesUrls: {
                    defaut: '/icd/pch/data/pch-log-ident-public.json'
                },
                niveauMinimalLogSurServeur: 'ERROR',
                niveauMinimalLogSurClient: 'WARNING',
                env: 'PP'
            });
            while (_onReadyCallback = _onReadyCallbacks.shift()) {
                typeof _onReadyCallback === "function" && _onReadyCallback();
            }
        });

    })();
