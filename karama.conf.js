// Karma configuration
// Generated on Fri Jan 24 2014 13:36:17 GMT-0800 (PST)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: 'src/',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            //testing plugin
            //'../lib/jasmine-jquery.js',

            //Spine Dependencies
            '../lib/jquery.js',
            '../lib/jsoop-debug.js',
            '../lib/twig.js',

            //Core
            'Spine.js',

            //Util
            'spine/util/Renderable.js',
            'spine/util/Sortable.js',
            'spine/util/Template.js',
            'spine/util/filter/Filter.js',
            'spine/util/filter/Filterable.js',

            //Data
            'spine/data/filter/ModelFilter.js',

            //Collection
            'spine/collection/List.js',
            'spine/collection/Dictionary.js',

            //Data
            'spine/data/association/Association.js',
            'spine/data/association/HasMany.js',
            'spine/data/association/HasOne.js',
            'spine/data/Field.js',
            'spine/data/Model.js',
            'spine/data/Collection.js',

            //Dom
            'spine/dom/Helper.js',

            //View
            'spine/view/ViewManager.js',
            'spine/view/Box.js',
            'spine/view/View.js',
                //Binding
                'spine/view/binding/Binding.js',
                'spine/view/binding/ModelBinding.js',

            //Helpers
            '../test/helper/data/Person.js',
            '../test/helper/data/Company.js',

            //Tests
            '../test/spine/*/*.js',
            '../test/spine/*/*/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
