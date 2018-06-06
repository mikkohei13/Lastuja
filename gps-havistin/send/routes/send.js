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

    let message = JSON.stringify(req.lajifi.user); // debug

    res.render('send', {
      title: 'Sendari',
      message: message,
      userFiles: req.userFiles,
      person_token: req.query.person_token
    });
  }
);

/* Route /send/file */
router.get('/file/:fileId', 

  // Endpoint-level middleware
  middleware.sendFile,

  function(req, res, next) {
    
//    console.log("RISTIINA: " + JSON.stringify(req.lajifi)); // person_token is not here

    res.render('send_file', {
      title: 'Sendari',
      vihkoFileId: req.sendFileResponse.id,
      vihkoFileLink: "https://laji.fi/vihko/JX.519/" + req.sendFileResponse.id,
      sendFileResponse: req.sendFileResponse,
      person_token: req.query.person_token
    });
  }
);

module.exports = router;
