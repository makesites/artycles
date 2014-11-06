var async = require("async"),
	fs = require("fs"),
	path = require("path"),
	defaults = require("./options"),
	os = require("os"),
	utils = require("./utils");

//

var Image = function( options ){

	this.options = options;

};

Image.prototype = {

	compile: function(source, callback) {

		var self = this;
		// gather data
		var data = {
			source: source,
			name: utils.filename(),
			dir: utils.tmpDir(),
			ext: path.extname( source )
		}
		var ratio = this.options.ratio || "auto"; // dynamically read media dimensions instead?
		var sizes = this.options.image.sizes[ratio];
		var original = data.dir + data.name + data.ext;
		// copy original file to temp dir
		fs.createReadStream( source ).pipe(fs.createWriteStream( original ))
		.on("finish", function(){
			// start grunt
			var options = {
				gruntfile : path.normalize( __dirname+'/../gruntfile.js'),
				responsive_images: {
					encode:{
						options: {
							sizes: sizes,
							engine: "im" // using ImageMagick by default...
						},
						files: [{
							//expand: true,
							src: [ original ],
							cwd: data.dir,
							dest: original // destination path is used to get the file extension, why?
						}]
					}
				}
			};

			// new instance of grunt...
			var grunt = require("grunt");

			grunt.initConfig( options );

			// execute tasks...
			grunt.tasks(["responsive_images"], options, function(){
				//console.log("Grunt.js Tasks Completed!");
				self.onCompileComplete( data, callback );
			});

		});


	},

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
					destination: self.options.path + file //path.basename( file );
				};
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
						// remove tmp dir
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


module.exports = function( file, callback ){
	var options = this.options;
	// new instance of the video class
	var image = new Image( options );
	// mirror store
	image.store = this.store;
	image.compile( file, callback );
};