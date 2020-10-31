const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    url: String
});


module.exports.Image = moongoose.model("Image", imageSchema);
module.exports.imageSchema = imageSchema;