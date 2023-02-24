const express = require('express')
const app = express()
const port = 3000

// Import the cors middleware
const cors = require('cors');

// Allow cross-origin requests from all domains
app.use(cors({
  origin: '*'
}));

// Handle GET requests to the '/index' endpoint
app.get('/index', (req, res) => {
  // Return an array of sample data
  data = ["07-12-2022_sample", "03-02-2023_fr.openfoodfacts.org.products.csv", "09-02-2023_sample"]
  res.send(data)
})

// Handle POST requests to the '/field' endpoint
app.post('/field', (req, res) => {
  // Return an array of sample field names
  data = ["additives", "additives_fr", "vitamin-c_100g"]
  res.send(data)
})

// Handle POST requests to the '/aggregation' endpoint
app.post('/aggregation', (req, res) => {
  // Return an array of sample aggregation data
  data = [{"key":"Unfi","doc_count":43},{"key":"Sunridge","doc_count":17},
  {"key":"Pcc","doc_count":16},{"key":"Grizzlies","doc_count":9},
  {"key":"Lundberg","doc_count":8}]
  res.send(data)
})

app.post('/quality', (req, res) => {
    res.send("80")
})



// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`)
})
