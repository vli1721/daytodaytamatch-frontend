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

router.get('/logout', (req, res, next) =>{
  return res.render('register')
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

router.post('/register', (req, res, next) => {
  request.post({
      url: config.apiUrl + '/users',
      form: req.body
  }).pipe(res)
})

router.post('/login', (req, res, next) => {
  request.post({
      url: config.apiUrl + '/users',
      form: req.body
  }).pipe(res)
})


module.exports = router;
