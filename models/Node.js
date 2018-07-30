var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:mafrax@localhost:7474');
var bcrypt = require('bcrypt-nodejs');
var City = require('../models/city');
var User = require('../models/User');
// private constructor:
var NodeJS = module.exports = function NodeJS(_node) {
	// all we'll really store is the node; the rest of our properties will be
	// derivable or just pass-through properties (see below).
	this._node = _node;
}

NodeJS.createRelationShip = function(relation){
var rel = '-[rel:'+relation+']->';
return rel;
}

NodeJS.addRelationship = function(relation, nodeId, otherNodeId, callback) {
	console.log('Node relation add');
	console.log(relation);
	switch (relation) {
		case 'follow':
		console.log('follow');
			var qp = {
				query: [
					'MATCH (user:User),(other:User)',
					'WHERE ID(user) = {nodeId} AND ID(other) = {otherNodeId}',
					'MERGE (user)-[rel:follows]->(other)',
					'ON CREATE SET rel.timestamp = timestamp()',
					'RETURN rel'
				].join('\n'),
				params: {
					userId: nodeId,
					otherId: otherNodeId,
				}
			}
		console.log(qp);
		break;
		case 'unfollow':
		console.log('unfollow');
			var qp = {
				query: [
					'MATCH (user:User) -[rel:follows]-> (other:User)',
					'WHERE ID(user) = {nodeId} AND ID(other) = {otherNodeId}',
					'DELETE rel'
				].join('\n'),
				params: {
					userId: nodeId,
					otherId: otherNodeId,
				}
			}
			console.log(qp);
		break;
		default :
		console.log('Default');
		var qp = {
			query: [
				'MATCH (user:User),(other:City)',
				' WHERE ID(user) = '+nodeId+' AND ID(other) = '+otherNodeId+
				' CREATE (user)'+NodeJS.createRelationShip(relation)+'(other)',
				' RETURN rel'
			].join('\n')
		}
		console.log(qp);
	break;
	}
	
	console.log('querry update add relationship');
	db.cypher(qp, function (err, result) {
	console.log(result);
	console.log(err);
	if (err) return callback(err);
		callback(null, result);
		});
	};


NodeJS.getUserRelationships = function(id, callback) {
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

NodeJS.updateUserRelationship = function(id, callback) {
	User.getUserRelationships(id, function(user,relation, otherNode, err){
		console.log(otherNode);
		if (relation === "livesIn"){
			console.log("rel found");
		}
	})
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