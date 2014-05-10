JSoop.define('Spine', {
    singleton: true,

    id: (function () {
        var AUTO_ID = 0;

        return function (prefix) {
            AUTO_ID = AUTO_ID + 1;

            return prefix + '-' + AUTO_ID;
        }
    }())
});
