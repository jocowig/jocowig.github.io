var restify = require('restify');
var	port = process.env.PORT || 3000;	
var server = restify.createServer({name: 'candy Ingestor'});
var setupController = require('./controllers/setupController.js');
var companyController = require('./controllers/companyController.js');
var candyItemsController = require('./controllers/candyItemsController.js');
var restifyValidator = require('restify-validator');
var mongoose = require('mongoose');
var config = require('./config/dbConnection.js');
var companyModel = require('./models/companyModel.js');
var fs = require('fs');

mongoose.connect(config.getMongoConnection());
setupController(server, restify, restifyValidator);
companyController(server);
candyItemsController(server);



server.listen(port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

server.get(/\/?.*/, restify.serveStatic({
		default: 'index.html',
		directory: './views'
	}));

server.get('/', function indexHTML(req, res, next) {
   	companyModel.find({}, function(err, company){
		if (err){
			helpers.failure(res, next, 'Something went wrong fetching companies from database');
		}
		if (company === null){
			helpers.failure(res, next, 'The specified company could not be found', 404);
		}
		fs.readFile(__dirname + '/index.html', function (err, company) {
			if (err) {
				next(err);
				return;
			}

			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end(company);
			next();
		});
	});
});
