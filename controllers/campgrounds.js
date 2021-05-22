const   Campground  =   require('../models/campground');
const   mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
 const  {cloudinary}  =   require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', ({campgrounds: campgrounds}))
}
module.exports.newcampground = (req, res) =>{
    res.render("campgrounds/new");
}
module.exports.showCamp = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'}
        }).populate('author');
    if(!campgrounds) {
        req.flash('failure', 'that camp doesnt exist');
       return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campgrounds});
};
module.exports.create = async (req, res, next) =>{
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campgrounds.location,
        limit: 1
    }).send();
        const campground = new Campground(req.body.campgrounds);
        campground.images = req.files.map( f => ({url: f.path, filename: f.filename}));
        campground.author = req.user._id;
        campground.geometry = geoData.body.features[0].geometry
        await campground.save();
        console.log(campground);
        req.flash('success', "succesfully made a new campground")
        res.redirect(`/campgrounds/${campground._id}`) 
}
module.exports.edit = async (req, res) => {
    const {id} = req.params;
    const campgrounds = await Campground.findById(id)
    res.render('campgrounds/edit', {campgrounds: campgrounds})
};
module.exports.put= async (req, res) =>{
    const { id } = req.params
    // console.log(req.body);
   const campgrounds = await Campground.findByIdAndUpdate(id, {...req.body.campgrounds})
   const img = req.files.map( f => ({url: f.path, filename: f.filename}));
   await campgrounds.images.push(...img);
   if(req.body.deleteImages) {
       for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
       }
    await campgrounds.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    // console.log(campgrounds)
   }
   campgrounds.save()
   req.flash('success', "succesfully edit campground")
    res.redirect(`/campgrounds/${campgrounds._id}`)
};
module.exports.campgroundsDelete = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'succesfully delete a campground');
    res.redirect('/campgrounds')
};