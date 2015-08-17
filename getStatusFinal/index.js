// welcome to Lambda Demo Application
// The followings are the code for returning all user status

//loading required modules;
console.log('Loading function');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var fs = require('fs');
var mysql= require('mysql');
//define a function to read content of a sting and store it to a variable. Here path defines the filepath which contains HTML info
function readModuleFile(path, callback){
   try{
      var filename = require.resolve(path);
      fs.readFile(filename, 'utf8', callback);
   } 
   catch(e){
       callback(e);
   }
}
//This handler will invok after receiving the event with username and password
exports.handler = function(event, context) {
   console.log('Received event:', JSON.stringify(event, null, 2));
   var username=event.name; //which contains the username that entered from the web UI
   var password=event.password;	// which is passwords
   var conn = mysql.createConnection({
	  host      :  'endpoin' ,  // Enter your RDS endpoint address here
      user      :  'username' , // Enter your MySQL username here
      ssl		:  'Amazon RDS', 
      password  :  'password' ,  // MySQL password 
      database  :  'databasename' // give your database name here
   });
   conn.connect(function(err) {   // connecting to database
      if (err) {
			     console.error('error connecting: ' + err.stack);
			     return;
	  }
	  console.log('connected as id ' + conn.threadId);
		 //console.log(conn);
   });
   var sql='SELECT * FROM login WHERE name = "'+username+'"';  // set query  selecting the row with given username
   var result =conn.query ( sql ,   function(error	, rows, fields){  // querying this database
      if (error){
         console.log(error.message); // if error occured during connection 
         console.log("The user does't exit");
         console.succeed("The user does't exit.. please create an account");
         throw error;
      } 
      else {	// after successful connection
         if(typeof rows[0] != 'undefined'){ // finding the given users in table
    	    console.log("Found the userdata");
    	    if(event.password != rows[0].password){ // check paassword matching
       		 	console.log("incorrect password");
       		 	readModuleFile('./incorrect.txt', function (err, incorrect) {
	            var resp = incorrect;
	            context.succeed({"respon":incorrect});   // Echoing HTML file which entering incorect user credentials.
				});
			}
   		    var row_id = rows[0].id;
   		    var name = rows[0].name;
   		    var sql ="SELECT * FROM login";
		    var result =conn.query ( sql ,   function(error	, rows, fields){ // querying for selecting every row details of the Table.
			   if (error) {
			      console.log(error.message);
			         throw error;
			   }
		       else{
			      console.log("row details",rows);
			      details=[];
			      name_detail=[];
			      tail=" "; 
			     // res='<html><body><h1>status<h1></br></br>';
				  rows.forEach(function(row){
				     console.log("my Id id :"+row.id);
				      i=0;	
				     rowID=row.id;				           			 
					 var params = {
                        "TableName": "status",
                        "Key": 
                        {"UserId":row.id}
                     };
					 dynamo.getItem(params, function(err, data) {  // Receiving items from dynamoDB table
				        if (err) {
				           console.log(err); // an error occurred
				           context.succeed(err);
				        } 
					    else {
					       console.log("The data is :",data); // successful response
					      //res.send(data);
					       i++;
					       console.log("value of i:",i);
					       details[rowID]=data.Item.status;
					       name_detail[rowID]=data.Item.name;
					       console.log("the status to be printed",details[rowID]);
					       console.log("The length of details array is:",details.length);
					       tail=tail+"<tr><td><h4>"+name_detail[rowID]+"</h4></td><td><h4>"+details[rowID]+"</h4></td></tr>";	
					       console.log("the raw length =",rows.length);
					       console.log("the current  raw ",row.length);
					       if(i>=rows.length){
					        	readModuleFile('./success.txt', function (err, success) {
					            var res = success;
					          	lastres=res+tail+"</tbody></table></div></body></html>"; // returning html page while success.
				         	    context.succeed({"respon":lastres}); 
								});
					       }
					    }
					 });
				
				  });				        
			   }
		    });
	     }
	     else{
	     	console.log("The user does't exit here ok");
			readModuleFile('./notexist.txt', function (err, not) {
            	var rest = not;
            	context.succeed({"respon":rest});  //returnig HTML while error occured.
		 	});	     	
	     }	     		       		 
      }
   });     		 
}