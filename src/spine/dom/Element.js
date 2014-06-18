//====================================================================================================
// KEEP THIS MINIMAL!!!!
// SPINE IS NOT A DOM LIBRARY!!!!
//====================================================================================================

//This gives a hook for external libraries to override the dom methods here
//Possibile use case is for adding legacy browser support
JSoop.namespace('SpineOverrides.dom');
SpineOverrides.dom.Element = SpineOverrides.dom.Element || {};

JSoop.define('Spine.dom.Element', function () {
    var required = {
            statics: {
                create: function (el) {
                    var cache = Spine.dom.Element.cache;

                    if (JSoop.isString(el)) {
                        if (cache[el]) {
                            return cache[el];
                        }

                        el = document.getElementById(el);
                    }

                    if (el) {
                        return JSoop.create('Spine.dom.Element', el);
                    }
                },

                cache: {}
            },

            constructor: function (el) {
                var me = this;

                me.dom = el;

                if (!me.dom.id) {
                    me.dom.id = Spine.id('dom');
                }

                me.id = me.dom.id;

                Spine.dom.Element.cache[me.id] = me;
            }
        },
        methods = {},
        defaultMethods;


    defaultMethods = {
        //manipulation
        append: JSoop.emptyFn,
        remove: JSoop.emptyFn,

        //events
        on: JSoop.emptyFn,
        un: JSoop.emptyFn,

        //classes
        addClass: JSoop.emptyFn,
        removeClass: JSoop.emptyFn,
        toggleClass: JSoop.emptyFn
    };

    JSoop.applyIf(methods, SpineOverrides.dom.Element);
    JSoop.applyIf(methods, defaultMethods);

    JSoop.apply(methods, required);

    return methods;
}, function () {
    Spine.getEl = Spine.dom.Element.create;
});
