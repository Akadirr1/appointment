const mongoose = require('mongoose');

const Barberschema = new mongoose.Schema(
	{
		name : {type: String, required: true},
		email: {type: String, required: true},
		phone: {type: String},

		workingHours:{
			monday:{start: String,end:String},
			tuesday:{start: String,end:String},
			wednesday:{start: String,end:String},
			thursday:{start: String,end:String},
			friday:{start: String,end:String},
			saturday:{start: String,end:String},
			sunday:{start: String,end:String}
		}
	},
	{timestamps:true}
)

module.exports = mongoose.model('Barber', Barberschema);