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
        options.dataAccess[model.name].create(data, (err, result) => {
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