model example {
}

app.use(coleslawExpress.generate(options, example))

request(app)
    .put('/example/create')
    .expect(201)
    .end(function (err, res) {
        if (err) throw err;
        done()
    })
