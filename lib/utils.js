
var crypto = require("crypto"),
	fs = require("fs"),
	os = require("os");

// Helpers
var utils = {

	extend: function(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	},

	// creates a unique temp dir
	tmpDir: function(){
		var tmp = os.tmpDir();
		var folder = "artycles_"+ crypto.randomBytes(4).readUInt32LE(0); // random folder name
		var dir = tmp +"/"+ folder;
		fs.mkdirSync( dir );
		return dir;
	}

}

module.exports = utils;