var fs = require("fs"),
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
		var ratio = this.options.ratio || "auto"; // dynamically read media dimensions instead?
		var sizes = this.options.image.sizes[ratio];
		var name = utils.filename();
		var dir = utils.tmpDir();
		var original = dir + name + path.extname( source );
		// copy file to store (without encoding)
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
							cwd: dir,
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
				self.onCompileComplete( dir, callback );
			});

		});


	},

	// events
	onCompileComplete: function( dir, callback ){
		//read all files in the folder...
		console.log( dir, callback );
		// store each image
		/*
				// variables
		var type = this.next.type;
		var id = this.next.id;
		var file = this.config.filename
		var source = this.file.path;
		// sum up to the destination:
		var dest = this.options.path +"/"+ id +"/"+ file;
		*/

	}


}


module.exports = function( file, callback ){
	var options = this.options;
	// new instance of the video class
	var image = new Image( options );
	image.compile( file, callback );
};