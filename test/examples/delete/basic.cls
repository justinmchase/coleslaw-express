model example {
}

app.use(coleslawExpress.generate(options, example))

request(app)
    .delete('/example')
    .expect(200)
    .end(function (err, res) {
        if (err) throw err;
        done()
    })
