var assert = require("assert");
var expect = require('chai').expect;

var Orientation = require('../point').Orientation;
var Point = require('../point').Point;
var Rover = require('../rover').Rover;

describe('Orientation', function(){
    it('should return directional points correctly', function(){
        var o1 = new Orientation(0, new Point(5,5));
        o1.point = o1.getMovePoint();
        expect(o1.point).to.have.property('x', 5);
        expect(o1.point).to.have.property('y', 6);
        
        o1.angle = 90;
        o1.point = o1.getMovePoint();
        expect(o1.point).to.have.property('x', 6);
        expect(o1.point).to.have.property('y', 6);
        
        o1.angle = 180;
        o1.point = o1.getMovePoint();
        expect(o1.point).to.have.property('x', 6);
        expect(o1.point).to.have.property('y', 5);
        
        o1.angle = 270;
        o1.point = o1.getMovePoint();
        expect(o1.point).to.have.property('x', 5);
        expect(o1.point).to.have.property('y', 5);
    });
})

describe('Rover', function(){
    var r1 = new Rover("R1", new Orientation(0, new Point(5,5)));
    r1.register("validate", pointValidator);
    r1.register("move", moveCallback);
    it('should turn left and right with positive angles', function(){
        r1.turnLeft();
        expect(r1.orientation.angle).equal(270);
        
        r1.turnRight();
        expect(r1.orientation.angle).equal(0);
        
        r1.orientation.angle = -270;
        r1.turnLeft();
        expect(r1.orientation.angle).equal(0);
    });
    
    it('should always stay in bounds', function(){
        r1.move();
        r1.move();
        r1.move();
        r1.move();
        expect(r1.orientation.point.y).equal(8);
    });
    
    
})


function pointValidator(point){
    if(point.x <= 8 && point.y <= 8)
        return true;
    return false;
}

function moveCallback(err, data){
    if(err)
        return console.log("Error with " + data);
    console.log("Successfully moved to " + data);
}