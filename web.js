var express = require('express');
var logfmt = require('logfmt');
var util = require('util');

var Db = require('mongodb').Db,
	ObjectID = require('mongodb').ObjectID;
	
var TokenProvider = require('./tokenProvider.js').TokenProvider,
	QuestionProvider = require('./questionProvider.js').QuestionProvider,
	ScoreProvider = require('./scoreProvider.js').ScoreProvider;

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
var questionProvider = new QuestionProvider();
var scoreProvider = new ScoreProvider();

app.get('/', function(req, res) {
  res.send('Hello World!');
  //res.send(mongoUri);
});

// token routes

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
	var tId = req.params.id;
	scoreProvider.removeForToken(db, tId, function(err, numRemoved) {
		console.log('Removed ' + numRemoved + ' scores');
		tokenProvider.remove(db, ObjectID.createFromHexString(tId), function(err, numRemoved) {
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
});

// question routes

app.get('/questions', function(req, res) {
	questionProvider.findAll(db, function(err, questions) {
		if (err) return console.error(err);
		
		res.send(questions);
	});
});

app.post('/question/new', function(req, res) {
	if (!req.body.name) {
		var err = 'No "name" key in data!';
		console.error(err);
		res.send(400, err);
	}
	else {
		questionProvider.save(db, req.body, function(err, docs) {
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

app.get('/question/:id', function(req, res) {
	questionProvider.find(db, ObjectID.createFromHexString(req.params.id), function(err, record) {
		if (err) {
			console.error(err);
			res.send(409, err);
		}
		else {
			res.send(record);
		}
	});
});

app.put('/question/:id', function(req, res) {
	if (!req.body.name) {
		var err = 'No "name" key in data!';
		console.error(err);
		res.send(400, err);
	}
	else {
		var question = new Object();
		question._id = ObjectID.createFromHexString(req.params.id);
		question.name = req.body.name;
		//console.log(util.inspect(question));
		questionProvider.update(db, question, function(err, result) {
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

app.delete('/question/:id', function(req, res) {
	var qId = req.params.id;
	scoreProvider.removeForQuestion(db, qId, function(err, numRemoved) {
		console.log('Removed ' + numRemoved + ' scores');
		questionProvider.remove(db, ObjectID.createFromHexString(qId), function(err, numRemoved) {
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
});

// score routes

app.get('/scores', function(req, res) {
	scoreProvider.findAll(db, function(err, scores) {
		if (err) return console.error(err);
		
		res.send(scores);
	});
});

app.put('/scores', function(req, res) {
	// add the IDs to each tuple
	var scores = req.body.scores;
	var allErr;
	for (var i = 0; i < scores.length; i++) {
		if (scores[i]._id) {
			scores[i]._id = ObjectID.createFromHexString(scores[i]._id);
		}
		scoreProvider.save(db, scores[i], function(err, docs) {
			if (err) {
				allErr = err;
			}
		});
	}
	if (allErr) {
		console.error(allErr);
		res.send(409, allErr);
	}
	else {
		var ok = new Object();
		ok.result = 'ok';
		res.send(ok);
	}
});

app.get('/scores/q/:id', function(req, res) {
	scoreProvider.findForQuestion(db, req.params.id, function(err, scores) {
		if (err) return console.error(err);
		
		res.send(scores);
	});
});

app.get('/scores/t/:id', function(req, res) {
	console.log('getting scores for token ' + req.params.id);
	scoreProvider.findForToken(db, req.params.id, function(err, scores) {
		if (err) return console.error(err);
		
		res.send(scores);
	});
});

app.get('/score/:id', function(req, res) {
	scoreProvider.find(db, ObjectID.createFromHexString(req.params.id), function(err, record) {
		if (err) {
			console.error(err);
			res.send(409, err);
		}
		else {
			res.send(record);
		}
	});
});

app.delete('/score/:id', function(req, res) {
	scoreProvider.remove(db, ObjectID.createFromHexString(req.params.id), function(err, numRemoved) {
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
