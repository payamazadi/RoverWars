var util = require('util');

function Point(x, y){
	this.x = x;
	this.y= y;
}

Point.prototype.toString = function(){
	return util.format("Point: (%d,%d)", this.x, this.y)
}

var Angles = {
	"NORTH": 0,
	"EAST": 90,
	"SOUTH": 180,
	"WEST": 270
}

function Orientation(angle, point){
	this.angle = angle;
	this.point = point;
}

Orientation.prototype.getMovePoint = function(){
	switch(this.angle){
		case 0:
			return new Point(this.point.x, this.point.y + 1);
		case 90:
			return new Point(this.point.x + 1, this.point.y);
		case 180:
			return new Point(this.point.x, this.point.y - 1);
		case 270:
			return new Point(this.point.x - 1, this.point.y);
		default:
			return console.error("Invalid angle in orientation");
	}
};

Orientation.prototype.toString = function(){
	return util.format("Orientation (%s, Angle: %d))", this.point.toString(), this.angle)
}

function Grid(maxX, maxY){
	this.maxX = maxX;
	this.maxY = maxY;
	
	this.grid = Array(this.maxX);
	for(var i=0; i<this.grid.length; i++)
		this.grid[i] = new Array(this.maxY);
}

Grid.prototype.registerObject = function(point, data, callback){
	if(!(point.x < this.maxX && point.x >= 0 && point.y < this.maxY && point.y >= 0))
		return callback("Failed to place " + point, data);
	this.grid[point.x][point.y] = data;
	callback(null, data);
}



exports.Point = Point;
exports.Orientation = Orientation;
exports.Angles = Angles;
exports.Grid = Grid;
