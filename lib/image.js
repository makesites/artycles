var fs = require("fs"),
	path = require("path"),
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
				callback( data );
			});

		});

	}

}


module.exports = function( file, callback ){
	var options = this.options;
	var self = this;
	// new instance of the video class
	var image = new Image( options );
	image.compile( file, function( data ){
		// back to the main lib to store the files...
		self.onCompileComplete( data, callback );
	});
};