/**
 * @class Ramen.app.History
 * @singleton
 * @mixins JSoop.mixins.Observable
 * Represents browser history state and is used to track changes in the browser history state. In general this class
 * should not be used, instead use {@link Ramen.app.Controller#routes routes} to moniter and execute code based on
 * browser state.
 */
JSoop.define('Ramen.app.History', {
    mixins: {
        observable: 'JSoop.mixins.Observable'
    },

    singleton: true,

    isStarted: false,
    interval: 50,

    constructor: function () {
        var me = this;

        me.initMixin('observable');
    },

    /**
     * @private
     */
    start: function () {
        var me = this,
            docMode, isOldIE, checkUrl;

        if (me.isStarted) {
            return;
        }

        me.isStarted = true;

        docMode = document.documentMode;
        isOldIE = (/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

        if (isOldIE) {
            me.createFrame();
            me.navigate(me.getFragment());
        }

        checkUrl = JSoop.bind(me.checkUrl, me);

        if (('onhashchange' in window) && !isOldIE) {
            jQuery(window).on('hashchange', checkUrl);
        } else {
            me.checkUrlInterval = setInterval(checkUrl, me.interval);
        }

        checkUrl();
    },

    /**
     * @private
     */
    createFrame: function () {
        var me = this,
            frame = Ramen.dom.Helper.create({
                tag: 'iframe',
                src: 'javascript:0',
                tabindex: '-1'
            });

        me.iframe = frame.hide().appendTo('body')[0].contentWindow;
    },

    /**
     * @method
     * Changes the current history state
     * @param {Object/string} config The config object or new fragment
     * @param {string} config.fragment The new fragment
     * @param {boolean} [config.silent=false] Whether or not to supress the change event
     * @param {boolean} [config.replace=false] Whether or not to replace the current history state
     */
    navigate: function (config) {
        var me = this,
            fragment;

        if (!me.isStarted) {
            return;
        }

        if (JSoop.isString(config)) {
            config = {
                fragment: config
            };
        }

        JSoop.applyIf(config, {
            silent: false,
            replace: false
        });

        // Strip the hash for matching.
        fragment = config.fragment.replace(/#.*$/, '');

        if (me.fragment === fragment) {
            return;
        }

        me.fragment = fragment;

        me.updateFragment(config.fragment, config.replace);

        if (!config.silent) {
            me.fireEvent('change', fragment);
        }
    },

    /**
     * @private
     */
    updateFragment: (function () {
        function updateLocation (location, fragment, replace) {
            if (replace) {
                location.replace(location.href.replace(/(javascript:|#).*$/, '') + '#' + fragment);
            } else {
                // Some browsers require that `hash` contains a leading #.
                location.hash = '#' + fragment;
            }
        }

        return function (fragment, replace) {
            var me = this,
                location = window.location,
                frameFragment, frameLocation;

            updateLocation(location, fragment, replace);

            if (me.frame) {
                frameLocation = me.frame.location;

                frameFragment = me.getHash(me.frame);
                frameFragment = me.getFragment(frameFragment);

                if (fragment !== frameFragment) {
                    if (!replace) {
                        me.frame.document.open().close();
                    }

                    updateLocation(frameLocation, fragment, location);
                }
            }
        };
    }()),

    /**
     * @method
     * Gets the current fragment
     * @returns {string} The current fragment
     */
    getFragment: function (fragment) {
        var me = this;

        if (!fragment) {
            fragment = me.getHash();
        }

        return fragment.replace(/^[#\/]|\s+$/g, '');
    },

    /**
     * @private
     */
    getHash: function (target) {
        var match = (target || window).location.href.match(/#(.*)$/);

        return match ? match[1] : '';
    },

    /**
     * @private
     */
    checkUrl: function () {
        var me = this,
            current = me.getFragment();

        if (current === me.fragment && me.frame) {
            current = me.getFragment(me.getHash(me.frame));
        }

        if (current === me.fragment) {
            return false;
        }

        me.fragment = current;

        if (me.frame) {
            me.navigate(current);
        }

        me.loadUrl();

        return true;
    },

    /**
     * @private
     */
    loadUrl: function () {
        var me = this,
            fragment = me.getFragment();

        /**
         * @event change
         * Fired when the history state changes
         * @param {string} fragment the new fragment
         */
        me.fireEvent('change', fragment);
    }
});
