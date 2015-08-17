// welcome to Lambda Demo Application
// The followings are the code for creating user account.

//loading required modules;
console.log('Loading function');
// Req
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var fs = require('fs');
var mysql= require('mysql');
//define a function to read content of a sting and store it to a variable. Here path defines the filepath which contains HTML info
function readModuleFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}
//This handler will invok after receiving the event with username and password
exports.handler = function(event, context) {
	console.log('Received event:', JSON.stringify(event, null, 2));
	var username=event.name; //which contains the username that entered from the web UI
	var password=event.password; // which is passwords
	var conn = mysql.createConnection({
	    host      :  ' RDS endpoint' ,  // give your RDS endpoint  here
	    user      :  'user' ,  // Enter your  MySQL username
	    ssl		  :  'Amazon RDS', 
	    password  :  'password' ,  // Enter your  MySQL password 
	    database  :  'database_name'    // Enter your  MySQL database name.
	});
	conn.connect(function(err) {    // connecting to database
	    if (err) {
		    console.error('error connecting: ' + err.stack);
		    return;
		}
		console.log('connected as id ' + conn.threadId);	 //console.log(conn);
	});
	var sql='INSERT INTO login (name,password) VALUES("'+username+'","'+password+'")'; // set query for inserting userame and password in database
	var result =conn.query ( sql ,   function(error,info) {  // querying the database
	    if (error) {
	        console.log(error.message);
	        if(error.errno==1062)
	        console.log("already exists");
	        readModuleFile('./unsuccessful.txt', function (err, alreadyexit) {
	            var resp = alreadyexit;
	            context.succeed({"respon":resp}); // echoing HTML page on failure
		    });   	
	    } 
	    else {
	    	console.log("trying to add the no status");		
	   	    var row_id = info.insertId;
	   	    console.log("the info contains:",info);
	   	    console.log("the row_id:",info.insertId);
		    var name = event.name;
	  		var status ="No Status";
		    dynamo.putItem({       // adding the user status in the DynamoDB table.
		    	"TableName":"status",
		       	"Item":{
		            "UserId":row_id,
		            "name": name,
		            "status":status,
		        }
		    },
		    function(err, data){
				    if (err) {
				        console.log(err); // an error occurred
				    } 
				    else {
				        console.log(data);
				        console.log("Status updated");
	        	        readModuleFile('./successful.txt', function (err, added) {
	   				        var res = added;
	                        console.log('success');  
	                        console.log("insert values in to database:",result.sql);
	                        context.succeed({"respon":res}); // echoing the HTML page on success
				        });
	                }  
	         });
	    }
	});
}