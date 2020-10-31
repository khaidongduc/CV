const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    url: {
        type: String,
    },
    repository: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    htmlDescription: {
        type: String
    }
});

module.exports.Project = moongoose.model("Project", projectSchema);
module.exports.projectSchema = projectSchema;