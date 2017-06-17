var helpers = require('../config/helperFunctions.js');
var companyModel = require('../models/companyModel.js');
var candyItemsModel = require('../models/candyItemsModel.js');

module.exports = function(server){
	server.post('/csvFile', function(json, res, next){
		var csv = res.params.data;
		  var lines=csv.split("\n");

		  var result = [];

		  var headers=lines[0].split(",");

		  for(var i=1;i<lines.length;i++){

			  var obj = {};
			  var currentline=lines[i].split(",");

			  for(var j=0;j<headers.length;j++){
				  obj[headers[j]] = currentline[j];
			  }

			  result.push(obj);

		  }
		  var json = JSON.stringify(result); 
		json.assert('company', 'company name is jsonuired')
			.notEmpty();
		json.assert('web_address', 'Web address is jsonuired and must be either .com, .tv, or .org')
			.notEmpty()
			.isUrl()
			.contains('http://')
			.contains('.com');
		var errors = json.validationErrors();
		var company = new companyModel();
		var candyItems = new candyItemsModel();
		company.first_name = json.params.first_name;
		company.last_name = json.params.last_name;
		company.email = json.params.email;
		company.ip_address = json.params.ip_address;
		company.company = json.params.company;
		company.web_address = json.params.web_address;
		company.phone_number = json.params.phone_number;
		company.date = json.params.date;
		candyItems.company = json.params.company;
		candyItems.web_address = json.params.web_address;
		candyItems.candy_one = json.params.candy_one;
		candyItems.candy_two = json.params.candy_two;
		candyItems.candy_three = json.params.candy_three;
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
		}
	});
}