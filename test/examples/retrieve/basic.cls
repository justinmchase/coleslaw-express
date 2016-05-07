model example {
    field id eid: number
}

app.use(coleslawExpress.generate(options, example))

request(app)
    .get('/example/1')
    .expect(200)
    .end(function (err, res) {
        if (err) throw err;
        done()
    })
