var helpers = require('../config/helperFunctions.js');
var candyItemsModel = require('../models/candyItemsModel.js');

module.exports = function(server){

	server.get('/candyItems/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors, 400);
		}
		candyItemsModel.findOne({ _id: req.params.id}, function(err, candyItems){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching candyItems from database');
			}
			if (candyItems === null){
				helpers.failure(res, next, 'The specified candyItems could not be found', 404);
			}
			helpers.success(res, next, candyItems);
		});
	});

	server.put('/candyItems/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors, 400);
		}
		candyItemsModel.findOne({ _id: req.params.id}, function(err, candyItems){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching candyItems from database');
			}
			if (candyItems === null){
				helpers.failure(res, next, 'The specified candyItems could not be found', 404);
			}
			var updates = req.params;
			delete updates.id;
			for(var field in updates){
				candyItems[field] = updates[field]
			}
			candyItems.save(function(err){
				helpers.failure(res, next, 'Error updating candyItems', 500);
			});
			helpers.success(res, next, candyItems);
		});
	});

	server.del('/candyItems/:id', function(req, res, next){
		req.assert('id', 'Id is required').notEmpty();
		var errors = req.validationErrors();
		if(errors){
			helpers.failure(res, next, errors, 400);
		}
		candyItemsModel.findOne({ _id: req.params.id}, function(err, candyItems){
			if (err){
				helpers.failure(res, next, 'Something went wrong fetching candyItems from database');
			}
			if (candyItems === null){
				helpers.failure(res, next, 'The specified candyItems could not be found', 404);
			}
			candyItems.remove(function(err){
				helpers.failure(res, next, 'Error deleting candyItems', 500);
			});
			helpers.success(res, next, candyItems);
		});
	});
}