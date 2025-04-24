const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) =>{
	const { name, email, password } = req.body;

	try {
		const existingUser = await User.findOne({email});
		if(existingUser){
			return res.status(400).json({message: 'This email already registered'});
		}

		const hashedPassword = await bcrypt.hash(password,10);
		const newUser = new User({name,email,password:hashedPassword});
		await newUser.save();

		return res.status(200).json({messaga : 'Register is succesful'});
	}
	catch(err){
		res.status(500).json({ message: 'Server error' });
	}
})

router.post('/login',async (req,res)=>{
	const {email, password} = req.body;

	try {
		const user = await User.findOne({email});
		if(!user){
			return res.status(400).json({ message: 'Kullanici bulunamadı' });
		}

		const isMatch = await bcrypt.compare(password,user.password);
		if(!isMatch){
			return res.status(400).json({ message: 'Sifre Hatali' });
		}
		const token = jwt.sign({userId: user._id}, 'your-secret-key',{ expiresIn: '1h' });
		res.json({token,user:{id: user._id,name: user.name,email: user.email}});
	} catch (err) {
		res.status(500).json({ message: 'Server error' });

	}
})
router.get('/profile',async (req,res)=>{
	const token=req.headers['authorization'].split(' ')[1];

	try {
		const decoded= jwt.verify(token,'your-secret-key');
		const user = await User.findById(decoded.userId);
		res.json( { user:{id: user._id,name : user.name, email: user.email} } )
	} catch (err) {
		res.status(401).json({ message: 'Giris basarisiz!!!' });
	}
})





module.exports = router;
