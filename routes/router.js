const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Barber = require('../models/Barber');
const Appointments = require('../models/Appointments');
const authenticateUser = require('../middleWares/authMiddleware');
const router = express.Router();

router.post('/register', async (req, res) =>{
	const { name, email, password } = req.body;
	const existingUser = await User.findOne({email});

	if(existingUser){
		return res.status(400).json('This email already registered');
	}
	try {
		const hashedPassword = await bcrypt.hash(password,10);
		const newUser = new User({name,email,password:hashedPassword});
		await newUser.save();

		return res.status(200).json('Register is succesful');
	}
	catch(err){
		console.error(err);
		res.status(500).json('Server error');
	}
})

router.post('/login',async (req,res)=>{
	const {email, password} = req.body;

	try {
		const user = await User.findOne({email});
		if(!user){
			return res.status(400).json('Kullanici bulunamadı');
		}
		const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch sonucu:", isMatch);

		if(!isMatch){
			console.log("giris basarisiz");
			return res.status(400);
		}
		console.log("giris basarili");
		const token = jwt.sign({userId: user._id}, 'your-secret-key',{ expiresIn: '1h' });
		res.json({token,user:{id: user._id,name: user.name,email: user.email}});
	} catch (err) {
		console.error(err);
		res.status(500).json('Server error');

	}
})
router.get('/profile',authenticateUser,async (req,res)=>{
	const user = req.user;
	console.log(`hoşgeldiniz ${user.name}`)
	res.json({ message: `Hoşgeldiniz ${user.name}`, user });
})


module.exports = router;
