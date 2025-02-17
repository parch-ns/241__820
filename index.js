const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

app.use(bodyParser.json());
const port = 8000;

//เก็บuser
let users = []
let conn = null

/*
Get /users สำหรับดึงข้อมูล user ทั้งหมด
POST /users สำหรับcreate user ใหม่บันทึกเข้าไป
GET /users/:id สำหรับดึงข้อมูล user ตาม id ที่ส่งมา
*/

// path = GET /users
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8830
    })
}

/*
app.get('/testdb-new', async (req, res) => {
    try{
            const result = await conn.query('SELECT * FROM users')
            res.json(result[0])
        } catch (error) {
            console.log('Error fetching users:', error.message);
            res.status(500).json({error: 'Error fetching users'})
    }
})
*/

// path = GET /users สำหรับ get users ทั้งหมด  
app.get('/users', async (req, res) => {
    const result = await conn.query('SELECT * FROM users')
    res.json(result[0])
})

// path = POST /user สำหรับ create users ทั้งหมด
app.post('/user', async (req, res) => {
    let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', user)
    console.log('results', results)
    res.json({
        message: "User created",
        data: results[0]
    });
})

//path = PUT /user/:id
app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    //หาuserจากidที่ส่งมา
    let selectedIndex = users.findIndex(user =>user.id == id )
    //update user
    if(updateUser.firstname){
        users[selectedIndex].firstname = updateUser.firstname
    }

    if(updateUser.lastname){
        users[selectedIndex].lastname = updateUser.lastname
    }

    res.json({
        message: "User updated",
        data :{
            user: updateUser,
            indexUpdate: selectedIndex
        }
    });
    //ส่งข้อมูล user ที่update กลับเข้าที่เดิม
    
})

//path = DELETE /user/:id
app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id)
    
    users.splice(selectedIndex, 1)
    res.json({
        message: "Delete Completed",
        indexedDeleted: selectedIndex
    });
})

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log('Server is running on port' + port);
});