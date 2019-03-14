# Introduction 
 
This guide will help you set up the lab environment for the Real-Time Clickstream Anomaly Detection Amazon Kinesis Data Analytics lab. 
 
The AWS CloudFormation template Kinesis_Pre_Lab.json included with this lab deploys the following architecture without the highlighted components. You will set up the highlighted components manually. 
 
After you deploy the CloudFormation template, sign into your account to view the following resources: 
 
•	Two Amazon Simple Storage Service (Amazon S3) buckets:You will use these buckets to persist raw and processed data. 

•	One AWS Lambda function: This Lambda function will be triggered once an anomaly has been detected. 

•	Amazon Simple Notification Service (Amazon SNS) topic with an email and phone number subscribed to it: The Lambda function will publish to this topic once an anomaly has been detected. 

•	Amazon Cognito User credentials: You will use these user credentials to log into the Kinesis Data Generator to send records to our Amazon Kinesis Data Firehose. 

 
![Image of](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image001.jpg)
 
## Download Lab Files
Download the lab files to your machine from here https://github.com/wrbaldwin/da-week/tree/master/Labs/Analyzing-Data-Streams-Lab-Files. You will be using them in different steps in the lab.

Kinesis_Pre_Lab.json: CloudFormation template

anomaly_detection.sql: Anomaly detection SQL code

anomaly_detection_lambda.js: Anomaly Detection Lambda function


# CloudFormation Stack Deployment 
 
**Make sure you are in US-WEST-2 (Oregon) region** 
 
1.	In your AWS account, navigate to the CloudFormation console.  
2.	On the CloudFormation console, Click  Create new Stack. 
 
![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image003.jpg) 
 
3.	In the Select Template section, select Upload a template to Amazon S3. Then, browse to your Kinesis_Pre_Lab.json file provided with your lab package.

 
  
 ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image005.jpg)
 
 
 
 
 
 
 
4.	Click Next at the bottom of the select template page in as shown in above screenshot. 
5.	In the Specify Details section, for Stack name, type kinesis-pre-lab. 
6.	In the Parameters section, fill the following fields: 

 •	Username: This is your username to login to the Kinesis Data Generator 

 •	Password: This is your password for the Kinesis Data Generator. The password must be at least 6 alpha-numeric characters and contain at least one number and a capital letter. 

 •	Email: Type an email address that you can access. The SNS topic sends a confirmation to this address.  

 •	SMS: Type a phone number (+1XXXXXXXXX) where you can receive texts from the SNS topic. 

 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image007.jpg)
 
7.	In the Options, section, keep the default values. 
8.	In the Review section, select the check box marked I acknowledge that AWS CloudFormation might create IAM resources.  
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image009.jpg)
 
9.	Click Create. CloudFormation redirects you to your existing stacks. The kinesis-pre-lab displays a CREATE_IN_PROGESS status.  
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image011.jpg)
 
10.	Once your stack is deployed, click the Outputs tab to view more information: 
•	KinesisDataGeneratorUrl: This value is the Kinesis Data Generator (KDG) URL.  
•	RawBucketName – Store raw data coming from KDG. 
•	ProcessedBucketName – Store transformed data  
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image013.jpg)
 
Congratulations! You are all done with the CloudFormation deployment. 
 
 
 
 
## Set up the Amazon Kinesis Data Generator 
 
On the Outputs tab, notice the Kinesis Data Generator URL. Navigate to this URL to login into the Amazon Kinesis Data Generator (Amazon KDG). 
 
The KDG simplifies the task of generating data and sending it to Amazon Kinesis. The tool provides a user friendly UI that runs directly in your browser. With the KDG, you can do the following tasks: 

•	Create templates that represent records for your specific use cases 

•	Populate the templates with fixed data or random data 

•	Save the templates for future use 

•	Continuously send thousands of records per second to your Amazon Kinesis stream or Firehose delivery stream 

 
Let’s test your Cognito user in the Kinesis Data Generator.  

1.	On the Outputs tab, click the KinesisDataGeneratorUrl. 
 
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image015.jpg)
   
2.	Sign in using the username and password you entered in the CloudFormation console. 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image017.jpg)
 
3.	After you sign in, you should see the KDG console. You need to set up some templates to mimic the clickstream web payload. 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image019.jpg)
 
Create the following templates but don’t click on Send Data yet. We will do that during main lab: 
a. Schema Discovery Payload 
{"browseraction":"DiscoveryKinesisTest", "site": "yourwebsiteurl.domain.com"}  b. Click Payload 
{"browseraction":"Click", "site": "yourwebsiteurl.domain.com"} 
c. Impression Payload 
{"browseraction":"Impression", "site": "yourwebsiteurl.domain.com"} 
 
Note that your Kinesis Data Firehose has been deployed in US-WEST-2. 
 
Your Amazon Kinesis Data Generator console should look similar to this example. 
 
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image021.jpg)
 
 
## Set up Email and SMS Subscription
 
1.	Go to the SNS service in the AWS console
2.	On the Amazon SNS navigation menu, select Topics. An SNS topic named starting with kinesis-pre-lab-CSEClickStreamEvent-2 appears in the display.: 
 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image023.jpg)
 
 
3.	Click the topic name. The Topic details screen appears listing the e-mail/SMS subscription as pending confirmation. Make sure to take note of Topic ARN value because you need this value in next section. 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image025.jpg)
 
Note: Select corresponding subscription endpoint and Click Request confirmations to confirm your subscription for e-mail/SMS. Make sure to check your email junk folder for the request confirmation link . 
 
## Observe AWS Lambda Anomaly function: 
 
1.	In the console, navigate to AWS Lambda.  
2.	In the AWS Lambda navigation pane, select Functions.
3.	A Lambda function named starting with kinesis-pre-lab-CSEBeconAnomalyResponse appears in the Functions panel. 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image027.jpg)
 
4.	Click the function hyperlink.
5.	On the next page, scroll down to Function Code section. 
 
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image029.jpg)
 
 
6.	Go through the code in the Lambda code editor. Notice TopicArn value your recorded in Email/SMS subscription step. Lambda will send message to this topic and notify. 
 
7.	You can also analyze code from anomaly_detection_lambda.js provided with your lab package	 
## Set up an Analytics Pipeline Application 
 
**Make sure you are in US-WEST-2 (Oregon) region** 
 
1.	Navigate to the Amazon Kinesis console. 
2.	Click Get started and then click Create analytics application. 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image031.jpg)
 
3.	On the Create application page, fill the fields as follows: 
a.	For Application name, type anomaly-detection-application. 
b.	For Description, type a description for your application. 
c.	Leave “SQL” selected as Default. 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image033.jpg)
 
4.	Click Create application. 
 
 
 
 
5.	On the application page, click Connect streaming data. 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image035.jpg)
 
6.	Select Choose source, and make the following selections: 
a.	For Source, choose Kinesis Firehose delivery stream. 
b.	From Kinesis Firehose delivery stream dropdown, select the Firehose stream name starting with kinesis-pre-lab-FirehoseDeliveryStream. This is the Firehose Delivery Stream created via CloudFormation earlier.
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image037.jpg)
 
7.	In the Record pre-processing with AWS Lambda section, choose Disabled. 
8.	In the Access to chosen resources section, select Choose from IAM roles that Kinesis Analytics can assume. 
9.	In the IAM role box, search for the following role:  
<stack name>-CSEKinesisAnalyticsRole-<random string> 
 
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image039.jpg)
  
  
You have set up the Kinesis Data Analytics application to receive data from a Kinesis Data Firehose and to use an IAM role from the pre-lab. However, you need to start sending some data to the Kinesis Data Firehose before you click Discover schema in your application.  
 
Navigate to the Amazon Kinesis Data Generator (Amazon KDG) which you setup in prelab and start sending the Schema Discovery Payload at 1 record per second by click on Send data button. Make sure to select the region “us-west-2”  
 
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image041.jpg)
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image043.jpg)
 
  
 
Now that your Kinesis Data Firehose is receiving data, you can continue configuring the Kinesis Data Analytics Application. 
 
10.	In the console?, click Discover Schema. (Make sure your KDG is sending data to your Kinesis Data Firehose.) 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image045.jpg)
  
11.	Click Save and continue. Your Kinesis Data Analytics Application is created with an input stream. 
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image047.jpg)
  
Now, you can add some SQL queries to easily analyze the data that is being fed into the stream.  

12.	In the Real time analytics section, click Go to SQL editor. 

13.	Click on “Yes, start application” to start your kinesis analytics application. 

  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image049.jpg)
  
14.	Erase the placeholder text in the SQL editor
15.	Copy the contents of the file named ‘anomaly_detection.sql’ from your lab package and paste it into the SQL editor. 

 
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image051.jpg)
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image053.jpg)
 
  
16.	Click Save and run SQL. The analytics application starts and runs your SQL query. (You can find the SQL query in Appendix A.) 
 
To learn more about the SQL logic, see the Analytics application section in the following blog post: 
 https://aws.amazon.com/blogs/big-data/real-time-clickstream-anomaly-detection-withamazon-kinesis-analytics/ 
 

 
17.	On the Source data tab, observe the input stream data named “SOURCE_SQL_STREAM_001”. 
  
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image055.jpg)
 
If you click the Real-time analytics tab, you will notice multiple in-application streams You will populate data in these streams later in the lab.  

 ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image057.jpg)
  
## Connect Lambda as destination to Analytics Pipeline  
 
Now that the logic to detect anomalies is in the Kinesis Data Analytics application, you must. connect it to a destination (AWS Lambda function) to notify you when there is an anomaly.  
 
1.	Click the Destination tab and click Connect to a Destination.  
2.	For Destination, choose AWS Lambda function.  
3.	In the Deliver records to AWS Lambda section, make the following selections: 
a.	For Lambda function, choose CSEBeconAnomalyResponse.  
b.	For Lambda function version, choose $LATEST. 
4.	In the In-application stream section, make the following selections: 
a.	Select Choose an existing in-application stream. 
b.	For In-application stream name, chooseDESTINATION_SQL_STREAM 
c.	For Output format, choose: JSON. 
5.	In the Access to chosen resources section, make the following selections:  
a.	Select Choose from IAM roles that Kinesis Analytics can assume. 
b.	For IAM role, choose pre-lab-CSEKinesisAnalyticsRole-RANDOMSTRING. 
 
Your parameters should look like the following image. This configuration allows your Kinesis Data Analytics Application to invoke your anomaly Lambda function and notify you when any anomalies are detected. 
  
  
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image059.jpg)
   
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image061.jpg)
  
Now that all of the components are in place, you can test your analytics application. For this part of the lab, you will need to use your Kinesis Data Generator in three separate browser windows. You need to replicate the clickstream data, and each browser window will send a different payload in each request to your Kinesis Data Firehose stream. 
 
1.	Open your KDG in five separate browser windows and sign in as the same user. Note: Make sure to select the us-west2 region. Do not accept the default region.  
2.	In one of your browser windows, start sending the Impression payload at a rate of 1 record per second (keep this running). 
3.	On another browser window, start sending the Click payload at a rate of 1 record per second (keep this running). 
4.	On your last three browser windows, start sending the Click payload at a rate of 1 record per second for a period of 20 seconds.  
**If you did not receive an anomaly email, open another KDG window and send additional concurrent Click payloads. Make sure to not allow these functions to run for more than 10 to 20 seconds at a time. This could cause AWS Lambda to send you multiple emails due to the number of anomalies you are creating. 
 
You can monitor anomalies on the Real-time analytics tab in the DESTINATION_SQL_STREAM table. If an anomaly is detected, it displays in that table. 
 
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image063.jpg)
 
  
Make sure to click other streams and review the data. 
 
Once an anomaly has been detected in your application and you will receive an email and text message to the specified accounts. 
 
Email Snapshot: 
 
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image065.jpg)
 
  
SMS Snapshot: 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image067.jpg)
 
 
After you have completed the lab, click Actions > Stop Application to stop your application and avoid flood of SMS and e-mails messages. 
 
  ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image069.jpg)
 
  
## Environment Cleanup  
 
To save on cost, it is required to dispose your environment which you have created during this lab. Make sure to empty S3 buckets from console before following below steps:  
1.	In your AWS account, navigate to the CloudFormation console.  
2.	On the CloudFormation console, select stack which you have created during pre-lab. 
3.	Click on Action drop down and select delete stack as shown in below screenshot. 
 
    ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image071.jpg)
 
4.	As you created, Kinesis Analytics application manually, so need to delete it by selecting your analytics application . Click on Action drop down and select delete application 
 
   ![Image](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/ads/image073.jpg)
 
5.	Go the Cognito and delete the user pool that have been created. 
 

 
