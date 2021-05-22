
const   express         =   require('express'),
        router          =   express.Router(),
        CatchAsync          =   require('../utils/CatchAsync'),
        campgrounds         =   require('../controllers/campgrounds'),
        {isLoggedIn, validateCampgrounds, isAuthor}          =   require('../middleware'),
        multer              =   require('multer'), 
        {storage}           =   require('../cloudinary/index'), 
        upload              =   multer({ storage });
/////////////////////////////////// ///////////////////////////////////////////////
router.route('/')
    .get(CatchAsync(campgrounds.index))
    .post( isLoggedIn, upload.array('image'),validateCampgrounds, CatchAsync(campgrounds.create));
    // SHOW FORM TO CREATE NEW CAMPGROUND /////
router.get('/new',isLoggedIn, campgrounds.newcampground);
 /////////////////////////////////:id ////////////////////////////
router.route('/:id')
    .put(isLoggedIn, isAuthor,upload.array('image') ,validateCampgrounds, CatchAsync(campgrounds.put))
    .delete(isLoggedIn ,isAuthor, CatchAsync(campgrounds.campgroundsDelete))
    .get(CatchAsync(campgrounds.showCamp));

// SHOW FORM TO EDIT A EXISTING CAMPGROUND //
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.edit));
module.exports =  router;