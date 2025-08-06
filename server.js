const express = require('express');
const app = express()
const dotenv = require("dotenv");
dotenv.config()
const PORT = process.env.PORT || 5000;

const connectDB = require('./DB/connectDB');
const path = require('path')
const {homeValidate} =  require("./controller/userController")

const session = require('express-session');
const nocache = require('nocache')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')

const hbs = require('hbs'); 
app.set('view engine', 'hbs');
hbs.registerHelper('increment', function (value) {
    return parseInt(value) + 1;
});
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(nocache())
app.use(session({
  secret: 'myrSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, 
    httpOnly: true
  }
}));

app.get("/",homeValidate)

app.use("/user", userRoutes)
app.use('/admin', adminRoutes)



connectDB()
app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`);

})