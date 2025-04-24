const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
	{
		date: {type : String, required: true},
		time: {type: String, required: true},
		isFilled:{type: Boolean, default: false},
		user: {type: mongoose.Schema.Types.ObjectId, ref : 'User'},
		barber: {type: mongoose.Schema.Types.ObjectId, ref : 'Barber',required: true},
		service: {type:String ,required: true},
	},
	{
		timestamps: true
	}
)

module.exports = mongoose.model('Appointment',AppointmentSchema);