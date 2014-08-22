/**
 * @class Ramen.app.Controller
 * @mixins JSoop.mixins.Configurable
 * Represents a set of behaviors. In general this means responding to changes in page state or using
 * {@link Ramen.view.View view} events to change that state. Controllers do this through
 * {@link Ramen.app.Controller#routes routes} and {@link Ramen.app.Controller#control controlls}. For example, a
 * controller designed to handle user state could look something like:
 *
 *      JSoop.define('Demo.controller.User', {
 *          extend: 'Ramen.app.Controller',
 *
 *          routes: {
 *              'users/list': 'onRouteList',
 *              'users/edit/:user': 'onRouteEdit'
 *          },
 *
 *          initController: function () {
 *              var me = this;
 *
 *              me.control({
 *                  'user-list': {
 *                      'select': me.onUserSelect,
 *                      'scope': me
 *                  }
 *              });
 *
 *              me.callParent(arguments);
 *          },
 *
 *          onRouteEdit: function (user) {
 *              user = Ramen.getCollection('Users').get(parseInt(user, 10));
 *              ...
 *          },
 *
 *          onUserSelect: function (user) {
 *              this.navigate('users/edit/' + user.get('id'));
 *          }
 *      });
 *
 * If a controller starts becoming too large, it is advisable to break it into smaller pieces using
 * {@link Ramen.app.Helper helpers}. This can make very large sections of your app's behavior easier to manage, without
 * breaking the desired structure.
 */
JSoop.define('Ramen.app.Controller', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    /**
     * @cfg {Object} routes
     * A list of routes and callbacks. If the browser's hash matches one of the patterns here, it will trigger the
     * defined callback. The callback can be either a function or name of a function. Also, the scope of a callback
     * can be defined with either an object, or the name of a helper. For example:
     *
     *      ...
     *      helpers: {
     *          'search': 'Demo.controller.helpers.UserSearch'
     *      },
     *
     *      routes: {
     *          'users/edit/:user': 'onRouteEdit',
     *          'users/search?:query': {
     *              fn: 'onRouteSearch',
     *              //use the search helper
     *              scope: 'search'
     *          }
     *      },
     *
     *      onRouteEdit: function (user) {
     *          ...
     *      },
     *      ...
     */

    /**
     * @cfg {Object} helpers
     * A list of helpers that will be created. For example:
     *
     *      ...
     *      helpers: {
     *          search: 'Demo.controller.helpers.UserSearch'
     *      },
     *      ...
     *
     * See {@link Ramen.app.Helper} for more details about helpers.
     */

    /**
     * Creates a new controller
     * @param {Object} config The config object
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        me.queries = {};

        me.controlling = [];

        Ramen.view.ViewManager.on('add', me.onViewAdd, me);

        me.initController();
        me.initHelpers();
        me.initRouter();
    },

    /**
     * @method
     * Called after the config has been applied, but before any other actions have been taken.
     * @template
     */
    initController: JSoop.emptyFn,

    initHelpers: function () {
        var me = this,
            helpers = me.helpers;

        me.helpers = {};

        if (helpers) {
            JSoop.iterate(helpers, function (helper, key) {
                if (JSoop.isString(helper)) {
                    helper = {
                        type: helper
                    };
                }

                helper.owner = me;

                me.helpers[key] = JSoop.create(helper.type, helper);
            });
        }
    },

    initRouter: function () {
        var me = this;

        me.routes = me.routes || {};

        me.router = JSoop.create('Ramen.app.Router', {
            listeners: {
                route: me.onRouterRoute,
                scope: me
            }
        });

        JSoop.iterate(me.routes, function (callback, route) {
            me.router.add(route);
        });
    },

    /**
     * Sets up {@link Ramen.view.Query view queries} that can be used to identify new views added to
     * {@link Ramen.view.Manager}. If a view matches one of the selectors, the events nested in the object will be
     * attached to it. For example, this will attach to all new views and log a message when they are rendered:
     *
     *      this.control({
     *          //look for all new views
     *          'view': {
     *              'render:after': function (view) {
     *                  console.log(view.getId() + ' rendered');
     *              }
     *          }
     *      });
     *
     * @param {Object} config The list of selectors and events this controller should react to
     */
    control: function (config) {
        var me = this;

        JSoop.iterate(config, function (events, selector) {
            me.controlling.push({
                selector: selector,
                events: events,
                query: Ramen.view.Query.parse(selector)
            });
        });
    },

    /**
     * @inheritdoc Ramen.app.History#navigate
     */
    navigate: function (config) {
        Ramen.app.History.navigate(config);
    },

    onViewAdd: function (manager, views) {
        var me = this;

        JSoop.each(me.controlling, function (control) {
            JSoop.each(views, function (view) {
                if (control.query.is(view)) {
                    view.on(control.events);
                }
            });
        });
    },

    onRouterRoute: function (router, path, route) {
        var me = this,
            callback = me.routes[path],
            scope;

        if (!callback) {
            return;
        }

        if (JSoop.isString(callback)) {
            callback = {
                fn: callback
            };
        }

        JSoop.applyIf(callback, {
            scope: me
        });

        if (JSoop.isString(callback.scope)) {
            callback.scope = me.helpers[callback.scope];
        }

        if (JSoop.isString(callback.fn)) {
            callback.fn = callback.scope[callback.fn];
        }

        return callback.fn.apply(callback.scope, route.getParams(Ramen.app.History.getFragment()));
    }
});
