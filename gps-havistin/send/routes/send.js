const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const send = require('../send')

/*
// Anon middleware function
router.use(function (req, res, next) {
  next();
});
*/

// These will be used for all URLs within this route
router.use(middleware.getUserData);
//router.use(middleware.getUserFiles);


/* Home page. */
router.get('/', function(req, res, next) {
  let message = JSON.stringify(req.lajifi.user);

  // Still a test
  send.sendLajifiDocument("foo", function() {
    // do nothin'
  });


  res.render('send', {
      title: 'Sendari',
      message: message,
      userFiles: req.userFiles,
      unsentUserFiles: req.unsentUserFiles
    });
});

module.exports = router;
