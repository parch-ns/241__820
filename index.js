/*const http = require('http'); // Import Node.js core module

const host = 'localhost'; // Localhost
const port = 8000; // Port number

// เมื่อเปิด เว็บไปที่ http://localhost:8000/ จะเรียกใช้งาน function requireListener
const requireListener = function (req, res) {
  res.writeHead(200);
  res.end('My first server!');
}

const server = http.createServer(requireListener);
server.listen(port, host, () => {
          console.log(`Server is running on http://${host}:${port}`);
});*/

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 8000;

let users = []

let conn = null
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
  })
}

/*
app.get('/testdbnew', async (req, res) => {

  try {
      const result = await conn.query('SELECT * FROM users')
      res.json(result[0])
  } catch (error) {
      console.log('error', error.message)
      res.status(500).json({error: 'Error fetching users'})
  }
})
*/

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับดึง users รายคนออกมา
PUT /users/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทุกเข้าไป)
DELETE /users/:id สำหรับลบ users รายคน (ตาม id ที่บันทุกเข้าไป)
*/

//path: GET /users สำหรับแสดงข้อมูล user ทั้งหมดที่บันทึกไว้
app.get('/users', async (req, res) => {
  const result = await conn.query('SELECT * FROM users')
  res.json(result[0])
})

//path: POST /users ใช้สำหรับสร้างข้อมูล user ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
  try{
    let user = req.boby;
    const results = await conn.query('INSERT INTO users SET ?',user)
    res.json({
      message: 'User created',
      data: results[0]
    })
  } catch (error) {
    console.error('errorMessage',error.message)
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})

//path: GET /users/:id สำหรับดึง user รายคนออกมา
app.get('/users/:id', async(req, res) => {
  try{
      let id = req.params.id;
      const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
      if (results[0].length == 0) {
          throw {statusCode: 404, message: 'User not found'}
      }
      res.json(results[0][0])
  } catch (error) {
      console.error('errorMessage',error.message)
      let statusCode = error.statusCode || 500
      res.status(statusCode).json({
         message: 'something went wrong',
         errorMessage: error.message
      })
  }
})

//path: PUT /user/:id ใช้สำหรับแก้ไขข้อมูล user โดยใช้ id เป็นตัวระบุ
app.put('/user/:id', async(req, res) => {
  try{
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query(
      'UPDATE users SET ? WHERE id = ?',
      [updateUser, id]
    )
    res.json({
      message: 'Update User Completed',
      data: results[0]
    })
  } catch (error) {
    console.error('errorMessage',error.message)
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})

//path: DELETE /user/:id ใช้สำหรับลบข้อมูล user โดยใช้ id เป็นตัวระบุ
app.delete('/user/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('INSERT INTO users SET ?',user)
    res.json({
      message: 'User created',
      data: results[0]
    })
    } catch (error) {
      console.log('errorMessage',error.message)
      res.status(500).json({
        message: 'something went wrong',
        errorMessage: error.message
      })
    }
})

app.listen(port, async (req, res) => {
  await initMySQL()
  console.log('Http Server is running on port' + port);
});