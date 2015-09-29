var restful = require('node-restful')


//setup controller for rest
module.exports = function (app, route) {

    console.log('*********************' + 'here'   +"****************") //TODO delete

    var rest = restful.model('issues', app.models.issue).
        methods(['get', 'put', 'post', 'delete']);

    rest.register(app, route);

    return function (req, res, next) {
        console.log('------------------') //TODO remove
        next();
    }
}