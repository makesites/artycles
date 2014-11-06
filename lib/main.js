var async = require("async"),
	defaults = require("./options"),
	CRUD = require("./crud"),
	fs = require("fs"),
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

	video: video,

	// events
	onCompileComplete: function( data, callback ){
		// fallabcks
		data = data || {};
		//
		var self = this;
		//read all files in the folder...
		// use synchronous method?
		fs.readdir(data.dir, function(err, files){
			// error control...
			//if( err )
			files = ( files instanceof Array ) ? files : [];

			async.each(files, function( file, next) {
				// skip original file
				if( file == data.name+data.ext && !self.options.source.copy ) return next();

				var options = {
					source: data.dir+file,
					destination: self.options.path + self.options.files.prefix + file //path.basename( file );
				};
				// group resolutions
				if( file !== data.name+data.ext && self.options.files.group ){
					options.destination = self.options.path + data.name +"/"+ self.options.files.prefix + file.replace(data.name+"-", "");
				}
				// copy file to store
				self.store.create( options, function(){
					// error control?
					next();
				});

			}, function(err){
					// if any of the file processing produced an error, err would equal that error
					if( err ) {
						// One of the iterations produced an error.
						// All processing will now stop.
						console.log('A file failed to process');
					} else {
						// remove tmp dir (wait?)
						utils.rmdir(data.dir);
						// optionally remove source file
						if( self.options.source.remove ){
							fs.unlinkSync(data.source);
						}
						// execute original callback
						callback( files );
					}
			});

		});

	}

}


module.exports = Artycles;