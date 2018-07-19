var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:mafrax@localhost:7474');
var bcrypt = require('bcrypt-nodejs');
var City = require('../models/city');
// private constructor:
var NodeJS = module.exports = function NodeJS(_node) {
	// all we'll really store is the node; the rest of our properties will be
	// derivable or just pass-through properties (see below).
	this._node = _node;
}

NodeJS.addUserRelationship = function(relation, nodeId, otherNodeId, callback) {
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

Node.getUserRelationships = function(id, callback) {
	var qp = {
		query: [
			'START n=node({userId})',
			'MATCH n-[r]-(m)',
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