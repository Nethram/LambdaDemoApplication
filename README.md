# LambdaDemoApplication

Cloud based demo application using AWS Lambda
=======
This document includes stepwise procedure for Building a completely scalable and reliable cloud based application using AWS Lambda without worrying about infrastructural needs. Which involves creating a web Interface for app, construct AWS Lambda function, configure APIs in Amazon API Gateway and invoke the application from web browser. 
 	This demo application has 3 functionalities. Those are- creating user account with username and password, update the user’s status and view every users status. With this application we are giving a complete overview of how to use AWS resource (such as DynamoDB and RDS) with Lambda and how to return an HTML page as response to every incoming request. Here we are using Amazon RDS for storing user’s account information and Amazon Dynamo DB for storing user’s status information. The web app is stored in Amazon S3. So you will be able to create an completely scalable application without worrying about Infrastructure and management requirements. All you have to do is just own an AWS account.
	Here we are going to create 3 lambda functions and invoke these functions from separate API endpoints. The Lambda functions are
	
o	CreateAccount : This function is used for create an account for user by receiving username and password for each user.	

o	UpdateStatus   : This function receives username, password and status from the user. And update the status after 		authentication.

o	GetAllStatus    : This function authenticates users and list status of every user.

>>>>>>> a1f45644ec509d632f7f2941e6288ee32f7d92cd
