/**
 * Artycles - S3 Store
 * - Saving media in a remote S3 bucket
**/

var s3 = require("s3");

var Model = function( options ){

	// use the provided store (error control?)
	//this.store = options.store;
	// save other options
	//delete options.store;
	this.options = options;

	var config = this.options.store;
	this.store = s3.createClient({
		//multipartUploadThreshold: 20971520, // this is the default (20 MB)
		//multipartUploadSize: 15728640, // this is the default (15 MB)
		s3Options: {
			accessKeyId: config.key,
			secretAccessKey: config.secret,
			region: config.region
			//secure: false,
		}
	});
}


Model.prototype = {

	constructor: Model,

	create: function( data, callback ){
		// create request options
		var options = {};

		var params = {
			localFile: data.source,
			s3Params: {
				Bucket: this.options.store.bucket,
				Key: data.destination,
				ACL: this.options.store.acl || 'private'
				//ACL: 'private | public-read | public-read-write | authenticated-read | bucket-owner-read | bucket-owner-full-control',
				// other options supported by putObject, except Body and ContentLength.
				// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
			},
		};
		// use generic permissions
		if( this.options.permissions == "public" ){
		//if( this.options.store.acl == "public" ){
			options['ACL'] = 'public-read';
			// options: 'private | public-read | public-read-write | authenticated-read | bucket-owner-read | bucket-owner-full-control',
		}

		// upload a file to s3
		var uploader = this.store.uploadFile( params );
		// events
		uploader.on('error', function(err) {
			console.error("unable to upload:", err.stack);
		});
		uploader.on('progress', function() {
			//console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
		});
		uploader.on('end', function() {
			// error control?
			callback( true );
		});
	},

	read: function( query, callback ){
		var key = query.access_token || query.code || false;
		if( !key ) return callback(null, false);
		// connect to store
		this.store.get( key, function(err, data){
			if(err) return callback(err);
			// parse data into an object
			data = JSON.parse( data.toString() );
			callback( null, data );
		});
	},

	destroy: function( item, callback ){
		var key = query.access_token || query.code || false;
		if( !key ) return callback(null, false);
		// connect to store
		this.store.del( key, function(err, data){
			if(err) return callback(err);
			callback( null, true );
		});
	}

}


module.exports = Model;