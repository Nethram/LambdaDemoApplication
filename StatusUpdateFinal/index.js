// welcome to Lambda Demo Application
// The followings are the code for Updating status.

//loading required modules;
console.log('Loading function');
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
//This handler will invok after receiving the event with username,password and status
exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var username=event.name;
    var password=event.password;
    var conn = mysql.createConnection({
	  host      :  'endpoint' ,  // RDS endpoint 
      user      :  'username' , 
      ssl		:  'Amazon RDS', // MySQL username 
      password  :  'password' ,  // MySQL password 
      database  :  'databasename' 
	});
	conn.connect(function(err) {  // creating database connection
  		if (err) {
	    console.error('error connecting: ' + err.stack); // on error
		return;
		}
	    console.log('connected as id ' + conn.threadId);
	});
	var sql='SELECT * FROM login WHERE name = "'+username+'"';  // set query for selecting the given user detais from the table
	var result =conn.query ( sql ,   function(error	, rows, fields){ // querying database.
        if (error) {
            console.log(error.message); // on error
            console.log("The user does't exit");
            console.succeed("The user does't exit.. please create an account");
            throw error;
        } 
        else {	
        	if(typeof rows[0] != 'undefined'){  // if the usercredentials matches with database contents
		        console.log("Found the userdata");
		        console.log('Names are: ', rows[0].id ,rows[0].name ,rows[0].password);
		        if(event.password != rows[0].password){
		       		 console.log("incorrect password");
		       		 readModuleFile('./incorrect.txt', function (err, incorrect) {
			             var resp = incorrect;
			             context.succeed({"respon":incorrect});
					 });
		       	} 
		       	var row_id = rows[0].id;
		        var name = rows[0].name;
		        var status = event.status;
		        dynamo.putItem({  // add status to the DynamoDB table.
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
				        readModuleFile('./success.txt', function (err, success) {
			                var resp = success;
			                var last= "</h1></div></body></html>";
				   		    var reslt= resp+" "+event.name+",Your Status successfully updated</h3></br><h1> Status: "+event.status+last;
			                context.succeed({"respon":reslt}); // returning HTML page on successful updation of status
						});
				    }
				 }
			    );
		    }
		    else{
		        console.log("The user does't exit here"); // an error occured
		        readModuleFile('./notexist.txt', function (err, not) {
			        var res = not;
			        context.succeed({"respon":res}); // returning HTML page on error occuring.
				});
		    }
        }
    });
         
   

};