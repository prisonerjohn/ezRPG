ScoreProvider = function() {
	
};

ScoreProvider.prototype.getCollection = function(db, callback) {
	db.collection('scores', function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, collection);
		}
	});
};

// ScoreProvider.prototype.save = function(db, question, callback) {
// 	this.getCollection(db, function(err, collection) {
// 		if (err) {
// 			callback(err, null);
// 		}
// 		else {
// 			collection.findOne({ name: question.name }, function(err, document) {
// 				if (document) {
// 					callback('Question "' + question.name + '" already exists!', null);
// 				}
// 				else {
// 					question.created_at = new Date();
// 					collection.insert(question, { safe: true }, function(err, records) {
// 						if (err) {
// 							callback(err, null);
// 						}
// 						else {
// 							callback(null, records[0]);
// 						}
// 					});
// 				}
// 				
// 			});
// 		}		
// 	});
// };

ScoreProvider.prototype.findAll = function(db, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.find().toArray(function(err, results) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, results);
				}
			});
		}		
	});
};

ScoreProvider.prototype.find = function(db, scoreID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.findOne({ _id: scoreID }, function(err, record) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, record);
				}
			});
		}		
	});
};

ScoreProvider.prototype.findForQuestion = function(db, questionID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.find({ qId: questionID }).toArray(function(err, record) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, record);
				}
			});
		}		
	});
};

ScoreProvider.prototype.findForToken = function(db, tokenID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.find({ tId: tokenID }).toArray(function(err, record) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, record);
				}
			});
		}		
	});
};

ScoreProvider.prototype.save = function(db, score, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			score.created_at = new Date();
			console.log(score);
			collection.save(score, { safe: true }, function(err, res) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, res);
				}
			});
		}
	});
};

ScoreProvider.prototype.remove = function(db, scoreID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.remove({ _id: scoreID }, function(err, numRemoved) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, numRemoved);
				}
			});
		}		
	});
};

ScoreProvider.prototype.removeForQuestion = function(db, questionID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.remove({ qId: questionID }, function(err, numRemoved) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, numRemoved);
				}
			});
		}		
	});
};

ScoreProvider.prototype.removeForToken = function(db, tokenID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.remove({ tId: tokenID }, function(err, numRemoved) {
				if (err) {
					callback(err, null);
				}
				else {
					callback(null, numRemoved);
				}
			});
		}		
	});
};

exports.ScoreProvider = ScoreProvider;
