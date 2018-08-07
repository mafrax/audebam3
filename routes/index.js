var User = require('../models/user');

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('test');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		console.log(req.user.properties);
		console.log(req.body.username);
		console.log(req.user.properties.firstName);
		res.render('profile.ejs', {
			user : req.user,
			message : req.flash('connectMessage')
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// Update User
	app.post('/user/update', isLoggedIn, function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				if (req.body.username) {
					updateUser.props.username = req.body.username;
				} 
				if (req.body.lastName) {
					updateUser.props.lastName = req.body.lastName;
				} 
				if (req.body.datetimepicker){
					updateUser.props.birthDay = req.body.datetimepicker;
				}
				if (req.body.gender){
					updateUser.props.gender = req.body.gender;
				}
				if (req.body.city){
					updateUser.props.city = req.body.city;
				}
		console.log(updateUser);

		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});

		// Update User
		app.post('/user/save', isLoggedIn, function(req, res) {
			console.log("save entered");
			console.log(req);
			var updateUser = {};
				updateUser.id = req.user._id;
				updateUser.props = {};
					if (req.body.username) {
						updateUser.props.username = req.body.username;
					} 
					if (req.body.lastName) {
						updateUser.props.lastName = req.body.lastName;
					} 
					if (req.body.datetimepicker){
						updateUser.props.birthDay = req.body.datetimepicker;
					}
					if (req.body.gender){
						updateUser.props.gender = req.body.gender;
					}
					if (req.body.city){
						updateUser.props.city = req.body.city;
					}
			console.log(updateUser);
	
			for(var key in req.body) {
				if (req.body.hasOwnProperty(key)) {
					item = req.body[key];
					console.log(item);
				  }
			}
			
		});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			console.log('casse-couille');
			res.render('error', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login'
		, {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}
	));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			console.log('render signup');
			res.render('auth/signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/',
				failureFlash : true // allow flash messages
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/',
				failureFlash : true // allow flash messages
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('auth/connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				updateUser.props.localEmail          = undefined;
				updateUser.props.localPassword       = undefined;
		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				updateUser.props.facebookToken          = undefined;
		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var updateUser = {};
			updateUser.id = req.user._id;
			updateUser.props = {};
				updateUser.props.twitterToken          = undefined;
		User.update(updateUser, function(err, user) {
			if (err)
				throw err;
			res.redirect('/profile');
		});
	});




};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	console.log(req.user);
	if (req.isAuthenticated())
		return next();
	console.log('redirected');
	res.redirect('/');
}