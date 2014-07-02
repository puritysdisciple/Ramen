//====================================================================================================
// KEEP THIS MINIMAL!!!!
// SPINE IS NOT A DOM LIBRARY!!!!
//====================================================================================================

//This gives a hook for external libraries to override the dom methods here
//Possible use case is for adding legacy browser support
JSoop.namespace('SpineOverrides.dom');
SpineOverrides.dom.Element = SpineOverrides.dom.Element || {};

//All visual dom manipulations should be done via classes, as such we need almost nothing as far as dom functionality
JSoop.define('Spine.dom.Element', function () {
    var required = {
            statics: {
                create: function (el) {
                    var cache = Spine.dom.Element.cache;

                    if (el.isElement) {
                        return el;
                    }

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

            fnAlias: {
                addListener: 'on',
                removeListener: ['un', 'off']
            },

            isElement: true,

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
        destroy: function () {
            delete Spine.dom.Element.cache[this.id];
        },

        //manipulation
        appendTo: function (container) {
            var me = this,
                dom = me.dom;

            container = Spine.getEl(container);

            container.dom.appendChild(dom);
        },
        insertAt: function (container, index) {
            var me = this,
                dom = me.dom;

            container = Spine.getEl(container);

            if (index === undefined || !container.dom.childNodes[index]) {
                container.dom.appendChild(dom);
            } else {
                container.dom.insertBefore(me.el[0], container.childNodes[index]);
            }
        },
        remove: function () {
            var me = this,
                dom = me.dom;

            if (dom.parentNode) {
                dom.parentNode.removeChild(dom);
            }

            me.destroy();
        },

        //events
        addListener: JSoop.emptyFn,
        removeListener: JSoop.emptyFn,

        //classes
        hasClass: function (className) {
            return this.dom.className.split(' ').indexOf(className) !== -1;
        },
        addClass: function (classes) {
            var me = this,
                dom = me.dom;

            classes = JSoop.toArray(classes);

            JSoop.each(classes, function (className) {
                if (me.hasClass(className)) {
                    return;
                }

                dom.className = dom.className + ' ' + className;
            });

            me.cleanClassList();

            return me;
        },
        removeClass: function (className) {
            var me = this,
                dom = me.dom,
                regex;

            className = JSoop.toArray(className);

            regex = new RegExp('(^|\\b)' + className.join('|') + '(\\b|$)', 'gi');

            dom.className = dom.className.replace(regex, ' ');

            me.cleanClassList();

            return me;
        },
        toggleClass: function (classes) {
            var me = this;

            classes = JSoop.toArray(classes);

            JSoop.each(classes, function (className) {
                if (me.hasClass(className)) {
                    me.removeClass(className);
                } else {
                    me.addClass(className);
                }
            });

            return me;
        },
        cleanClassList: function () {
            var me = this;

            me.dom.className = me.dom.className.replace(/(^\s+|\s+$|\s{2,})/g, '');
        }
    };

    JSoop.applyIf(methods, SpineOverrides.dom.Element);
    JSoop.applyIf(methods, defaultMethods);

    JSoop.apply(methods, required);

    return methods;
}, function () {
    Spine.getEl = Spine.dom.Element.create;
});
