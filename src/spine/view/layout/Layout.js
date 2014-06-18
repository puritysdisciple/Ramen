/*
layout: {
    baseCls: 'layout',
    tpl: [
        '<div class="{{ baseCls }}-template"></div>'
    ],
    wrapperCls: 'wrapper',
    targetEl: 'layout-template',
    wrapperTag: 'div'
}

<div class="container">
    <div class="layout-container">
        <div class="{{ ownerId }}-template">
            <div class="layout-wrapper">
                <div class="item-el"></div>
            </div>
            <div class="layout-wrapper">
                <div class="item-el"></div>
            </div>
            <div class="layout-wrapper">
                <div class="item-el"></div>
            </div>
        </div>
    </div>
</div>
*/

JSoop.define('Spine.view.layout.Layout', {
    alias: 'layout.auto',

    mixins: {
        configurable: 'JSoop.mixins.Configurable',
        observable: 'JSoop.mixins.Observable',
        renderable: 'Spine.util.Renderable'
    },

    isLayout: true,

    baseCls: 'layout',
    tpl: '',

    wrapperCls: 'wrapper',
    wrapperTag: 'div',

    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);
        me.initMixin('observable');

        me.itemCache = {};

        me.attachEvents();

        me.initLayout();
        me.render();
    },

    initLayout: JSoop.emptyFn,

    attachEvents: function () {
        var me = this;

        me.owner.items.on({
            'add:before': me.onAddBefore,
            'add': me.onAdd,
            'remove': me.onRemove,
            scope: me
        });
    },

    getTargetEl: JSoop.emptyFn,
    createWrapper: JSoop.emptyFn,
    renderItem: function (item, index) {
        var me = this,
            id = item.getId();

        if (me.itemCache[id]) {
            //this is a move call

        }

        if (!item.isRendered) {

        }
    },

    removeItem: JSoop.emptyFn,

    //====================================================================================================
    //Event Listeners
    //====================================================================================================
    onAddBefore: function (dictionary, item, index) {
        var me = this;

        if (item.isBox) {
            if (item.owner !== me.owner) {
                item.owner.remove(item);
            }

            return;
        }

        item = me.owner.initItem(item);

        dictionary.insert(item, index);

        return false;
    },

    onAdd: function (dictionary, added) {
        var me = this;

        JSoop.each(added, function (item) {
            var index = dictionary.indexOf(item);

            me.renderItem(item, index);
        });
    },

    onRemove: function (dictionary, removed) {
        var me = this;

        JSoop.each(removed, function (item) {
            me.removeItem(item);
        });
    },



























    /*
    getId: function () {
        var me = this;

        if (!me.id) {
            me.id = me.owner.getId() + '-layout';
        }

        return me.id;
    },

    render: function () {
        var me = this,
            target = me.owner.getTargetEl(),
            tpl = me.getTemplate('tpl'),
            el = me.createEl(),
            renderData = me.renderData || {};

        JSoop.applyIf(renderData, {
            baseCls: me.baseCls,
            id: me.getId()
        });

        //todo: detach from jquery
        el.html(tpl.render(renderData));

        me.initRenderSelectors();
        me.initChildEls();

        target.append(me.el);
    },

    renderItem: function (item, index) {
        var me = this,
            target = me.getTargetEl();

        if (!item.isRendered) {
            item.render(target, index);

            return;
        }

        if (index === undefined || !target[0].childNodes[index]) {
            target.append(item.el);
        } else {
            target = target[0];

            target.insertBefore(me.el[0], target.childNodes[index]);
        }
    },

    move: function (item, index) {

    },

    getTargetEl: function () {
        var me = this,
            target = me.targetEl || 'el';

        return me[target];
    }
    */
});
