var Artycles = require("../../index"), // Artycles = require("artycles")
	fs = require("fs"),
	os = require("os"),
	request = require("request");

// this example gets a remote image file and encodes it to standard resolutions

// Initialize lib
var artycles = new Artycles({
	path: __dirname +"/output/",
	source: {
		remove: true// remove downloaded file
	}
});

// using remote file for our example...
var file = os.tmpDir() +"/image.png";
// get the file
request
	.get("http://itsabeautifulearth.files.wordpress.com/2013/03/earth-from-iss-3.png")
	.pipe(fs.createWriteStream( file ))
	.on('finish', function () {
		// start the example ;)
		init();
	});


// Main logic
function init (){
	artycles.image( file, completed );
}

function completed( files ){
	//
	console.log("image compiled", files)
}