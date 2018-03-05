
/*
person_token = token = käyttäjän väliaikainen token
access_token = kehittäjän token
*/

var log = function (req, res, next) {
    console.log(req.query);
    next()
}

/*
var getPluscodeByMAcode () {
    req.lajifi = {};
    next();
}
*/

module.exports = {
    "log": log
}