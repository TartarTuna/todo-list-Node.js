const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      cast: false,
      required: [true, '價格必填']
    },
    rating: Number,
    createAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false
  }
)

const Room = mongoose.model('Room', roomSchema)

module.exports = Room