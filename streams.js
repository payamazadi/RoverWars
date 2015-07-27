/*This is unrelated to the project, just an exerise in using transform streams
This will take input from stdin, upper case all of it, and send to stdout.
*/
var Transform = require("stream").Transform;
var util = require("util");

function ProblemStream () {
    Transform.call(this, { "objectMode": true }); // invoke Transform's constructor
}

util.inherits(ProblemStream, Transform); // inherit Transform

ProblemStream.prototype._transform = function (line, encoding, processed) {
     var newLine = line.toString().toUpperCase();
     this.push(newLine);
     processed();
}

process.stdin.pipe(new ProblemStream()).pipe(process.stdout);