const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req,res,next)=>{
	const token = req.headers['authorization']?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Token required' });
	  }
	try {
		const decoded=jwt.verify(token,'your-secret-key');
		const user = await User.findById(decoded.userId);
		if(!user){
			return res.status(401).json({ message: 'User not found' });
		}
		req.user = user;
		next();

	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}
module.exports = authenticateUser;
