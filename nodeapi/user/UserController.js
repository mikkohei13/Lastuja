// UserController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true })); // This formats request params
var User = require('./User');

// Creates a user
router.post('/', function (req, res) {
    User.create({
            name : req.body.name,
            home : req.body.home
        }, 
        function (err, user) {
            if (err) {
                return res.status(500).send("There was a problem adding the information to the database.");
            }
            res.status(200).send(user);
        });
});

// Returns all users
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            return res.status(500).send("There was a problem finding the users.");
        } 
        res.status(200).send(users);
    });
});

// Returns a single user by id
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(500).send("There was a problem finding the users.");
        } 
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// Finds a user by name
router.get('/name/:name', function (req, res) {
    User.find({ 'name' : req.params.name }, function (err, user) {
        if (err) {
            return res.status(500).send("There was a problem finding the users by name.");
        } 
        if (!user) return res.status(404).send("No user found by name " + req.params.name + ".");
        res.status(200).send(user);
    });
});

// Updates a user
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) {
            return res.status(500).send("There was a problem updating the user.");
        } 
        res.status(200).send(user);
    });
});


// Pseudo-deletes a user
router.delete('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, { "trashed": true }, {new: true}, function (err, user) {
        if (err) {
            return res.status(500).send("There was a problem updating the user.");
        } 
        res.status(200).send("User "+ user.name +" was deleted.");
    });
});

module.exports = router;