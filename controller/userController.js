const userSchema = require("../model/userModel")
const bcrypt = require('bcrypt')
const saltRound = 10;

const homeValidate = (req, res) => {
  if (req.session.user) {
    res.redirect("/user/home")
  } else {
    res.redirect("/user/login")
  }
}

const loadRegister = (req, res) => {
  res.render('user/register')
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (user) {
      return res.render('user/register', { message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const newUser = new userSchema({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    req.session.user = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name
    };
    res.redirect('/user/home');
  } catch (error) {
    res.render('user/register', { message: 'Something went wrong' });
  }
};

const loadLogin = (req, res) => {
  res.render('user/login')
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.render('user/login', { message: 'User does not exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('user/login', { message: 'Incorrect password' });
    }
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    res.redirect('/user/home');

  } catch (error) {
    res.render('user/login', { message: 'Something went wrong' });
  }
};

const loadHome = (req, res) => {
  let name = req.session.user?.name;
  res.render('user/home', { username: name });
}

const logout = (req, res) => {
  req.session.user = null;
  res.redirect('/user/login')
}

const details = (req,res)=>{
  const {name , email} =req.session.user;
  // res.send(name+email)
  // res.send("<p>"+name+" "+email+"</p>")
  res.render("user/details",{name:name,email:email})
}

module.exports = {
  registerUser,
  loadRegister,
  loadLogin,
  login,
  loadHome,
  logout,
  homeValidate,
  details
}

