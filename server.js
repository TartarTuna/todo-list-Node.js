const http = require('http')
const Post = require('./models/post.js')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const errorHandler = require('./errorHandler.js')

dotenv.config({ path: "./config.env" })
// console.log(process.env.PORT)

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

// const testPost = new Post(
//   { 
//     name: '豪華雙人房5',
//     price: 4000,
//     rating: 4.3
//   }
// )

// testPost.save()
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

  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find()
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      'status': 'success',
      posts
    }))
    res.end()
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const newPost = await Post.create(
          {
            title: data.title,
            image: data.image,
          }
        )
        res.writeHead(200, headers)
        res.write(JSON.stringify({
          'status': 'success',
          'posts': newPost
        }))
        res.end()
      } catch (err) {
        errorHandler(res, err)
      }
    })
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    await Post.deleteMany({})
    res.writeHead(200, headers)
    res.write(JSON.stringify({
      'status': 'success',
      posts: []
    }))
    res.end()
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    try {
      const id = req.url.split('/').pop()
      await Post.findByIdAndDelete(id)

      res.writeHead(200, headers)
      res.write(JSON.stringify({
        'status': 'success',
        posts: []
      }))
      res.end()
    } catch (err) {
      errorHandler(res, err)
    }
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop()
        const data = JSON.parse(body)

        const newPost = await Post.findByIdAndUpdate(
          id,
          {
            title: data.title,
            image: data.image,
          },
          { new: true }
        )
        res.writeHead(200, headers)
        res.write(
          JSON.stringify({
            status: "success",
            data: newPost,
          })
        )
      } catch (err) {
        errorHandler(res, err)
      }
    })
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