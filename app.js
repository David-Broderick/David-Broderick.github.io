const http = require('http')
const https = require('https')
const fs = require('fs')

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/idahodatafoundation.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/idahodatafoundation.org/cert.pem')
}

var files = { 'index':'' }
var refresh = () => { for (var filename in files) { files[filename] = fs.readFileSync(filename) } }
refresh()

http.createServer((req, res) => {
  res.writeHead(302, {
    'Location': 'https://' + req.headers.host,
    'Strict-Transport-Security':' max-age=31536000; includeSubDomains; preload'
  })
  res.end()
}).listen(80)

https.createServer(options, (req, res) => {
console.log('>>'+req.url)
  if (req.method == 'POST') {
    let payload = ''
    req.on('data', data => { payload += data })
    req.on('end', () => { 
        res.end(payload) 
    })
  } else {
    var args = ''
    var cmd = req.url
    if (cmd == '/') cmd = 'index'; else cmd = cmd.substr(1)
    if (cmd.indexOf('?')>0) { cmd = cmd.substr(0, cmd.indexOf('?')); args = req.url.substr(req.url.indexOf('?')+1); }
    if (cmd == 'refresh') { refresh(); cmd = 'index' }
    if (cmd.length > 1 && files[cmd]) {
      res.writeHead(200)
      res.end(files[cmd])
    } else {
      var path = cmd
      if (fs.existsSync(path)) {
        files[cmd] = fs.readFileSync(path)
        res.writeHead(200)
        res.end(files[cmd])
      } else res.end()
    }
  }
}).listen(443)
console.log('listening on 443...')

var db = () => {
  userdb.put('name', 'Level', function (err) { if (err) return console.log('Error:', err)
    userdb.get('name', function (err, value) { if (err) return console.log('Error:', err)
      console.log('name=' + value)
    })
  })
}
