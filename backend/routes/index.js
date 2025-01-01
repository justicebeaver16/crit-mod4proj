const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

//add a xsrf-token cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
});

router.use('/api', apiRouter);

//add a xsrf-token cookie in dev
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      return res.json({});
  });
}

module.exports = router;