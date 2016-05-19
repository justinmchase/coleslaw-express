var assert = require('assert')
var coleslaw = require('coleslaw')

// POST            Creates a new resource.
// GET             Retrieves a resource.
// PUT             Updates an existing resource.
// DELETE          Deletes a resource.

function generateCreateRoute(options, model) {
    var router = options.express.Router()
    router.post('/', (req, res, next) => {
        var data = req.body
        var T = options.models[model.name];
        var instance = new T()
        instance.set(data)
        instance.save((err, result) => {
            if (err) return next(err)
            res.status(200).send(result)
        })
    })
    return router
}

function generateRetrieveRoute(options, model) {
    var router = options.express.Router()
    model.fields.forEach(field => {
        if (field.index) {
            router.get('/:' + field.name, (req, res, next) => {
                var data = req.params
                options.dataAccess[model.name].create(data, (err, result) => {
                    if (err) return next(err)
                    res.status(200).send(result)
                })
            })
        }
    })
    return router
}

function generateUpdateRoute(options, model) {
    var router = options.express.Router()
    router.put('/', (req, res, next) => {
        var data = req.body
        options.dataAccess[model.name].create(data, (err, result) => {
            if (err) return next(err)
            res.status(200).send(result)
        })
    })
    return router
}

function generateDeleteRoute(options, model) {
    var router = options.express.Router()
    router.delete('/', (req, res, next) => {
        var data = req.body
        options.dataAccess[model.name].delete(data, (err, result) => {
            if (err) return next(err)
            res.status(200).send({ ok: true })
        })
    })
    return router
}

function generateCrudRoutes(options, model) {
    var router = options.express.Router()
    router.use(generateCreateRoute(options, model))
    router.use(generateRetrieveRoute(options, model))
    router.use(generateUpdateRoute(options, model))
    router.use(generateDeleteRoute(options, model))
    return router
}

function build(options, callback) {
    assert(options)
    assert(callback)

    if (!options.express) options.express = require('express')
    
    var router = options.express.Router()
    var definitions = options.definitions
    
    definitions.forEach(model => {
        var name = model.name
        var type = options.models[name]
        router.use(`/${name}`, generateCrudRoutes(options, model))
    })
    
    options.routes = router
    
    callback(null)
}

module.exports = build
