const {campgroundSchema, reviewSchema}  =   require('./schemas.js'),
Campground          =   require('./models/campground'),
Review          =   require('./models/review');
ExpressError    =   require('./utils/ExpressError');
module.exports.isLoggedIn = (req, res, next) =>{ 
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
    req.flash('failure', 'you must be sign in')
    return res.redirect('/login')
    }
next();
};
module.exports.validateCampgrounds = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
     const msg = error.details.map(el => el.message).join(',');
     throw new ExpressError(msg, 400);
    }else{
        next()
    }
 }
module.exports.isAuthor = async(req, res, next) =>{
    const camp = await Campground.findById(req.params.id);
    if(!camp.author.equals(req.user._id)){
        req.flash('failure', 'you are not the owner');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }next()
}
module.exports.isReviewAuthor = async(req, res, next) =>{
    const review = await Review.findById(req.params.reviewID);
    if(!review.author.equals(req.user._id)){
        req.flash('failure', 'you are not the owner');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }next()
}
module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
       }else{
           next()
       }
}