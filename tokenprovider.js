TokenProvider = function() {
	
};

TokenProvider.prototype.getCollection = function(db, callback) {
	db.collection('tokens', function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, collection);
		}
	});
};

TokenProvider.prototype.save = function(db, token, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.findOne({ name: token.name }, function(err, document) {
				if (document) {
					callback('Token "' + token.name + '" already exists!', null);
				}
				else {
					token.created_at = new Date();
					collection.insert(token, { safe: true }, function(err, records) {
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

TokenProvider.prototype.findAll = function(db, callback) {
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

TokenProvider.prototype.find = function(db, tokenID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.findOne({ _id: tokenID }, function(err, record) {
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

TokenProvider.prototype.update = function(db, token, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.save(token, { safe: true }, function(err, res) {
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

TokenProvider.prototype.remove = function(db, tokenID, callback) {
	this.getCollection(db, function(err, collection) {
		if (err) {
			callback(err, null);
		}
		else {
			collection.remove({ _id: tokenID }, function(err, numRemoved) {
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

exports.TokenProvider = TokenProvider;
