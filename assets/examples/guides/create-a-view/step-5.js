var user = JSoop.create('Talk.model.User', {
        name: 'Eric',
        status: 'away',
        message: 'I am currently out of the office'
    }),
    status = JSoop.create('Talk.view.Status', {
        //give the view our user model
        model: user,

        //we're going to render it to the body of the document
        renderTo: 'body',

        //we want it to render instantly instead of calling the 'render' method
        autoRender: true
    });
