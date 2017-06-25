
var config  = require('./config');

var robot = require("robotjs");
var express  = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var sha1 = require('sha1');
var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === config.username  && sha1(user.pass) === config.password) {
    return next();
  } else {
    return unauthorized(res);
  };
};


app.get('/', auth, function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', function(socket){
  
  socket.on('selectedAction', function(data){
	actionString = ""
	switch(data){
	  case 'f':
	  case 'F':
  	   
	   actionString = "right"
           break;
	  case 'b':
	  case 'B':
	   actionString = "left"
	  break;
	}
	if(actionString != "")
            robot.keyTap(actionString)

	});
  
 socket.on('disconnect', function() {
           
	});
    
  });

http.listen(port,  function(){
    var address,
    ifaces = require('os').networkInterfaces();
    for (var dev in ifaces) {
    ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
    }
    console.log('Follow  http://%s:%s to start presentation control', address, port);
});

process.stdin.resume();

process.on('SIGINT', function () {
  console.log('Cleaning up');
  process.exit();
;
});
