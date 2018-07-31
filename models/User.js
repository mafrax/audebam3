// user.js
// User model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:mafrax@localhost:7474');
var bcrypt = require('bcrypt-nodejs');
var City = require('../models/city');
var NodeJS = require('../models/NodeJS');
// private constructor:
var User = module.exports = function User(_node) {
	// all we'll really store is the node; the rest of our properties will be
	// derivable or just pass-through properties (see below).
	this._node = _node;
}

// static methods:
User.get = function (id, callback) {
	var qp = {
		query: [
			'MATCH (user:User)',
			'WHERE ID(user) = {userId}',
			'RETURN user',
		].join('\n'),
		params: {
			userId: parseInt(id)
		}
	}

	db.cypher(qp, function (err, result) {
		if (err) return callback(err);
		callback(null, result[0]['user']);
	});
};

User.getAll = function (callback) {
	var qp = {
		query: [
			'MATCH (user:User)',
			'RETURN user',
			'LIMIT 100'
		].join('\n')
	}

	db.cypher(qp, function (err, result) {
		if (err) return callback(err);
		callback(null, result);
	});
};

User.getBy = function (field, value, callback) {
	console.log('entered getby');
	console.log(value);
	var qp = {
		query: [
			'MATCH (user:User)','WHERE ' + field + ' = {value}','RETURN user',
		]
		.join('\n')
		,
		params: {
			value: value
		}
	}
console.log(qp);
	db.cypher(qp, function (err, result) {
		if (err) return callback(err);
		if (!result[0]) {
			console.log('1');
			callback(null, null);
		} else {
			console.log('2');
			callback(null, result[0]['user']);
		}
	});
}

User.addUserRelationship = function(relation, userId, otherId, callback) {
	switch (relation) {
		case 'follow':
			var qp = {
				query: [
					'MATCH (user:User),(other:User)',
					'WHERE ID(user) = {userId} AND ID(other) = {otherId}',
					'MERGE (user)-[rel:follows]->(other)',
					'ON CREATE SET rel.timestamp = timestamp()',
					'RETURN rel'
				].join('\n'),
				params: {
					userId: userId,
					otherId: otherId,
				}
			}
		break;
		case 'unfollow':
			var qp = {
				query: [
					'MATCH (user:User) -[rel:follows]-> (other:User)',
					'WHERE ID(user) = {userId} AND ID(other) = {otherId}',
					'DELETE rel'
				].join('\n'),
				params: {
					userId: userId,
					otherId: otherId,
				}
			}
		break;
	}

	db.cypher(qp, function (err, result) {
		console.log(err);
		console.log('result');
		console.log(result);
		callback(err);
	});
}

User.getUserRelationships = function(id, callback) {
	var qp = {
		query: [
			'START n=node({userId})',
			'MATCH (n)-[r]-(m)',
			'RETURN n,r,m'
		].join('\n'),
		params: {
			userId: id
		}
	}

	db.cypher(qp, function (err, result) {
		if (err) return callback(err);
		callback(null, result);
	});
}

// creates the user and persists (saves) it to the db, incl. indexing it:
User.create = function (data, callback) {
	console.log('entered create function');
	console.log(data);
	var qp = {
		query: [
			'CREATE (user:User {data})',
			'RETURN user',
		].join('\n'),
		params: {
			data: data
		}
	}
	console.log('after query');
	console.log(qp);
	db.cypher(qp, function (err, results) {
		if (err) return callback(err);
		callback(null, results[0]['user']);
		console.log(results);
	});
};

User.update = function (data, callback) {
	console.log(data);
	var qp = {
		query: [
			'MATCH (user:User)',
			'WHERE id(user) = {userId}',
			'SET user += {props}',
			'RETURN user',
		].join('\n'),
		params: {
			userId: data.id,
			props: data.props,
		}
	}

if(data.props.city){

	City.getBy('city.cityName', data.props.city, function(err, city){
	console.log(city);
		if(!city){
		
				var newCity = {};
				newCity.cityName = data.props.city;
						
					City.create(newCity, function (err, city) {
						
						console.log(err);
						if (err)
						return next(err);
						console.log(city);
						NodeJS.addRelationship("livesIn", data.id , city._id , function(err){
							console.log(err);
							console.
							log('error');
							if (err) return next(err);
						});
					});
				}else{
					NodeJS.updateUserRelationship(data.id, city._id, function(err){
						console.log(err);
						console.
						log('error');
						if (err) return next(err);
					});
				}
			})
		}


console.log(qp);
	db.cypher(qp, function (err, results) {
		if (err) return callback(err);
		callback(null, results[0]['user']);
	});
}

// generating a hash
User.generateHash = function(password, next) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null, next);
};

// checking if password is valid
User.validPassword = function(password, pass, next) {
	return bcrypt.compareSync(password, pass, next);
};