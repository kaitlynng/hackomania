
var express = require('express');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var crypto = require('crypto');
var path = require('path');
var bodyParser = require('body-Parser');
//var conn = mongoose.createConnection('mongodb://127.0.0.1/gridFS',{useNewUrlParser: true});

mongoose.connect('mongodb://127.0.0.1/gridFS',{useNewUrlParser: true});
var conn = mongoose.connection;

let gfs;


conn.once('open',()=> {

	
	gfs = Grid(conn.db, mongoose.mongo);
	var collection_Name = 'audiofiles';
	gfs.collection(collection_Name);

	//RANDOM FILENAME GENERATOR
	//Needs a file variable (the fileName being uploaded)
	var gfsFileName = (file) => {
		return new Promise((res,rej)=>{
			crypto.randomBytes(16,(err,buf)=>{
				if (err){
					return rej(err);
				}
				var fileName = buf.toString('hex') + path.extname(file);
				var fileInfo = {
					file_name: fileName,
					bucket_name: collection_Name
				}
				res(fileInfo);
			});
		});

	}
	//gfsFileName('test.wav');
	

	
});

//SCHEMA/MODEL STUFF FOR TRANSCRIPTS
var transcriptSchema = new mongoose.Schema({audio_id:'string',transText:'string'});
var transcriptModel = mongoose.model('transcript',transcriptSchema,'transcripts');


var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.route('/transcripts')
//GET ALL TRANSCRIPTS
	.get(function(req,res){
		var conditions = req.query;
		var collection_Name = 'transcripts';
		conn.collection(collection_Name).find(conditions).toArray(function(err,docs){
			if(docs.length){
				res.send(docs);
			} else {
				res.status(404).send("no transcriptions fitting the description " + JSON.stringify(conditions));
			};
		});
	})
//POST TRANSCRIPT(S)
	.post(function(req,res){
		var new_text = req.query.transText;
		var transcriptTest = new transcriptModel({audio_id:'id_placeholder',transText:new_text})
		transcriptTest.save(function(err){
			if (err) return handleError(err);
			transcriptModel.findOne({transText:new_text}).exec(function(err,trans){
				res.send(trans._id);
			});
		});
		
	})

//DELETE TRANSCRIPT(S)
	.delete(function(req,res){
		var conditions = req.query;
		var collection_Name = 'transcripts';
		conn.collection(collection_Name).find(conditions).toArray(function(err,results){
			res.send(results);
			conn.collection(collection_Name).deleteMany(conditions);
		});
	});


//GET SPECIFIC TRANSCRIPT
	/*
	.get('/:mongo_id',function(req,res){
		var collection_Name = 'transcripts';
		conn.collection(collection_Name).findOne(mongoose.Types.ObjectId(req.params.mongo_id), function(err,file){
			res.send(file);
			console.log("callback called");
		});
	})
	*/	





//FOR GRIDFS
app.get('/files', function (req, res) {
	gfs.files.find().toArray(function(err,files) {
		
		if(!files || files.length ===0){
			return res.status(404).json({
				err: 'No files exist'
			})
		} 
		
		return res.json(files);    
	})
})

app.get('/files/:fileName', function (req, res) {
	gfs.files.findOne({filename: req.params.fileName},function(err,file) {
		if(!file || file.length ===0){
			return res.status(404).json({
				err: 'No file exist'
			})
		} 
		
		return res.json(file);    
	})
})

app.get('/playAudio/:fileName', function (req, res) {
	gfs.files.findOne({filename: req.params.fileName},function(err,file) {
		if(!file || file.length ===0){
			return res.status(404).json({
				err: 'No file exist'
			})
		} 
		
		var readStream = gfs.createReadStream(file.filename);
		readStream.pipe(res);  
	})
})


var port = 3000;
app.listen(port,"0.0.0.0",function(){ console.log('server started on port ', port)});

