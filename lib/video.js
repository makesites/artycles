var fs = require("fs"),
	path = require("path"),
	defaults = require("./options"),
	ffmpeg = require('fluent-ffmpeg'),
	os = require("os"),
	utils = require("./utils");
//

var Video = function( options ){

	this.options = options;

};

Video.prototype = {

	compile: function(source, callback){

		var self = this;
		// gather data
		var data = {
			source: source,
			name: this.options.name || utils.filename(),
			dir: utils.tmpDir(),
			ext: path.extname( source )
		}
		var ratio = this.options.ratio || "auto"; // dynamically read media dimensions instead?
		var sizes = this.options.video.sizes[ratio] || this.options.video.sizes['auto'];
		var original = data.dir + data.name + data.ext;
		// update poster value if set as a general option
		if( this.options.video.poster ){
			for(var i in sizes){
				sizes[i].poster = true;
			}
		}
		// copy original file to temp dir
		fs.createReadStream( source ).pipe(fs.createWriteStream( original ))
		.on("finish", function(){
			// start grunt
			var options = {
				gruntfile : path.normalize( __dirname+'/../gruntfile.js'),
				responsive_videos: {
					encode:{
						options: {
							sizes: sizes
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
			grunt.tasks(["responsive_videos"], options, function(){
				//console.log("Grunt.js Tasks Completed!");
				callback( data );
			});

		});

	},

	// get video metadata
	info: function( file, callback ){

		ffmpeg.ffprobe(file, function(err, metadata) {
			if (err) {
				console.error(err);
				// fallback?
				callback({});
			} else {
				// metadata should contain 'width', 'height' and 'display_aspect_ratio'
				callback(metadata);
			}
		});
	}


}


module.exports = function( file, callback ){
	var options = this.options;
	var self = this;
	// new instance of the video class
	var video = new Video( options );
	// get info
	video.info( file, function( info ){
		// set aspect ratio
		if( info.streams ) video.options.ratio = info.streams[0].display_aspect_ratio;
		// encode sizes
		video.compile( file, function( data ){
			// back to the main lib to store the files...
			self.onCompileComplete( data, callback );
		});
	});
};
