const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const {imageSchema} = require('./image');

const overviewSchema = new Schema({
    htmlBody:{
        type: String,
    },
    forArticle: {
        type: String,
        unique: true
    },
    images: [imageSchema]
});

module.exports.Overview = moongoose.model("Overview", overviewSchema);
module.exports.overviewSchema = overviewSchema;