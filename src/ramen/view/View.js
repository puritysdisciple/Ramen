/**
 * @class Ramen.view.View
 * A more advanced version of a {@link Ramen.view.Box} adding templating, dom events, and child elements. In most cases,
 * this is a good place to start when creating your own custom views.
 * @extends Ramen.view.Box
 */
JSoop.define('Ramen.view.View', {
    extend: 'Ramen.view.Box',

    isView: true,

    rtype: 'view',

    /**
     * @cfg {String/String[]}
     * The template used to render the view.
     */
    tpl: '',
    /**
     * @cfg {Object} domListeners
     * An object containing listener definitions for elements within the view. The keys of this object are names of
     * elements within the view, and the values are listener configs similar to those used by JSoop.mixins.Observable.
     * Elements must be present in either {@link #childEls} or {@link #childSelectors}.
     *
     * For example:
     *
     *      ...
     *      domListeners: {
     *          buttonEl: {
     *              click: {
     *                  fn: 'onButtonClick',
     *                  single: true
     *              }
     *              mouseover: 'onButtonOver',
     *              mouseout: 'onButtonOut'
     *          }
     *      },
     *      ...
     */
    /**
     * @cfg {Object} childEls
     * An object containing a listing on elements that the view needs references to once its template has been rendered.
     * They keys are the names of properties to store the elements as, and the values are pieces of ID's that, when
     * added to the ID of view, can be used to locate the elements in the DOM. For example:
     *
     *      ...
     *      tpl: '<button id="{{ id }}-btn"></button>',
     *      childEls: {
     *          buttonEl: 'btn'
     *      },
     *      ...
     */
    /**
     * @cfg {Object} childSelectors
     * Similar to {@link #childEls} this object contains property names as its keys and css selectors as its values. In
     * general, childEls should be used when selecting only a single element as it is more performant. However, when you
     * need a reference to groups of elements, childSelectors should be used. For example:
     *
     *      ...
     *      tpl: [
     *          '<ul>',
     *              '<li>Item 1</li>',
     *              '<li>Item 2</li>',
     *              '<li>Item 3</li>',
     *          '</ul>'
     *      ],
     *      childSelectors: {
     *          listEls: 'li'
     *      },
     *      ...
     */
    /**
     * @cfg {Object} renderData
     * This object will be passed to the template at render time. `baseCls` and `id` will be passed automatically.
     */

    baseCls: 'view',
    baseId: 'view',

    initView: function () {
        var me = this;

        me.renderData = me.renderData || {};

        me.callParent(arguments);
    },

    /**
     * @private
     * @param {Object} renderData
     * @returns {Object}
     */
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

        me.initChildSelectors();
        me.initChildEls();
        me.initDomListeners();
    },
    /**
     * @private
     * @param {HTMLElement} el
     * @param {String} ename
     * @param {Object} listener
     */
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
    /**
     * @private
     * @param {String} ename
     * @param {Function/String} listener
     * @param {Object} defaults
     * @returns {Object}
     */
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
    /**
     * @private
     */
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

        //todo: detach from jquery
        me.el.detach();

        //Unbind and destroy renderSelectors
        JSoop.iterate(renderSelectors, function (selector, key) {
            //todo: detach from jquery
            me[key].remove();
            me[key] = null;
        });

        //Unbind and destroy childEls
        JSoop.iterate(els, function (addition, key) {
            //todo: detach from jquery
            me[key].remove();
            me[key] = null;
        });

        me.callParent();
    }
});
