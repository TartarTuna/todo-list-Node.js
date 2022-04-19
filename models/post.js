const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title 未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    }
  },
  {
    versionKey: false
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post