const   express             =   require('express'),
        router              =   express.Router(),
        users               =   require('../controllers/users');
router.get('/register', users.registerForm);
router.post('/register', users.createUser);
router.get('/login', users.loginForm);
router.post('/login', users.authenticate, users.login);
router.get('/logout', users.logout)
module.exports = router