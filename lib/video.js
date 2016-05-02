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
			name: this.options.name || utils.filename( this.options.files ),
			dir: utils.tmpDir(),
			ext: path.extname( source )
		}
		var ratio = this.options.ratio || "auto"; // dynamically read media dimensions instead?
		var sizes = this.options.video.sizes[ratio] || this.options.video.sizes['auto'];
		// never upscale a video (option?)
		sizes = this._noUpscale( sizes );
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
							sizes: sizes,

							encodes: [{
								mp4: [
									{'-vcodec': 'libx264'},
									//{'-acodec': 'libfaac'},
									{'-acodec': 'aac'},
									{'-strict': '-2'},
									//{'-b:v': '1200k'},
									{'-b:v': '1M'},
									{'-b:a': '192k'},
									{'-crf': '22.5'},
									{'-movflags': 'faststart'},
									{'-threads': '0'}
								],
		  						webm: [
									{'-vcodec': 'libvpx'},
									{'-acodec': 'libvorbis'},
									{'-b:v': '1M'},
									{'-q:a': '100'},
									{'-crf': '22.5'},
									{'-movflags': 'faststart'},
									{'-threads': '0'}
		  						],
								ogv: [
									{'-vcodec': 'libtheora'},
									{'-acodec': 'libvorbis'},
									//{'-b:v': '500k'},
									{'-b:v': '1M'},
									{'-q:a': '100'},
									{'-crf': '22.5'},
									{'-quality': 'good'},
									{'-cpu-used': '0'},
									{'-qmax': '42'},
									{'-maxrate': '500k'},
									{'-bufsize': '1000k'},
									{'-movflags': 'faststart'},
									{'-threads': '0'}
		  						]
							}]
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
		var self = this;

		ffmpeg.ffprobe(file, function(err, metadata) {
			if (err) {
				console.error(err);
				// fallback?
				callback({});
			} else {
				// metadata should contain 'width', 'height' and 'display_aspect_ratio'
				// save for future access
				self.metadata = metadata;
				callback(metadata);
			}
		});
	},

	// Internal
	_noUpscale: function( sizes ){
		var metadata = this.metadata.streams[0];
		var filtered = [];
		// loop through selected sizes
		for(var i in sizes){
			if( metadata.width < sizes[i].width || metadata.height < sizes[i].height ) continue;
			filtered.push( sizes[i] );
		}
		console.log(sizes, filtered);
		return filtered;
	}


}

// Hidden
function aspectRatio( metadata ){
	var ratio = metadata.display_aspect_ratio;
	// FIX: for no valid aspect ratio
	if( ratio == "0:1" ){
		if( metadata.width/metadata.height == 16/9 ) ratio = "16:9";
		if( metadata.width/metadata.height == 4/3 ) ratio = "4:3";
	}
	return ratio;
}

module.exports = function( file, callback ){
	var options = this.options;
	var self = this;
	// new instance of the video class
	var video = new Video( options );
	// get info
	video.info( file, function( info ){
		// set aspect ratio
		if( info.streams ) video.options.ratio = aspectRatio( info.streams[0] );
		// encode sizes
		video.compile( file, function( data ){
			// back to the main lib to store the files...
			self.onCompileComplete( data, callback );
		});
	});
};
