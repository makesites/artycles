var options = {
	store: false, // used to link the third-party store
	permissions: "owner", // options: "public", "owner" (custom?)
	model: "local",
	path: "/", // save in a specific folder
	ratio: "auto",  // options: auto, 4:3, 16:9
	video: {

		formats: ["mov", "mp4"],

		sizes: {

		"auto": [
			{
				name: "256",
				width: 256,
				poster: false
			},
			{
				name: "1k",
				width: 1024,
				poster: false
			},
			{
				name: "2k",
				width: 2048,
				poster: false
			}
		],

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
	},

	image: {
		formats: ["jpg", "png", "gif"],
		sizes: {
			"auto": [
				{
					name: "4k",
					width: 4096,
				},
				{
					name: "2k",
					width: 2048,
				},
				{
					name: "1k",
					width: 1024,
				},
				{
					name: "512",
					width: 512,
				},
				{
					name: "256",
					width: 256,
				},
				{
					name: "128",
					width: 128,
				},
				{
					name: "64",
					width: 64,
				},
				{
					name: "32",
					width: 32,
				}
			]
		}
	},

	source: {
		copy: true,  // copies source file in output folder
		remove: false // delete source file after compression
	},

	files: {
		group: false, // if set to true, places all encoded files in a folder
		prefix: "", // a prefix fo all files created
	}

}

module.exports = options;