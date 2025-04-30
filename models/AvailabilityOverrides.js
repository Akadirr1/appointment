const { text } = require('express');
const mongoose = require('mongoose');

const AvailabilityOverrideSchema  = new mongoose.Schema(
	{
		barber :
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Barber',
			required: true,
			index: true
		},
		date:
		{
			type: Date,
			required: true
		},
		isWorking:
		{
			type:Boolean,
			required:true
		},
		startTime:
		{
			type: Text,
			validate:{
				validator: function(value){
					if(this.isWorking)
					{
						if(value.length>0){
							return true;
						}
						else
						{
							return false;
						}
					}
					else{
						return true
					}
				}
			}
		}
	}
)