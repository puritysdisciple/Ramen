JSoop.define('Ramen.dom.Helper', {
    singleton: true,

    //todo: need to find a better list of singleton tags
    singletonRegEx: /^(br|hr|img|input|link|meta|param)$/,

    create: function (config) {
        //todo: detach from jquery
        return jQuery(Ramen.dom.Helper.markup(config));
    },

    markup: function (config) {
        var html = ['<' + config.tag];

        JSoop.iterate(config, function (value, attr) {
            if (attr === 'html') {
                return;
            }

            switch (attr) {
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
        } else {
            html.push('>');

            if (config.html) {
                html.push(config.html);
            }

            html.push('</' + config.tag + '>');
        }

        //todo: detach from jquery
        return html.join(' ');
    },

    addUnits: function (value) {
        if (JSoop.isNumber(value)) {
            value = value + 'px';
        }

        return value;
    },

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
                style.push(key + ':' + me.addUnits(value));
            }
        });

        return style.join(';');
    }
});
