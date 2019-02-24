var mongoose = require('mongoose');
mongoose.connect('mongodb://94.237.73.149:27017/jiazua',{useNewUrlParser: true});
var conn = mongoose.connection;
var path = require('path');
var fs = require('fs');

conn.once('open',function(){
	console.log('connection opened');
	var audioGFSName = '6384806c3d3905621c51cd358b23bf86.wav'
	var outputPath = "./6384806c3d3905621c51cd358b23bf86.wav";
	var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{bucketName:'audiofiles'});


	//FIND FILE BY filename
	
	var downloadStream = gfsBucket.openDownloadStreamByName(audioGFSName);
	var outputStream = fs.createWriteStream(outputPath);

	downloadStream.pipe(outputStream)
	.on('finish',function(){
		console.log(outputPath + " successfully written")
		conn.close();
		console.log('connection closed');
	});
	
	

	//FIND FILE BY OTHER MEANS
	/*
	var filter = {"_id" : new mongoose.mongo.ObjectId("5c6f6804e55da2957ec16c25")}
	var options = {limit:1}
	var downloadStream = gfsBucket.find(filter,options)

	var outputStream = fs.createWriteStream(outputPath);

	let retrieved_filename;
	downloadStream.toArray(function(err,files){
			retrieved_filename = files[0].filename;
			var downloadStream = gfsBucket.openDownloadStreamByName(retrieved_filename);
			var outputStream = fs.createWriteStream(outputPath);

			downloadStream.pipe(outputStream)
			.on('finish',function(){
				console.log(outputPath + " successfully written")
				conn.close();
				console.log('connection closed');
			});
		})

	*/
	
});