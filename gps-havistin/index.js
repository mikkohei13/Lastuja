const express = require('express')
const app = express()
const gpx2laji = require('./gpx2laji')

app.get('/', function response(req, res) {
    let parsed = gpx2laji.parser()
    res.send(parsed)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
