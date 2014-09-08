/**
 * @class Ramen.dom.Helper
 * A helper class that turns structured objects into HTMLElements or markup. A dom object consists of a tag, and then
 * any attributes you want to add to the tag. There are a few special keys that you can use:
 *
 *  - <strong>cls</strong> - is used to add css classes as `class` is a keyword in javascript, and can't be used as a key
 *  - <strong>style</strong> - can either be a string, or an object. A style object will be converted to valid
 *    css. Any appropriate numbers will have "px" added to them as units. You can also use nested objects for
 *    styles that have multiple properties for example "padding-left", "padding-right", etc can instead be written:
 *
 *        {
 *            padding: {
 *                top: 5
 *                left: 10,
 *                right: 10,
 *                bottom: 5
 *            }
 *        }
 *
 *  - <strong>html</strong> - will be applied to the innerHTML of the created tag
 *  - <strong>children</strong> - is an array of tag objects that will be added as children to the created tag.
 *
 *  The following is a correctly formatted object:
 *
 *      Ramen.dom.Helper.markup({
 *          tag: 'ul',
 *          cls: [
 *              'task-list',
 *              'important-list'
 *          ],
 *          style: {
 *              margin: {
 *                  top: 20
 *              }
 *          },
 *          children: [{
 *              tag: 'li',
 *              html: 'Write awesome app'
 *          }, {
 *              tag: 'li',
 *              html: '???'
 *          }, {
 *              tag: 'li',
 *              html: 'profit'
 *          }]
 *      });
 *
 * @singleton
 */
JSoop.define('Ramen.dom.Helper', {
    singleton: true,

    //todo: need to find a better list of singleton tags
    singletonRegEx: /^(br|hr|img|input|link|meta|param)$/,
    unitlessRegEx: /^(font-weight|z-index)$/,

    /**
     * Generates HTMLElements from the given tag object.
     * @param {Object} config The tag config
     * @returns {HTMLElement} The generated HTMLElements
     */
    create: function (config) {
        //todo: detach from jquery
        return jQuery(Ramen.dom.Helper.markup(config));
    },

    /**
     * Generates HTML markup from the given tag object.
     * @param {Object} config The tag config
     * @returns {String} The generated markup
     */
    markup: function (config) {
        var me = this,
            html = ['<' + config.tag];

        JSoop.iterate(config, function (value, attr) {
            switch (attr) {
                case 'html':
                    return;
                case 'children':
                    return;
                case 'tag':
                    return;
                case 'cls':
                    attr = 'class';
                    value = JSoop.toArray(value).join(' ');
                    break;
                case 'style':
                    value = Ramen.dom.Helper.parseStyle(value);
                    break;
            }

            html.push(attr + '="' + value + '"');
        });

        if (Ramen.dom.Helper.singletonRegEx.test(config.tag)) {
            html.push('/>');
        } else if (config.html) {
            html.push('>' + config.html + '</' + config.tag + '>');
        } else if (config.children) {
            html.push('>');

            JSoop.each(config.children, function (child) {
                html.push(me.markup(child));
            });

            html.push('</' + config.tag + '>');
        } else {
            html.push('></' + config.tag + '>');
        }

        //todo: detach from jquery
        return html.join(' ');
    },

    /**
     * @private
     * @param {Number} value
     * @returns {String}
     */
    addUnits: function (key, value) {
        if (JSoop.isNumber(value) && !this.unitlessRegEx.test(key)) {
            value = value + 'px';
        }

        return value;
    },

    /**
     * @private
     * @param {Object} obj
     * @returns {String}
     */
    parseStyle: function (obj) {
        var me = this,
            style = [];

        if (JSoop.isString(obj)) {
            return obj;
        }

        JSoop.iterate(obj, function (value, key) {
            if (JSoop.isObject(value)) {
                JSoop.iterate(value, function (subValue, subKey) {
                    style.push(key + '-' + subKey + ':' + me.addUnits(value));
                });
            } else {
                style.push(key + ':' + me.addUnits(key, value));
            }
        });

        return style.join(';');
    }
});
