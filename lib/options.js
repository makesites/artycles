var options = {
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

module.exports = options;