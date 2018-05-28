const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const lajifi_send = require('../lajifi_send')

/*
// Anon middleware function
router.use(function (req, res, next) {
  next();
});
*/

// These will be used for all URLs within this route
router.use(middleware.getUserData);
router.use(middleware.getUserFiles);


/* Under route /send */
router.get('/', function(req, res, next) {
  let message = JSON.stringify(req.lajifi.user);

  // This should happen on different route
  /*
  lajifi_send.sendLajifiDocument("foo", function() {
    // do nothin' in callback
  });
  */

  res.render('send', {
      title: 'Sendari',
      message: message,
      userFiles: req.userFiles,
      unsentUserFiles: req.unsentUserFiles
    });
});

module.exports = router;
