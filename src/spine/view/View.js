JSoop.define('Spine.view.View', {
    extend: 'Spine.view.Box',

    stype: 'view',

    tpl: '',

    initView: function () {
        var me = this;

        me.renderData = me.renderData || {};

        me.callParent(arguments);
    },

    initRenderData: function (renderData) {
        var me = this;

        JSoop.applyIf(renderData, {
            id: me.getId(),
            baseCls: me.baseCls
        });

        return renderData;
    },

    onRenderDuring: function () {
        var me = this,
            renderData = me.initRenderData(me.renderData),
            tpl = me.getTemplate('tpl'),
            html = tpl.render(renderData);

        //todo: detach from jquery
        me.el.html(html);

        me.initRenderSelectors();
        me.initChildEls();
        me.initDomListeners();
    },

    addDomListener: function (el, ename, listener) {
        if (listener.single) {
            listener.callFn = function () {
                var ret = listener.fn.apply(listener.scope, arguments);

                //todo: detach from jquery
                el.unbind(ename, listener.callFn);

                return ret;
            };
        }

        //todo: detach from jquery
        el.bind(ename, listener.callFn);
    },

    initDomListener: function (ename, listener, defaults) {
        var me = this;

        if (!JSoop.isObject(listener)) {
            listener = {
                fn: listener
            };
        }

        if (JSoop.isString(listener.fn)) {
            listener.fn = me[listener.fn];
        }

        JSoop.applyIf(listener, defaults || {});
        JSoop.applyIf(listener, {
            scope: me
        });

        listener.fn = listener.callFn = JSoop.bind(listener.fn, listener.scope);

        return listener;
    },

    initDomListeners: function () {
        var me = this,
            domListeners = me.domListeners || {};

        JSoop.iterate(domListeners, function (events, el) {
            var defaultOptions = {};

            JSoop.iterate(events, function (listeners, ename) {
                if (ename === 'single' || ename === 'scope') {
                    defaultOptions[ename] = listeners;
                }
            });

            JSoop.iterate(events, function (listeners, ename) {
                if (ename === 'single' || ename === 'scope') {
                    return;
                }

                listeners = JSoop.toArray(listeners);

                JSoop.each(listeners, function (listener) {
                    listener = me.initDomListener(ename, listener, defaultOptions);
                    me.addDomListener(me[el], ename, listener);
                });
            });
        });
    },

    destroy: function () {
        var me = this,
            renderSelectors = me.renderSelectors || {},
            els = me.childEls || {};

        //Unbind and destroy renderSelectors
        JSoop.iterate(renderSelectors, function (selector, key) {
            //todo: detach from jquery
            me[key].off();
            me[key] = null;
        });

        //Unbind and destroy childEls
        JSoop.iterate(els, function (addition, key) {
            //todo: detach from jquery
            me[key].off();
            me[key] = null;
        });

        me.callParent();
    }
});
