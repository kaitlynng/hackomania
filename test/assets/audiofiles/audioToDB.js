var mongoose = require('mongoose');
mongoose.connect('mongodb://94.237.73.149:27017/jiazua',{useNewUrlParser: true});
var conn = mongoose.connection;
var path = require('path');
var crypto = require('crypto');


var audioPath = path.join(__dirname,'audio_1.mp3');
var audioGFSName = 'audio_1.mp3';

var fs = require('fs');

function gfsFileName(file) {
	var buf = crypto.randomBytes(16)
	var fileName = buf.toString('hex') + path.extname(file);
	return fileName;
}


conn.once('open',function (){
	console.log('connection established');

	var gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName:'audiofiles'});
	var writeStream = gfsBucket.openUploadStream(gfsFileName(audioGFSName),{
		metadata:{
			original_audio: audioGFSName,
			transcribe_count: 0
		}
	});
	fs.createReadStream(audioPath).pipe(writeStream);

	
	writeStream.on('finish',function(file){
		console.log( file.filename + ' Written to DB');
		conn.close()
		console.log('connection closed');
	});
	
	
});


