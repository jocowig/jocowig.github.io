var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var candyItemsSchema = new Schema({
	id	:	ObjectId,
	company	:	String,
	web_address	: String,
	candy_one	: String,
	candy_two	: String,
	candy_three	: String
});

var candyItemsModel = mongoose.model('candyItems', candyItemsSchema);

module.exports = candyItemsModel;
