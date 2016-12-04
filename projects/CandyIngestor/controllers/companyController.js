var helpers = require('../config/helperFunctions.js');
var companyModel = require('../models/companyModel.js');
var candyItemsModel = require('../models/candyItemsModel.js');

module.exports = function(server){

	server.get('/company', function(req, res, next){
		companyModel.find({}, function(err, company){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching company from database');
			}
			if (company === null){
				helpers.failure(res, next, 'The specified company could not be found', 404);
			}
			helpers.success(res, next, company);
		});
	});
	
	server.get('/company/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(!errors){
			companyModel.findOne({ _id: req.params.id}, function(err, company){
				if (err){
					helpers.failure(res, next, 'Something went wrong fetching company from database');
				}
				if (company === null){
					helpers.failure(res, next, 'The specified company could not be found', 404);
				}
				helpers.success(res, next, company);
			});
		}
	});

	server.post('/company', function(req, res, next){
		req.assert('company', 'company name is required')
			.notEmpty();
		req.assert('web_address', 'Web address is required and must be either .com, .tv, or .org')
			.notEmpty()
			.isUrl()
			.contains('http://')
			.contains('.com');
		var errors = req.validationErrors();
		var company = new companyModel();
		var candyItems = new candyItemsModel();
		company.first_name = req.params.first_name;
		company.last_name = req.params.last_name;
		company.email = req.params.email;
		company.ip_address = req.params.ip_address;
		company.company = req.params.company;
		company.web_address = req.params.web_address;
		company.phone_number = req.params.phone_number;
		company.date = req.params.date;
		candyItems.company = req.params.company;
		candyItems.web_address = req.params.web_address;
		candyItems.candy_one = req.params.candy_one;
		candyItems.candy_two = req.params.candy_two;
		candyItems.candy_three = req.params.candy_three;
		company.save(function(err){
			if(err){
				helpers.failure(res, next, errors, 500);
			}
			helpers.success(res, company);
		});
		candyItems.save(function(err){
			if(err){
				helpers.failure(res, next, errors, 500);
			}
			helpers.success(res, next, candyItems);
		});
	});

	server.put('/company/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors, 400);
		}
		companyModel.findOne({ _id: req.params.id}, function(err, company){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching company from database');
			}
			if (company === null){
				helpers.failure(res, next, 'The specified company could not be found', 404);
			}
			var updates = req.params;
			delete updates.id;
			for(var field in updates){
				company[field] = updates[field]
			}
			company.save(function(err){
				helpers.failure(res, next, 'Error updating company', 500);
			});
			helpers.success(res, next, company);
		});
	});

	server.del('/company/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors, 400);
		}
		companyModel.findOne({ _id: req.params.id}, function(err, company){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching company from database');
			}
			if (company === null){
				helpers.failure(res, next, 'The specified company could not be found', 404);
			}
			company.remove(function(err){
				helpers.failure(res, next, 'Error deleting company', 500);
			});
			helpers.success(res, next, company);
		});
	});
}