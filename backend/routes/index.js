//create an Express router


const express = require('express')
const router = express.Router()
const apiRouter = require('./api');

// create a test route
// router.get("/hello/world", function (req,res) {
//   res.cookie('XRSF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });





router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});


router.use('/api', apiRouter);

//export the router at the bottom of the file
module.exports = router;
