const Campground = require('../models/campground'),
        Review  =   require('../models/review');
module.exports.new = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campgrounds.reviews.push(review);
    await review.save();
    await campgrounds.save();
    req.flash('success', 'succesfully made a new review');
    res.redirect(`/campgrounds/${campgrounds._id}`);
};
module.exports.destroy = async (req, res) =>{
    const {id, reviewID} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull : {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'succesfully delete a review');
    res.redirect(`/campgrounds/${id}`)
};