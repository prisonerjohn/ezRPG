QuestionProvider = function() {
	
};

QuestionProvider.prototype.getCollection = function(db, callback) {
	db.collection('questions', function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, collection);
		}
	});
};

QuestionProvider.prototype.save = function(db, question, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.findOne({ name: question.name }, function(err, document) {
				if (document) {
					callback('Question "' + question.name + '" already exists!', null);
				}
				else {
					question.created_at = new Date();
					collection.insert(question, { safe: true }, function(err, records) {
						if (err) {
							callback(err, null);
						}
						else {
							callback(null, records[0]);
						}
					});
				}
				
			});
		}		
	});
};

QuestionProvider.prototype.findAll = function(db, callback) {
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

QuestionProvider.prototype.find = function(db, questionID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.findOne({ _id: questionID }, function(err, record) {
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

QuestionProvider.prototype.update = function(db, question, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.save(question, { safe: true }, function(err, res) {
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

QuestionProvider.prototype.remove = function(db, questionID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.remove({ _id: questionID }, function(err, numRemoved) {
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

exports.QuestionProvider = QuestionProvider;
