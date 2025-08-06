const adminModel = require('../model/adminModel')
const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')

const loadLogin = (req, res) => {
    res.render('admin/login')
}

const Login = async (req, res) => {
    try {
        const { name, password } = req.body
        const admin = await adminModel.findOne({name})
        if (!admin) {
            return res.render('admin/login', { message: 'invalid Credentials' })
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin/login', { message: 'Invalid Credentials' })
        }

        req.session.admin = true;
        res.redirect('/admin/dashboard')
    } catch (error) {
        res.send(error)
    }
}

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin
        if (!admin) return res.redirect('/admin/login')

        const users = await userModel.find({})
        res.render('admin/dashboard', { users })
    } catch (error) {
    }
}

const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;

        const updateData = { name, email };

        if (password && password.trim() !== '') {
            const hashed = await bcrypt.hash(password, 10);
            updateData.password = hashed;
        }

        await userModel.findByIdAndUpdate(userId, updateData);
        res.redirect('/admin/dashboard');
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await userModel.findByIdAndDelete(userId);
        res.json({success: true});
    } catch (err) {
        res.json({success: false, message: "Failed to delete user"});
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send("User already exists with this email");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Add user failed:', err);
        res.status(500).send('Something went wrong while adding user');
    }
};

const logout = async (req,res) =>{
    req.session.admin = null;
    res.redirect('/admin/login')
}

const searchUser = async (req,res)=>{
    try {
        const searchQuery = req.body.search.trim();
        const users = await userModel.find({
            $or:[
                {name:{$regex:searchQuery,$options:'i'}},
                {email:{$regex:searchQuery,$options:'i'}}
            ]
        });

        res.render('admin/dashboard',{users});

    } catch (error) { 
        console.error("Search User Error :",error);
        res.status(500).render('admin/dashboard',{mgs:"Error while searching user"});
    }
}



module.exports = {
    loadLogin,
    Login,
    loadDashboard,
    editUser,
    deleteUser,
    addUser,
    logout,
    searchUser
}