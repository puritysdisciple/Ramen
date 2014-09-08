/**
 * @class Ramen.util.Template
 * A template that can be used to dynamically create content. Templates use the Twig templating language.
 */
//todo: detach from twig
JSoop.define('Ramen.util.Template', {
    isTemplate: true,
    /**
     * @param {String/String[]} tpl The desired template
     */
    constructor: function (tpl) {
        var me = this;

        if (JSoop.isArray(tpl)) {
            tpl = tpl.join('');
        }

        me.raw = tpl;

        me.initTemplate();
    },
    /**
     * @private
     */
    initTemplate: function () {
        var me = this;

        me.tpl = Twig.twig({
            data: me.raw
        });
    },
    /**
     * Renders the template using the given params.
     * @param {Object} params
     * @returns {String}
     */
    render: function (params) {
        return this.tpl.render(params);
    }
});
