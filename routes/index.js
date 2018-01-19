const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');

router.get('/', (req, res, next) => {
    return res.render('index');
});


router.get('/location', (req, res, next) => {
    return res.render('getGeolocationDemo');
});

router.get('/login', (req, res, next) => {
	return res.render('login')
})

router.get('/register', (req, res, next) => {
    return res.render('register');
});

router.put('/location', (req, res, next) => {
  request.put({
      url: config.apiUrl + '/update-location',
      form: req.body
  }).pipe(res)
})

router.put('/find-nearby', (req, res, next) => {
  request.put({
      url: config.apiUrl + '/find-nearby',
      form: req.body
  }).pipe(res)
})


router.post('/register', (req, res, next) => {
  request.post({
      url: config.apiUrl + '/users',
      form: req.body
  }).pipe(res)
})

router.post('/login', (req, res, next) => {
  request.post({
      url: config.apiUrl + '/auth/login',
      form: req.body
  }).pipe(res)
})

//-TODO logout
router.post('/logout', (req, res, next) => {
  request.post({
    url: config.apiUrl + '/auth/logoff',
    form: req.body
  }).pipe(res)
})


router.get('/update', (req, res, next) => {
  return res.render('update')
})

router.put('/update', (req, res, next) => {
  request.put({
    url: config.apiUrl + '/users',
    form: req.body
  }).pipe(res)

})
module.exports = router;
