const path = require('path');
const express = require('express');
const app = express();
var enforce = require('express-sslify');
app.use(enforce.HTTPS({ trustProtoHeader: true }))

// Serve static files
app.use(express.static(__dirname + '/dist'));

console.log('server called!!')

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// default Heroku port
app.listen(process.env.PORT || 5000);