var express = require('express');
var logfmt = require('logfmt');
var util = require('util');

var Db = require('mongodb').Db,
	ObjectID = require('mongodb').ObjectID;
	
var TokenProvider = require('./tokenprovider').TokenProvider;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

//var db = Db.connect(mongoUri);

var db
Db.connect(mongoUri, function (error, database) {
	if (error) return console.error(error);
	console.log("Connected to db!");
	db = database;
});

var app = express();

app.configure(function() {
  app.use(express.bodyParser({ keepExtensions: true }));
  app.use(logfmt.requestLogger());
});

var tokenProvider = new TokenProvider();

// routes

app.get('/', function(req, res) {
  res.send('Hello World!');
  //res.send(mongoUri);
});

app.get('/tokens', function(req, res) {
	tokenProvider.findAll(db, function(err, tokens) {
		if (err) return console.error(err);
		
		res.send(tokens);
	});
});

app.post('/token/new', function(req, res) {
	if (!req.body.name) {
		var err = 'No "name" key in data!';
		console.error(err);
		res.send(400, err);
	}
	else {
		tokenProvider.save(db, req.body, function(err, docs) {
			if (err) {
				console.error(err);
				res.send(409, err);
			}
			else {
				res.send(docs);
			}		
		});
	}
});

app.get('/token/:id', function(req, res) {
	tokenProvider.find(db, ObjectID.createFromHexString(req.params.id), function(err, record) {
		if (err) {
			console.error(err);
			res.send(409, err);
		}
		else {
			res.send(record);
		}
	});
});

app.put('/token/:id', function(req, res) {
	if (!req.body.name) {
		var err = 'No "name" key in data!';
		console.error(err);
		res.send(400, err);
	}
	else {
		var token = new Object();
		token._id = ObjectID.createFromHexString(req.params.id);
		token.name = req.body.name;
		console.log(util.inspect(token));
		tokenProvider.update(db, token, function(err, result) {
			if (err) {
				console.error(err);
				res.send(409, err);
			}
			else {
				var ok = new Object();
				ok.result = 'ok';
				res.send(ok);
			}
		});
	}
});

app.delete('/token/:id', function(req, res) {
	tokenProvider.remove(db, ObjectID.createFromHexString(req.params.id), function(err, numRemoved) {
		if (err) {
			console.error(err);
			res.send(409, err);
		}
		else {
			var ok = new Object();
			ok.result = 'ok';
			res.send(ok);
		}
	});
});

// start the show

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});
