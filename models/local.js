/**
 * Artycles - Local Store
 * - Saving media locally
**/

var fs = require("fs"),
	path = require("path");

// constructor
var Model = function( options ){

	// no store is expected for this model
	//this.store = options.store;
	// save other options
	//delete options.store;
	this.options = options;

}

Model.prototype = {

	constructor: Model,

	create: function( data, callback ){
		// support loop of multiple files?
		fs.createReadStream( data.source ).pipe( fs.createWriteStream( data.destination ) )
		.on("finish", function(){
			// error control?
			callback(true);
		});
	},

	read: function( file, callback ){
		var source = this.options.path + file;
		return fs.createReadStream( source ).pipe();
	},

	update: function( query, callback ){
		// tba
	},

	destroy: function( item, callback ){
		// tba
	}

}


module.exports = Model;