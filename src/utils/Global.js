const mode = 'f'




let fileSrc = ''
let querySrc = ''
if (mode == 'f')
{
  fileSrc = 'http://127.0.0.1:3000'
  querySrc = 'http://127.0.0.1:3000'
}
else 
{
  fileSrc = 'http://127.0.0.1:10000'
  querySrc = 'http://127.0.0.1:8080'
}


export default
  {
    fileSrc,
    querySrc
  }