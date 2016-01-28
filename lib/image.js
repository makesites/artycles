var fs = require("fs"),
	path = require("path"),
	sizeOf = require('image-size'),
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
			name: this.options.name || utils.filename( this.options.files ),
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
							engine: "im", // using ImageMagick by default...
							createNoScaledImage: true, // never create scaled up image (flag set wrong?)
							gaussianBlur: 0.05,
                                                        quality: 60
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

	},

	ratio: function( file ){
		// get image dimensions
		var dimensions = sizeOf( file );
		var ratio = dimensions.width / dimensions.height;
		// find a standard ratio
		if( ratio == 16/9 ) return "16:9";
		if( ratio == 4/3 ) return "4:3";
		// fallback?
		return false;
	}

}


module.exports = function( file, callback ){
	var options = this.options;
	var self = this;
	// new instance of the video class
	var image = new Image( options );
	// get (auto-set) ratio
	var ratio = image.ratio( file );
	if( ratio ) image.options.ratio = ratio;
	image.compile( file, function( data ){
		// back to the main lib to store the files...
		self.onCompileComplete( data, callback );
	});
};
