(function () {
    var regex = {
            op: /^[>^]$/,
            bool: /^(true|false)$/,
            selector: /^([^[]+)(\[(.+?)=(.+?)])?$/,
            term: /\s/
        },
        Query = function (selector) {
            var me = this;

            me.raw = selector;
            me.tree = [];

            me.parse();
        };

    Query.prototype = {
        parse: function () {
            var me = this,
                raw = me.raw.replace(/^\s+|\s+$/g, ''),
                stack = raw.split(''),
                token = '',
                stringOpen = false,
                c;

            while (stack.length) {
                c = stack.shift();

                if (regex.term.test(c) && !stringOpen) {
                    if (token.length > 0) {
                        me.processToken(token);

                        token = '';
                    }
                } else {
                    token = token + c;

                    if (c === '"' || c === "'") {
                        if (stringOpen && stringOpen === c) {
                            stringOpen = false;
                        } else if (!stringOpen) {
                            stringOpen = c;
                        }
                    }
                }
            }

            if (token.length > 0) {
                me.processToken(token);
            }
        },

        processToken: function (token) {
            var me = this;

            if (regex.op.test(token)) {
                me.addOp(token);
            } else if (regex.selector.test(token)) {
                me.addSelector(token);
            } else {
                JSoop.error('Selector improperly formed "' + me.raw.trim() + '"');
            }
        },

        addOp: function (op) {
            var me = this;

            me.tree.push(op);
        },

        addSelector: function (selector) {
            var me = this,
                match = regex.selector.exec(selector),
                type = match[1],
                attribute = match[3],
                value = match[4],
                fn = ['if (view.rtype !== \'' + type + '\') { return false; }'];

            if (attribute && !value) {
                fn.push('if (!view[\'' + attribute + '\']) { return false; }');
            }

            if (attribute && value) {
                fn.push('if (view[\'' + attribute + '\'] !== ' + value + ') { return false; }')
            }

            fn.push('return true;');

            fn = new Function('view', fn.join('\n'));

            me.tree.push(fn);
        },

        is: function (view) {
            var me = this,
                checking = view,
                currentOp = '',
                found = false,
                fn = me.tree[me.tree.length - 1],
                i;

            //check current view
            if (!fn(checking)) {
                return false;
            }

            //check any parent requirements
            for (i = me.tree.length - 2; i >= 0; i = i - 1) {
                fn = me.tree[i];

                if (JSoop.isFunction(fn)) {
                    checking = checking.owner;

                    if (!checking) {
                        return false;
                    }

                    if (currentOp === '') {
                        found = false;

                        do {
                            if (!fn(checking)) {
                                checking = checking.owner;
                            } else {
                                found = true;
                                break;
                            }
                        } while (checking);

                        if (!found) {
                            return false;
                        }
                    } else if (currentOp === '>') {
                        if (!fn(checking)) {
                            return false;
                        }
                    }

                    currentOp = '';
                } else {
                    currentOp = fn;
                }
            }

            return true;
        },

        execute: function () {
            var me = this,
                manager = Ramen.view.Manager,
                views = [];

            manager.each(function (view) {
                if (me.is(view)) {
                    views.push(view);
                }
            });

            return views;
        }
    };

    /**
     * @class Ramen.view.Query
     * Allows the querying of any objects the inherit from {@link Ramen.view.Box} in a css-like syntax based on
     * {@link Ramen.view.Box#rtype rtype} as the tag name.
     * @singleton
     */
    JSoop.define('Ramen.view.Query', {
        singleton: true,

        /**
         * Creates a pre-parsed version of the given query for quick use. If you're going to be doing a lot of checking
         * make sure you use this instead of {@link #is}.
         * @param {String} selector
         * @returns {Query}
         */
        parse: function (selector) {
            return new Query(selector);
        },

        /**
         * Checks the given view to see if it matches the given selector. If you're going to be using the selector a lot
         * it's better to store a parsed version of it using {@link #parse} and then call `is` directly on that object.
         * @param {Ramen.view.Box} view The view to check
         * @param {String} selector The query to check the view against
         * @returns {Boolean} Whether or not the view matches
         */
        is: function (view, selector) {
            var query = new Query(selector);

            return query.is(view);
        }
    });
}());
