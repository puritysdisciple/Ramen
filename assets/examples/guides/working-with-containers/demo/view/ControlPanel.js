JSoop.define('Talk.view.ControlPanel', {
    extend: 'Ramen.view.container.Container',

    rtype: 'control-panel',
    baseId: 'control-panel',
    baseCls: 'control-panel',

    tpl: [
        '<div id="{{ id }}-header" class="{{ baseCls }}-header">Talk</div>',
        '<div id="{{ id }}-container"></div>'
    ],

    childEls: {
        headerEl: 'header',
        containerEl: 'container'
    },

    domListeners: {
        headerEl: {
            click: 'onHeaderClick'
        }
    },

    targetEl: 'containerEl',

    initView: function () {
        var me = this;

        me.items = [{
            type: 'Talk.view.ContactList',
            collection: me.model.getContacts()
        }];

        me.callParent(arguments);
    },

    onHeaderClick: function () {
        var me = this;

        if (me.containerEl.css('display') === 'none') {
            me.containerEl.css('display', 'block');
        } else {
            me.containerEl.css('display', 'none');
        }
    }
});
