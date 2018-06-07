const express = require("express");
const middleware = require("../middleware/middleware");

const router = express.Router();

/*
// Anon middleware function
router.use(function (req, res, next) {
  next();
});
*/

// Route-level middleware
router.use(middleware.getUserData);

/* Route /send */
router.get("/", // eslint-disable-line function-paren-newline

  // Endpoint-level middleware functions
  middleware.getUserFiles,

  (req, res, next) => {
    const personalDataJSON = JSON.stringify(req.lajifi.user); // debug

    res.render("send", {
      personalDataJSON,
      secretEmail: req.lajifi.user.secretEmail,
      userFiles: req.userFiles,
      person_token: req.query.person_token,
    });
  },
);

/* Route /send/file */
router.get("/file/:fileId", // eslint-disable-line function-paren-newline

  // Endpoint-level middleware functions
  middleware.sendFile,

  (req, res, next) => {
    //    console.log("RISTIINA: " + JSON.stringify(req.lajifi)); // person_token is not here

    res.render("send_file", {
      vihkoFileId: req.sendFileResponse.id,
      sendFileResponse: req.sendFileResponse,
      person_token: req.query.person_token,
    });
  },
);

module.exports = router;
