const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
const port = 8000;

//เก็บuser
let users = []
let counter = 1

/*
Get /users สำหรับดึงข้อมูล user ทั้งหมด
*/

// path = GET /users
app.get('/users', (req, res) => {
    res.json(users);
})

// path = POST /user
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: "User created",
        user: user
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

app.listen(port, (req, res) => {
    console.log('Server is running on port' + port);
});