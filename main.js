var Point = require('./point').Point;
var Rover = require('./rover').Rover;
var Orientation = require('./point').Orientation;
var Grid = require('./point').Grid;

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(process.env.PORT);

var g1 = new Grid(5,5);
var rovers = [];

function gridRegistrationCallback(err, data){
    if(err){
        console.log("Failed to place " + data);
        
        var randX = Math.floor(Math.random() * 20);
        data.orientation.point = new Point(randX, randX);
        g1.registerObject(data.orientation.point, data, gridRegistrationCallback);
        return;
    }
    console.log("Succeeded in placing - " + data);
}


function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    //res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
    var socketId = socket.id;
    var randX = Math.floor(Math.random() * 5);
    var randY = Math.floor(Math.random() * 5);
    
    rovers[socketId] = new Rover(socketId, new Orientation(0, new Point(randX,randY)), g1);
    var currentRover = rovers[socketId];
    currentRover.socket = socket;
    
    g1.registerObject(currentRover.orientation.point, currentRover, gridRegistrationCallback);
    currentRover.register('validate', pointValidator);
    currentRover.register('move', moveCallback);
    currentRover.register('gridCallback', gridCallback);
    
    socket.emit('placement', 'your rover is now at ' + currentRover.orientation.point.x + ',' + currentRover.orientation.point.y );
    
    socket.on('move', function (data) {
        if(currentRover.socket == null){
            socket.emit('placement', 'OWNED refresh the page.');
            return;
        }
        if(!currentRover.move())
            socket.emit('move', "Failed to move");
        else
            socket.emit('move', "Moved to " + currentRover.orientation.point + " facing" + currentRover.orientation.angle);
    });
    
    socket.on('left', function (data) {
        if(currentRover.socket == null){
            socket.emit('placement', 'OWNED refresh the page.');
            return;
        }
        currentRover.turnLeft();
        socket.emit('turn', "Facing " + currentRover.orientation.angle + " at " + currentRover.orientation.point);
    });
    
    socket.on('right', function (data){
        if(currentRover.socket == null){
            socket.emit('placement', 'OWNED refresh the page.');
            return;
        }
       currentRover.turnRight();
       socket.emit('turn', "Facing " + rovers[socketId].orientation.angle + " at " + currentRover.orientation.point);
    });
});


function gridCallback(err, data){
    if(err){
        console.log("Failed to place!");
        return false;
    }
    
    console.log("Placed " + this.socket.id);
}

function pointValidator(point){
    if(point.x < g1.maxX && point.y < g1.maxY && point.x >= 0 && point.y >= 0)
        return true;
    return false;
}

function moveCallback(err, data){
    if(err){
        console.log("Error with " + data);
        return false;
    }
    console.log("Successfully moved to " + data);
    return true;
}
