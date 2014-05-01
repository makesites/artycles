var fs = require("fs"),
	path = require("path"),
	grunt = require("grunt");


// options

var defaults = {
	store: "./", // with leading slash if a dir
	media: {
		mp4: {
		}
	}
}

// Constructor

var Artycles = function( options ){
	this.options = Object.extend( defaults, options );

}

// Methods

Artycles.prototype = {

	video: function( file ){
		var name = path.basename( file );
		// copy file to store (without encoding)
		fs.createReadStream( file ).pipe(fs.createWriteStream( this.options.store + name ));
		// start grunt
		console.log(this.options.store + name);
		var options = {
			gruntfile : path.normalize( __dirname+'/../gruntfile.js'),
			responsive_videos: {
				encode:{
					options: {
						sizes: [{
							width: 640,
							poster: true
						},{
							width: 320,
							poster: true
						}],
					},
					files: [{
						//expand: true,
						src: [ this.options.store + name ], //'store/**.{mov,mp4}'
						cwd: this.options.store,
						dest: this.options.store
					}]
				}
			},
		};

		grunt.initConfig( options );

		//grunt.loadTasks( path.normalize( __dirname+'/../tasks') );

		// execute tasks...
		grunt.tasks(["responsive_videos"], options, function(){
			console.log("Grunt.js Tasks Completed!");
		});
	}
}

// Helpers

Object.extend = function(destination, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor && source[property].constructor === Object) {
			destination[property] = destination[property] || {};
			arguments.callee(destination[property], source[property]);
		} else {
			destination[property] = source[property];
		}
	}
	return destination;
};


module.exports = Artycles;