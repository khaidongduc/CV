const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const cvSchema = new Schema({
    url: String,
    filename: String
});

module.exports = moongoose.model("CV", cvSchema);