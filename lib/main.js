var fs = require("fs"),
	path = require("path"),
	grunt = require("grunt");


// options

var defaults = {
	store: "./", // with leading slash if a dir
	ratio: "16:9",  // options: 4:3, 16:9
	video: {
		sizes: {

		"16:9": [
			{
				name: "144",
				width: 256,
				height: 144,
				poster: false
			},
			{
				name: "360",
				width: 640,
				height: 360,
				poster: false
			},
			{
				name: "576",
				width: 1024,
				height: 576,
				poster: false
			},
			{
				name: "720",
				width: 1280,
				height: 720,
				poster: false
			},
			{
				name: "1080",
				width: 1920,
				height: 1080,
				poster: false
			}
		],

		"4:3": [
			{
				name: "240",
				width: 320,
				height: 240,
				poster: false
			},
			{
				name: "360",
				width: 480,
				height: 360,
				poster: false
			},
			{
				name: "480",
				width: 640,
				height: 480,
				poster: false
			},
			{
				name: "720",
				width: 960,
				height: 720,
				poster: false
			},
			{
				name: "1080",
				width: 1440,
				height: 1080,
				poster: false
			}
			]
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