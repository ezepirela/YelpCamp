const   express         =   require('express'),
        router          =   express.Router({mergeParams : true}),
        Campground          =   require('../models/campground'),
        ExpressError        =   require('../utils/ExpressError'),
        CatchAsync          =   require('../utils/CatchAsync'),
        Review              =   require('../models/review'),
        {campgroundSchema, reviewSchema}  =   require('../schemas.js'),
        {validateReview, isLoggedIn, isReviewAuthor}  =   require('../middleware'),
        reviews     =   require('../controllers/reviews');
        // validateCampgrounds =   require('../validate/validateMiddleware')
// CREATE A NEW REVIEW FOR A CAMPGROUND
router.post('/',validateReview, isLoggedIn, CatchAsync(reviews.new));
// DELETE A REVIEW OF A CAMPGROUND 
router.delete('/:reviewID', isLoggedIn,isReviewAuthor, CatchAsync(reviews.destroy));
module.exports =  router; 