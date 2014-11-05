
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
		return dir+"/"; //add ending slash
	},

	// filename based on time
	filename: function(){
		var name = "";
		var d = new Date();
		// add the date
		name += d.getFullYear() +""+ dd(d.getMonth()+1) +""+ dd(d.getDate());
		// add the time
		name += "-"+ dd(d.getHours()) +""+ dd(d.getMinutes()) +""+ dd(d.getSeconds()) +""+ d.getMilliseconds();
		// add a random hex number (6 digits)
		name += "-"+ crypto.randomBytes(Math.ceil(6/2)).toString('hex').slice(0,6);
		//
		return name;
	}

}

// helpers

// double digits
function dd( num ){
	return ("0" + num).slice(-2);
}


module.exports = utils;