JSoop.define('Ramen.data.filter.ModelFilter', {
    extend: 'Ramen.util.filter.Filter',

    createFilterFn: function (attributes) {
        var body = [];

        JSoop.iterate(attributes, function (value, key) {
            body.push('item.get("' + key + '") === attributes["' + key + '"]');
        });

        body = 'return ' + body.join(' && ') + ';';

        return new Function('item', 'attributes', body);
    }
});
