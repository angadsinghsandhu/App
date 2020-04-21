const mongoose = require('mongoose');

//making schema
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true }
});

//converting schema into model
module.exports = mongoose.model("Post", postSchema);

