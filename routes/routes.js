const Router = require('express').Router();
const { signup, signin, getuser } = require('../controller/controller');
const jwtAuth = require('../middlewares/jwtAuth');

Router.post('/signup', signup)
Router.post('/signin', signin)
Router.get('/user', jwtAuth, getuser)

module.exports = Router;