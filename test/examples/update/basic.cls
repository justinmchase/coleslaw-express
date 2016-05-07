model example {
}

app.use(coleslawExpress.generate(options, example))

request(app)
    .put('/example')
    .expect(200)
    .end(function (err, res) {
        if (err) throw err;
        done()
    })
