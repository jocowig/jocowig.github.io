var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var companySchema = new Schema({
	id	:	ObjectId,
	first_name	:	String,
	last_name	:	String,
	email	:	String,
	ip_address	:	String,
	company	:	String,
	web_address	: String,
	phone_number	:	String,
	date	:	Date
});

var companyModel = mongoose.model('company', companySchema);

module.exports = companyModel;
