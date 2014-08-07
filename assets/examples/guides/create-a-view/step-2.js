JSoop.define('Talk.view.Status', {
    //...

    //the tpl can be either a string or an array of strings for readability
    tpl: [
        '<div class="{{ baseCls }}-status">{{ status }}</div>',
        '<div id="{{ id }}-name" class="{{ baseCls }}-name">{{ name }}</div>',
        '<div class="{{ baseCls }}-message">{{ message }}</div>'
    ]
});
