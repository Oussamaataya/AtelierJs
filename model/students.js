const mongo = require("mongoose");
const Schema = mongo.Schema;

const STUDENT = new Schema({
    name: String,
    email: String,
    code: Number,
});

module.exports = mongo.model("studscol", STUDENT,'StudentCollection');
