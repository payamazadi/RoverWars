var point = require('./point');
var util = require('util');

function Rover(name, orientation, grid){
    this.name = name;
    this.orientation = orientation;
    this.grid = grid;
    this.callbacks = [];
    this.socket = null;
}

Rover.prototype.turnLeft = function(){
    this.orientation.angle = (this.orientation.angle - 90)%360;
    this.correct();
}

Rover.prototype.turnRight = function(){
    this.orientation.angle = (this.orientation.angle + 90)%360;
    this.correct();
}

Rover.prototype.correct = function(){
    if(this.orientation.angle < 0) this.orientation.angle += 360
}

Rover.prototype.move = function(){
    var proposedPoint = this.orientation.getMovePoint();
    var existingPoint = this.orientation.point;
    
    //check that we have at least one valid validator registered
    if(!this.callbacks["validate"] || this.callbacks["validate"].length == 0){
        this.callbacks["move"].forEach(function(entry){entry("failure - no validation handler", proposedPoint);});
        return false;
    }
    //check each validation (can have multiple)
    var valid = true;
    this.callbacks["validate"].forEach(function(entry){
        if(!entry(proposedPoint))
            valid = false;
    })
    
    //fail if validation fails
    if(!valid){
        this.callbacks["move"].forEach(function(entry){entry("Failure to validate", proposedPoint)});
        return false;
    }
    
    //succeed
    this.orientation.point = proposedPoint;
    this.callbacks["move"].forEach(function(entry){entry(null, proposedPoint);});
    
    if(this.grid.grid[proposedPoint.x][proposedPoint.y]){
        this.grid.grid[proposedPoint.x][proposedPoint.y].socket.emit('placement', 'OWNED');
        this.grid.grid[proposedPoint.x][proposedPoint.y].socket = null;
    }
    this.grid.grid[existingPoint.x][existingPoint.y] = undefined;
    this.grid.grid[proposedPoint.x][proposedPoint.y] = this;
    
    var that = this;
    this.callbacks["gridCallback"].forEach(function(entry){entry.call(that, null, proposedPoint);});
    
    
    return true;
}



Rover.prototype.register = function(handle, callback){
    if(!this.callbacks[handle])
        this.callbacks[handle] = Array();
    this.callbacks[handle].push(callback);
}

Rover.prototype.toString = function(){
    return util.format("Rover (Name: %s, %s)", this.name, this.orientation);
}

exports.Rover = Rover;