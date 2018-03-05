const express = require('express');
const router = express.Router();
const lajifiLogin = require('../middleware/lajifi_login');



// Calling middleware function
//router.use(lajifiLogin.log);

/*
// Anon middleware function
router.use(function (req, res, next) {
  next();
});
*/

router.use(lajifiLogin.getUserData);
router.use(lajifiLogin.getUserFiles);



/* GET home page. */
router.get('/', function(req, res, next) {
  let message = JSON.stringify(req.lajifi.user);

  res.render('index', {
      title: 'Havistin',
      message: message,
      files: req.files
    });
});

module.exports = router;
