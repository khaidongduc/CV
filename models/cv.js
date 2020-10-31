const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const cvSchema = new Schema({
    url: String,
    filename: String
});

module.exports.CV = moongoose.model("CV", cvSchema);
module.exports.cvSchema = cvSchema;