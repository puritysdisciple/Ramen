//todo: detach from twig
JSoop.define('Ramen.util.Template', {
    isTemplate: true,

    constructor: function (tpl) {
        var me = this;

        if (JSoop.isArray(tpl)) {
            tpl = tpl.join('');
        }

        me.raw = tpl;

        me.initTemplate();
    },

    initTemplate: function () {
        var me = this;

        me.tpl = Twig.twig({
            data: me.raw
        });
    },

    render: function (params) {
        return this.tpl.render(params);
    }
});
