JSoop.define('Spine.app.History', {
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

    createFrame: function () {
        var me = this,
            frame = Spine.dom.Helper.create({
                tag: 'iframe',
                src: 'javascript:0',
                tabindex: '-1'
            });

        me.iframe = frame.hide().appendTo('body')[0].contentWindow;
    },

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
            silent: true,
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

    getFragment: function (fragment) {
        var me = this;

        if (!fragment) {
            fragment = me.getHash();
        }

        return fragment.replace(/^[#\/]|\s+$/g, '');
    },

    getHash: function (target) {
        var match = (target || window).location.href.match(/#(.*)$/);

        return match ? match[1] : '';
    },

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

    loadUrl: function () {
        var me = this,
            fragment = me.getFragment();

        me.fireEvent('change', fragment);
    }
});
