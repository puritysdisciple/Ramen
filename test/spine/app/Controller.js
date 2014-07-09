describe('Spine.app.Controller', function () {
    var controller = JSoop.create('Spine.app.Controller', {
        routes: {
            'docs/:section(/:subsection)': 'onDocs'
        },

        sections: {
            controller: 0
        },
        subsections: {
            route: 0
        },

        onDocs: function (section, subsection) {
            var me = this;

            me.sections[section] = me.sections[section] + 1;

            if (subsection) {
                me.subsections[subsection] = me.subsections[subsection] + 1;
            }
        }
    });

    it('should correctly trigger routes', function () {
        runs(function () {
            window.location.hash = '#docs/controller';
        });

        waitsFor(function () {
            return controller.sections['controller'] === 1;
        }, 250);

        runs(function () {
            window.location.hash = '#docs/controller/route';
        });

        waitsFor(function () {
            return controller.sections['controller'] === 2 && controller.subsections['route'] === 1;
        }, 250);
    });
});
