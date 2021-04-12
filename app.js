// if(process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }
require('dotenv').config();
const   express     =   require('express'),
mongoose            =   require('mongoose'), 
path                =   require('path'),
methodOverride      =   require('method-override'),
ejsMate             =   require('ejs-mate'),
app                 =   express(),
ExpressError        =   require('./utils/ExpressError'),
campgrounds         =   require('./router/campgrounds'),
reviews             =   require('./router/reviews'),
session             =   require('express-session'),
flash               =   require('connect-flash'),
passport            =   require('passport'),
localStrategy       =   require('passport-local'),
User                =   require('./models/user'),
userRoutes          =   require('./router/user');

/////////////////////////////// DATABASE SET UP////////////////////////////////
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('database connected');
})
///////////////////////////////DEFINITIONS /////////////////////////
// CONFIGURING VIEWS ENGINE AND DYNAMICS TEMPLATES
app.engine('ejs', ejsMate); 
app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'))
// CONFIGURING TACKING DATA FROM THE FORMS
app.use(express.urlencoded({extended: true}))
// ADDING PUT, DELETE AND EDIT METHODS
app.use(methodOverride('_method'));
// SESSION CONFIGURATIONS
const sessionConfig = {
    secret: 'notsecret', // standar params for session configuration
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        expires: Date.now() *1000 *60 *60 * 24 * 7, // defining expiry date for our coockies
        maxAge: 1000 *60 *60 * 24 * 7 // defining expiry date for our coockies
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// FLASH CONFIGURATIONS 
app.use(flash());
// FLASH MIDDLEWARE 
// send variables to all template to use them
app.use((req, res, next)=> {
    res.locals.currentUser  =   req.user;
    res.locals.success =    req.flash('success');
    res.locals.failure =    req.flash('failure');
    next();
});
// PASSPORT CONFIGURATIONS

// ROUTER CONFIGURATIONS
app.use('/campgrounds', campgrounds); // DEFINING THE ROUTE MODEL TO USE AND THE ESPECIFIC ROUTES AND ADDING THE SHORCOUT
app.use('/campgrounds/:id/review', reviews);
app.use('/', userRoutes);
// USE THAT SPECIFIC DIRECTORY FOR ALL STATIC FILES
app.use(express.static('public'));
//////////////////////////////////// ROUTES///////////////////////////
app.get('/fakeuser', async (req, res)=> {
    const user = new User({email:' eze@gmail.com',username: 'eze'});
    const newUser =   await User.register(user, 'eze');
    res.send(newUser);
})
// DISPLAY ERROR TEMPLATE 
app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404 )) // IF THE PAGE REQUESTED DOESN EXIST RUN THIS CODE
});
// ERROR HANDLER 
app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'something went wrong'} = err;
    if(!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log('serving on the port: 3000')
});