var defaults = require("./options"),
	CRUD = require("./crud"),
	image = require("./image"),
	video = require("./video"),
	utils = require("./utils");

// Constructor

var Artycles = function( options ){
	// extending default options
	options = options || {};
	this.options = utils.extend( defaults, options );
	// init crud
	this.store = new CRUD( this.options );
}

// Methods

Artycles.prototype = {

	constructor: Artycles,

	// API

	image: image,

	video: video

}


module.exports = Artycles;