var defaults = require("./options"),
	image = require("./image"),
	video = require("./video"),
	utils = require("./utils");

// Constructor

var Artycles = function( options ){
	this.options = utils.extend( defaults, options );

}

// Methods

Artycles.prototype = {

	// API

	image: image,

	video: video

}


module.exports = Artycles;