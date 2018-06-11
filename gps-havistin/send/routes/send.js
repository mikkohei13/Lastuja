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
      title: "Havistin - Main page",
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
    res.render("send_file", {
      title: "Havistin - File sent",
      vihkoFileId: req.sendFileResponse.id,
      sendFileResponse: req.sendFileResponse,
      person_token: req.query.person_token,
    });
  },
);

module.exports = router;
