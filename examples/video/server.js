var Artycles = require("../../index"), // Artycles = require("artycles")
	fs = require("fs"),
	os = require("os"),
	request = require("request");

// this example gets a remote video file and encodes it to standard resolutions

// Initialize lib
var artycles = new Artycles({
	path: __dirname +"/output/",
	source: {
		remove: true// remove downloaded file
	}
});

// using remote file for our example...
var file = os.tmpDir() +"/video.mp4";
// get the file
request
	.get("https://archive.org/download/EarthIlluminated-web/Earth_Illuminated-1280.mp4")
	.pipe(fs.createWriteStream( file ))
	.on('finish', function () {
		// start the example ;)
		init();
	});


// Main logic
function init (){
	artycles.video( file, completed );
}

function completed( files ){
	//
	console.log("video compiled", files)
}