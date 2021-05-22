const  mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
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
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i< 300; i++ ) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '5fc5a1aba92349192ce24a87',
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {"type": "Point", "coordinates": [cities[random1000].longitude, cities[random1000].latitude]},
            images: [
                {
                  url: 'https://res.cloudinary.com/ezepirela/image/upload/v1618168179/YelpCamp/nhv2gxqn8vxdcouggel2.jpg',
                  filename: 'YelpCamp/podlgatja89p6s6pl9cr'
                }
              ],
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad aut, asperiores labore sed voluptatibus inventore magni iste perferendis nostrum quaerat facilis veniam accusantium eligendi, minima quos voluptate laudantium at recusandae!",
            price: price
        })
        await camp.save();
    }
}
seedDB().then( ()=> { 
    mongoose.connection.close();
})