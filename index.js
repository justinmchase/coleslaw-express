var assert = require('assert')
var coleslaw = require('coleslaw')

function generateCreateRoute(options, model) {
    var router = options.express.Router()
    router.put('/', (req, res, next) => {
        var data = req.body;
        options.dataAccess[model.name].create(data, (err, result) => {
            if (err) return next(err);
            res.status(201).send(result)
        })
    })
    return router
}

function generateRetrieveRoute(options, model) {
    var router = options.express.Router()
    return router
}

function generateUpdateRoute(options, model) {
    var router = options.express.Router()
    return router
}

function generateDeleteRoute(options, model) {
    var router = options.express.Router()
    return router
}

function generateCrudRoutes(options, model) {
    var router = options.express.Router()
    router.use(`/create`, generateCreateRoute(options, model))
    router.use(`/retrieve`, generateRetrieveRoute(options, model))
    router.use(`/update`, generateUpdateRoute(options, model))
    router.use(`/delete`, generateDeleteRoute(options, model))
    return router
}

function generate(options, model) {
    assert(options)
    assert(model)

    if (!options.express) options.express = require('express')

    if (typeof model === 'object' && model.length) {
        return model
            .map(m => generate(express, m))
            .filter(m => m != null)
    }

    if (typeof model === 'object' && model.type === 'model') {
        var name = model.name
        var router = options.express.Router()
        router.use(`/${name}`, generateCrudRoutes(options, model))
        return router
    }

}

module.exports = {
    generate: generate
}