var fs = require("fs"),
	path = require("path"),
	grunt = require("grunt"),
	defaults = require("./options"),
	utils = require("./utils");

// Constructor

var Artycles = function( options ){
	this.options = utils.extend( defaults, options );

}

// Methods

Artycles.prototype = {

	video: function( file ){
		var name = path.basename( file );
		var ratio = this.options.ratio || "16:9"; // dynamically read media dimensions instead?
		// copy file to store (without encoding)
		fs.createReadStream( file ).pipe(fs.createWriteStream( this.options.store + name ));
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
						cwd: this.options.store,
						dest: this.options.store
					}]
				}
			}
		};

		grunt.initConfig( options );

		//grunt.loadTasks( path.normalize( __dirname+'/../tasks') );

		// execute tasks...
		grunt.tasks(["responsive_videos"], options, function(){
			console.log("Grunt.js Tasks Completed!");
		});
	}
}




module.exports = Artycles;