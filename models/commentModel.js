var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    content: String,
    created: {type: Date, default: Date.now}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;