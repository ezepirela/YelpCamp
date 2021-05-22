const User          =   require('../models/user'),
passport            =   require('passport');
module.exports.registerForm = (req, res) => {
    res.render('user/register')
};
module.exports.createUser = async (req, res)=> {
    try{
        const {username, password, email} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err){
                return next(err);
            }
        })
        req.flash('success', 'welcome new user');
        res.redirect('/campgrounds')
    }catch(e) {
        req.flash('failure', e.message);
        res.redirect('/register');
    }
};
module.exports.loginForm = (req, res) => {
    res.render('user/login');
};
module.exports.login = async(req, res)=> {
    req.flash('success', 'welcome back');
    const redirectURL = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectURL);
};
module.exports.logout = (req, res)=> {
    req.logOut();
    req.flash('success', 'you log out');
    res.redirect('/campgrounds');
};
module.exports.authenticate = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'});