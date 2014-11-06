/**
 * CRUD operations
 * - connecting lib with persistent storage
**/

var CRUD = function( options ){

	// pick the right store based on the options
	var Model = require("../models/"+ options.model );
	this.model = new Model( options );

}

CRUD.prototype = {

	constructor: CRUD,

	create: function( data, callback ){
		// fallbacks
		callback = callback || function(){};
		//
		this.model.create( data, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	},

	read: function( data, callback ){
		// fallbacks
		callback = callback || function(){};
		//
		this.model.read( data, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	},

	update: function( data, callback ){
		// fallbacks
		callback = callback || function(){};
		//
		this.model.destroy( data, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	},

	destroy: function( data, callback ){
		// fallbacks
		callback = callback || function(){};
		//
		this.model.destroy( data, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	}
}

/*
// Helpers
var Model = function( token ){


	return {
		token: token,
		expires: (new Date()).getTime() +
	}
}


	// resets the store api for a custom store
	setCustomStore: function( db ){
		this.store = db;
	},
*/


module.exports = CRUD;
