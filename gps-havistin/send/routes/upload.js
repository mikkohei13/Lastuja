const express = require('express');
const router = express.Router();
const lajifiLogin = require('../middleware/lajifi_login');
const send = require('../send')

/*
// Anon middleware function
router.use(function (req, res, next) {
  next();
});
*/

// These will be used for all URLs within this route
router.use(lajifiLogin.getUserData);
router.use(lajifiLogin.getUserFiles);


/* Home page. */
router.get('/', function(req, res, next) {
  let message = JSON.stringify(req.lajifi.user);

  send.sendLajifiDocument("foo", function() {
    // do nothin'
  });


  res.render('index', {
      title: 'Havistin',
      message: message,
      userFiles: req.userFiles,
      unsentUserFiles: req.unsentUserFiles
    });
});

module.exports = router;
