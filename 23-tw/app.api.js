const bodyParser = require('body-parser');

module.exports = function setupAPI(app) {
    app.use('/api/',
        bodyParser.json({extended: true}),
    );

    app.get('/health',
        handlerHealth
    );

    app.use('/',
        handler404,
        handler500
    );
}

function handler404(req, res, next) {
    res
        .status(404)
        .send('404 - Not Found\n');
}

function handler500(err, req, res, next) {
    console.error(err);
    res
        .status(500)
        .json({message: 'Something went wrong, try again'});
}

function handlerHealth(req, res) {
    res
        .json({status: 'ok'});
}
