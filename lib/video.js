var fs = require("fs"),
	path = require("path"),
	grunt = require("grunt"),
	defaults = require("./options"),
	os = require("os"),
	utils = require("./utils");
//

var Video = function( options ){

	this.options = options;

};

Video.prototype = {

	compile: function(destination, source) {

		var self = this;
		var name = path.basename( file );
		var ratio = this.options.ratio || "16:9"; // dynamically read media dimensions instead?
		var dir = os.tmpDir();
		console.log( dir );
		// copy file to store (without encoding)
		fs.createReadStream( file ).pipe(fs.createWriteStream( dir + name ));
		// start grunt
		console.log( this.options.video.sizes[ratio] );
		var options = {
			gruntfile : path.normalize( __dirname+'/../gruntfile.js'),
			responsive_videos: {
				encode:{
					options: {
						sizes: this.options.video.sizes[ratio],
					},
					files: [{
						//expand: true,
						src: [ this.options.store + name ], //'store/**.{mov,mp4}'
						cwd: dir,
						dest: dir
					}]
				}
			}
		};

		grunt.initConfig( options );

		//grunt.loadTasks( path.normalize( __dirname+'/../tasks') );

		// execute tasks...
		grunt.tasks(["responsive_videos"], options, function(){
			//console.log("Grunt.js Tasks Completed!");
			self.onVideoComplete();
		});

	},

	// events
	onVideoComplete: function(){
		//
				// variables
		var type = this.next.type;
		var id = this.next.id;
		var file = this.config.filename
		var source = this.file.path;
		// sum up to the destination:
		var dest = this.options.path +"/"+ id +"/"+ file;

	}


}


module.exports = function( file, callback ){
	var options = this.options;
	// new instance of the video class
	var video = new Video( options );
	video.compile( file, callback );
};