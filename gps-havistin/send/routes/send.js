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

// Route-level middleware
router.use(middleware.getUserData);


/* Route /send */
router.get('/', 

  // Endpoint-level middleware
  middleware.getUserFiles,

  function(req, res, next) {

    let message = JSON.stringify(req.lajifi.user);

    res.render('send', {
      title: 'Sendari',
      message: message,
      userFiles: req.userFiles
    });
  }
);

/* Route /send/file */
router.get('/file/:fileId', 

  // Endpoint-level middleware
  middleware.sendFile,

  function(req, res, next) {

  // This should happen on different route
  /*
  lajifi_send.sendLajifiDocument("foo", function() {
    // do nothin' in callback
  });
  */

    res.render('send_file', {
      title: 'Sendari',
      message: req.sendFileResponse
    });
  }
);

module.exports = router;
