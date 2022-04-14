const Room = require('./models/rooms.js')
const http = require('http')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:"./config.env"})
console.log(process.env.PORT)

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
  .then(() => {
    console.log('連線成功')
  })
  .catch(err => {
    console.log(err)
  })

// const testRoom = new Room(
//   { 
//     name: '豪華雙人房5',
//     price: 4000,
//     rating: 4.3
//   }
// )

// testRoom.save()
//   .then(() => {
//     console.log('新增資料成功')
//   })
//   .catch (err => {
//     console.log(err.errors.price)
//   })


const reqListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }

  let body = ''
  req.on('data', chunk => {
    body += chunk
  })

  if (req.url === '/rooms' && req.method === 'GET') {
    const rooms = await Room.find()
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      'status': 'success',
      rooms
    }))
    res.end()
  } else if (req.url === '/rooms' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const newRoom = await Room.create(
          {
            name: data.name,
            price: data.price,
            rating: data.rating
          }
        )
        res.writeHead(200, headers)
        res.write(JSON.stringify({
          'status': 'success',
          'rooms': newRoom
        }))
        res.end()
      } catch (err) {
        res.writeHead(404, headers)
        res.write(JSON.stringify({
          'status': 'false',
          'message': '欄位填寫錯誤或無此 ID',
          'error': err
        }))
        res.end()
      }
    })
  } else if (req.url === '/rooms' && req.method === 'DELETE') {
    await Room.deleteMany({})
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      'status': 'success',
      rooms: []
    }))
    res.end()
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers)
    res.end()
  } else {
    res.writeHead(404, headers)
    res.write(JSON.stringify({
      'status': 'false',
      'message': '無此路由'
    }))
    res.end()
  }
}

const server = http.createServer(reqListener)
server.listen(process.env.PORT)