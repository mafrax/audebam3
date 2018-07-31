// users.js
// Routes to CRUD users.

var User = require('../models/user');

module.exports = function(app, passport) {

	app.get('/users', function (req, res) {
		User.getAll(function (err, users) {
			if (err) return next(err);
			res.render('profile');
		});
	});

	app.get('/user/:username', function (req, res) {
		
		User.getBy('user.username', req.params.username, function (err, user) {

			if (err) return next(err);
			User.getUserRelationships(user._id, function (err, relationships) {
				if (err) return next(err);

				res.render('pages/user', {
					u: req.user,
					user: user,
					relationships: relationships
				});
			});
		});
	});

	app.get('/29-YourAccount-AccountSettings/:username', function (req, res) {

		User.getAll(function(err,users){
			users.forEach(element => {
				console.log(element);
			});
		})
				res.render('29-YourAccount-AccountSettings.ejs', {
					user: req.user
				});
			
		
	});

	app.get('/29-YourAccount-AccountSettings/:username/28-YourAccount-PersonalInformation', function (req, res) {
				res.render('28-YourAccount-PersonalInformation.ejs', {
					user: req.user
				});
			
		
	});

	app.post('/user/:username/:relation', function (req, res) {
		if (!req.user) {
			res.status(401).body({redirectTo: '/login'});
		}

		User.getBy('user.username', req.params.username, function (err, user) {
			if (err) return next(err);

			User.addUserRelationship(req.params.relation, req.user._id, user._id, function (err, huh) {
				res.status(201).json({status: 'success'});
			})
		});



	});

};