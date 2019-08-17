// CONFIGURATION
const express = require("express")
const app = express()
app.set("view engine", "ejs");
//configuration to be able to parse request request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json());
//Specify which folder the stylesheets are contained in and js files
app.use(express.static(__dirname + '/public'));


//read json file
var fs = require("fs");
var readline = require('readline');
var stream = require('stream');
var instream = fs.createReadStream("public/data/traffic_bytes.json");
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

var data = [];
var filtered_data = [];

rl.on('line', function(line) {
	var data_line = JSON.parse(line);
  	data.push(data_line);
  	filtered_data.push(data_line);
});

rl.on('close', function() {
	//console.log(data.length);
});

//maintain the current filter status
var filters = [];





//ROUTES (render ejs pages in views folder here)
app.get("/", function(req, res){
	//console.log("filter and filtered data");
	//console.log(filters);
	//console.log(filtered_data);
	res.render("home", {data:filtered_data});
});


app.post('/update_filter', function(req, res){
	var filter = {};
	filter.ip = req.body.ip;
	filter.dir = req.body.dir;
	//console.log(req.body);
	if(req.body.clear==false){
		var new_data = [];
		filters.push(filter);
		for(let i=0; i<filtered_data.length; i++){
			if(filter.dir=="from" && filtered_data[i].result["All_Traffic.src"]==filter.ip){
				new_data.push(filtered_data[i]);
			}else if (filter.dir=="to" && filtered_data[i].result["All_Traffic.dest"]==filter.ip){
				new_data.push(filtered_data[i]);
			}
		}
		filtered_data = JSON.parse(JSON.stringify(new_data));
	}else{
		filters = [];
		filtered_data = JSON.parse(JSON.stringify(data));
	}
	res.send({data:filtered_data});
});


//START SERVER
app.set("port", process.env.PORT || 8080);
app.listen(app.get("port"), function(){
	console.log('Express server listening on port %d in %s mode: http://localhost:%s', app.get('port'), app.get('env'), app.get('port'));
}());
