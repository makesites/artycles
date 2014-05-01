var fs = require("fs"),
	path = require("path");


// options

var defaults = {
	store: "./", // with leading slash if a dir
	media: {
		mp4: {
		}
	}
}

// Constructor

var Artycles = function( options ){
	this.options = Object.extend( defaults, options );

}

// Methods

Artycles.prototype = {

	video: function( file ){
		var name = path.basename( file );
		// copy file to store (without encoding)
		fs.createReadStream( file ).pipe(fs.createWriteStream( this.options.store + name ));
	}
}

// Helpers

Object.extend = function(destination, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor && source[property].constructor === Object) {
			destination[property] = destination[property] || {};
			arguments.callee(destination[property], source[property]);
		} else {
			destination[property] = source[property];
		}
	}
	return destination;
};


module.exports = Artycles;