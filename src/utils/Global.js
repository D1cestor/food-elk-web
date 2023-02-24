// Set the mode to "f"
const mode = 'f'

// Initialize the file source and query source variables
let fileSrc = ''
let querySrc = ''

// Check the value of the mode variable
if (mode == 'f') // If the mode is "f", use local file and query sources
{
  //Testing mode, this will listen a local js simple app
  fileSrc = 'http://127.0.0.1:3000' // Set the file source to localhost port 3000
  querySrc = 'http://127.0.0.1:3000' // Set the query source to localhost port 3000
}
else // If the mode is not "f", use remote file and query sources
{
  fileSrc = 'http://127.0.0.1:10000' // Set the file source to localhost port 10000
  querySrc = 'http://127.0.0.1:8080' // Set the query source to localhost port 8080
}

// Export the file and query sources
export default {
  fileSrc,
  querySrc
}
