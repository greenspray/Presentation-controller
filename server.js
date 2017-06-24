var robot = require("kbm-robot");

var express  = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;



var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'admin' && user.pass === 'SABIN') {
    return next();
  } else {
    return unauthorized(res);
  };
};


robot.startJar();

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
          robot.press(actionString)
	       .sleep(20)
	       .release(actionString)
	       .go()
       
	});
  
 socket.on('disconnect', function() {
	robot.stopJar();
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
