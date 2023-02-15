const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

app.get('/index', (req, res) => {
    data = ["07-12-2022_sample","03-02-2023_fr.openfoodfacts.org.products.csv","09-02-2023_sample"]
    res.send(data)
})

app.post('/field', (req, res)  => {
    data = ["additives","additives_fr","vitamin-c_100g"]
    res.send(data)
})

app.post('/aggregation', (req, res)  => {
    data = [{"key":"Unfi","doc_count":43},{"key":"Sunridge","doc_count":17},
    {"key":"Pcc","doc_count":16},{"key":"Grizzlies","doc_count":9},
    {"key":"Lundberg","doc_count":8}]
    res.send(data)
})


app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
})