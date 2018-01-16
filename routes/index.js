const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');

router.get('/', (req, res, next) => {
    return res.render('index');
});

<<<<<<< HEAD
router.get('/location', (req, res, next) => {
    return res.render('getGeolocationDemo');
});
=======
router.get('/login', (req, res, next) => {
	return res.render('login')
})
>>>>>>> 35bb1932892166e545e1a10be511e6aff02d95a7

router.put('/location', (req, res, next) => {
  request.put({
      url: config.apiUrl + '/update-location',
      form: req.body
  }).pipe(res)
})

router.post('/register', (req, res, next) => {
  request.post({
      url: config.apiUrl + '/users',
      form: req.body
  }).pipe(res)
})



module.exports = router;
