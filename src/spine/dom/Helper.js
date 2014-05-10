JSoop.define('Spine.dom.Helper', {
    singleton: true,

    //todo: need to find a better list of singleton tags
    singletonRegEx: /^(br|hr|img|input|link|meta|param)$/,

    create: function (config) {
        var html = ['<' + config.tag];

        JSoop.iterate(config, function (value, attr) {
            switch (attr) {
                case 'tag':
                    return;
                case 'cls':
                    attr = 'class';
                    value = JSoop.toArray(value).join(' ');
                    break;
                case 'style':
                    value = Spine.dom.Helper.parseStyle(value);
                    break;
            }

            html.push(attr + '="' + value + '"');
        });

        if (Spine.dom.Helper.singletonRegEx.test(config.tag)) {
            html.push('/>');
        } else {
            html.push('></' + config.tag + '>');
        }

        //todo: detach from jQuery
        return jQuery(html.join(''));
    },

    parseStyle: function (obj) {
        var style = [];

        if (JSoop.isString(obj)) {
            return obj;
        }

        JSoop.iterate(obj, function (value, key) {
            style.push(key + ':' + value);
        });

        return style.join(';');
    }
});
