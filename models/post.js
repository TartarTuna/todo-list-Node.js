const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '姓名未填寫']
    },
    tags: [
      {
        type: String,
        required: [true, 'tags 未填寫']
      }
    ],
    type: {
      type: String,
      enum: ['group', 'person'],
      required: [true, 'type 未填寫']
    },
    image: {
      type: String,
      default: ''
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post