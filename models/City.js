var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:mafrax@localhost:7474');
var bcrypt = require('bcrypt-nodejs');

// private constructor:
var City = module.exports = function City(_node) {
	// all we'll really store is the node; the rest of our properties will be
	// derivable or just pass-through properties (see below).
	this._node = _node;
}

City.getBy = function (field, value, callback) {
	console.log('entered getby');
	console.log(value);
	console.log(field);
	var qp = {
		query: [
			'MATCH (city:City)','WHERE ' + field + ' = {value}','RETURN city',
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
			console.log(result[0]);
			callback(null, null);
		} else {
			console.log('2');
			console.log(result[0]);
			callback(null, result[0]['city']);
		}
	});
}

// creates the user and persists (saves) it to the db, incl. indexing it:
City.create = function (data, callback) {
  console.log(data);
  City.getAll(function(err, cities){
	var c = new Array();
	c = cities;
  })
	var qp = {
		query: [
			'CREATE (city:City {data})',
			'RETURN city',
		].join('\n'),
		params: {
			data: data
		}
	}
	console.log('after query');
	console.log(qp);
	db.cypher(qp, function (err, results) {
		if (err) return callback(err);
		callback(null, results[0]['city']);
		console.log(results);
	});
};

City.getAll = function (callback) {
	var qp = {
		query: [
			'MATCH (city:City)',
			'RETURN city',
			'LIMIT 100'
		].join('\n')
	}

	db.cypher(qp, function (err, result) {
		if (err) return callback(err);
		callback(null, result);
	});
};