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

		break;
		default :

		var qp = {
			query: [
				'MATCH (user:User),(other:City)',
				' WHERE ID(user) = '+nodeId+' AND ID(other) = '+otherNodeId+
				' CREATE (user)'+NodeJS.createRelationShip(relation)+'(other)'
			].join('\n')
		}

	break;
	}
	

	db.cypher(qp, function (err, result) {

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

NodeJS.updateUserRelationship = function(id,city, callback) {
	User.getUserRelationships(id, function(err, result){

		console.log(result[0].n);
		console.log(result[0].r);
		console.log(result[0].m);
		result.forEach(element => {
			if(element.r){
				if (element.r.type === "livesIn"){
					console.log("rel found");
					var qp = {
						query: [
							'MATCH (user:User) -[oldRel:livesIn]-> (other:City)',
							' WHERE ID(user) = {userId} AND ID(other) = {otherId}',
							' MATCH (newOther:City)',
							' WHERE ID(newOther) = {newOtherID}',
							' DELETE oldRel',					
							' CREATE (user) '+NodeJS.createRelationShip("livesIn")+' (newOther)',
							' CREATE (user) -[newOldRel:livedIn]-> (other)'
						].join('\n'),
						params: {
							userId: id,
							otherId: element.m._id,
							newOtherID: city
						}
					}
		
					db.cypher(qp, function (err, result) {
						if (err) return callback(err);
						callback(null, result);
					})
				} else if (element.r.type === "livedIn" ) {
					console.log("else if")
					
				} else {
					console.log("fail");
					
				}

			} else {
				NodeJS.addRelationship("livesIn", id, city , function(err){
					if (err) return callback(err);
					callback(null, result);
				});
			}
			
		});
	});
	console.log(id);
};