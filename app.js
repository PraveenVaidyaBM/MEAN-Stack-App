const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const jsonwebtoken = require('jsonwebtoken')
const passport = require('passport')
const mongoose = require('mongoose')
const config=require('./config/database.js')
const users =require('./routes/users')

const app = express()

const port =3000;

mongoose.connect(config.database);

mongoose.connection.on('connected',()=>{
    console.log(`connected to database ${config.database}`)
})

mongoose.connection.on('error',(err)=>{
    console.log('database error',err)
})

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use('/users', users);

app.get('/', (req, res) =>{
    res.send('invalid endpoint')
})

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname,'public/index.html'))
})

// app listening at http://localhost:3000
app.listen(port, () => {
    console.log(`server started at ${port}`)
})

