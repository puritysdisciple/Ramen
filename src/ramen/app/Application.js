/**
 * @class Ramen.app.Application
 * Represents a Ramen application. In most cases, this is a single page application that contains one or more
 * {@link Ramen.view.View views}. The behavior of views is controlled by {@link Ramen.app.Controller controllers} and
 * application data is managed through {@link Ramen.data.Model models} and {@link Ramen.data.Collection collections}.
 *
 * Controllers and collections are instantiated through this class:
 *
 *      Ramen.application({
 *          collections: {
 *              Users: 'Demo.collection.Users'
 *          },
 *
 *          controllers: {
 *              user: 'Demo.collection.User'
 *          },
 *
 *          run: function () {
 *              //application execution
 *          }
 *      });
 *
 * This will setup the desired collection and controller, and will call the `run` function when everything is ready. It
 * should rarely be required to extend this class. Instead, use {@link Ramen#application} to create a new application.
 *
 * @mixins JSoop.mixins.Configurable
 */
JSoop.define('Ramen.app.Application', {
    mixins: {
        configurable: 'JSoop.mixins.Configurable'
    },

    /**
     * @cfg {Object} controllers
     * Creates controllers with the given names and types. In the following example, the controller `user` will be
     * created with the type `Demo.controller.User`:
     *
     *      ...
     *      controllers: {
     *          user: 'Demo.controller.User'
     *      },
     *      ...
     *
     * The value of each key-value pair can either be a `string` defining the type that should be created, or a config
     * object that can be used to create a controller. If a config object is used, the `type` key must be populated
     * with the desired controller type to be created. Each controller receives an `app` property that references the
     * application that created it.
     */
    /**
     * @cfg {Object} collections
     * Creates collections with the given names and types. These collections will then be accessible via
     * {@link Ramen#getCollection}. For example, the following creates a collection of type `Demo.collection.Users` and
     * makes it available under the name `Users`.
     *
     *      ...
     *      collections: {
     *          Users: 'Demo.collection.Users'
     *      },
     *      ...
     */

    /**
     * Creates a new Application
     * @param {Object} config The config object
     */
    constructor: function (config) {
        var me = this;

        me.initMixin('configurable', [config]);

        me.initCollections();
        me.initControllers();

        me.run();

        Ramen.app.History.start();
    },

    initCollections: function () {
        var me = this;

        me.collections = me.collections || {};

        JSoop.iterate(me.collections, function (value, key) {
            if (!value.isCollection) {
                value = JSoop.create(value);
            }

            Ramen.addCollection(key, value);
        });
    },

    initControllers: function () {
        var me = this;

        me.controllers = me.controllers || {};

        JSoop.iterate(me.controllers, function (value, key) {
            if (JSoop.isString(value)) {
                value = {
                    type: value
                };
            }

            value.app = me;

            me.controllers[key] = JSoop.create(value.type, value);
        });
    },

    /**
     * @method
     * Called after all {@link #controllers} and {@link #collections} have been created.
     * @template
     */
    run: JSoop.emptyFn
}, function () {
    /**
     * @member Ramen
     * Creates a new {@link Ramen.app.Application}.
     * @param {Object} config The config object
     */
    Ramen.application = function (config) {
        if (config.requires) {
            JSoop.Loader.require(config.requires);
        }

        JSoop.create('Ramen.app.Application', config);
    };
});
