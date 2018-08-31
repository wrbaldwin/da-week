Visualization with Amazon QuickSight
Hands-on Lab

In this lab exercise, you will set up a QuickSight account, then visualize the data you entered in the “Using Redshift” Hands-on Lab. You will need a Mac or Windows computer with a Firefox or Chrome browser.

1.	Set up your QuickSight Account
•	From the AWS Console, choose the QuickSight service
•	Choose Sign Up for Quicksight
•	Select Standard edition, then choose Continue
•	In the QuickSight account name box, type myQuickSight
•	In the Notification email address box, type your email address
•	Select the AWS region assigned by your instructor
•	Be sure the boxes are checked for “Enable autodiscovery of data and users in your Amazon Redshift, Amazon RDS and AWS IAM services.” And “Amazon Athena”
•	Choose Finish
•	Once the account is created, view the welcome screens

2.	Create an analysis from your Redshift data
•	Choose New Analysis, then New Data Set
•	Select Redshift Auto-discovered
•	In the New Redshift data source panel, enter:
•	Data source name = myRedshiftData
•	Instance ID = examplecluster
•	Database name = dev
•	Username = masteruser
•	Password = <<the password you created for Redshft>>
•	Choose Create data source
•	In the Choose your table panel, select none of the tables and choose Edit/Preview Data
 
•	Create a new dataset with sales by date
•	Delete any tables shown, then add the date and sales tables
•	Click on the join (two red circles), then configure an inner join that uses date.dateid and sales.dateid, then choose Apply
•	Name the dataset salesByDate, then choose Save & Visualize

3.	Visualize sales by date
•	In the Visual Types pane, choose a Vertical bar chart
•	Assign caldate to the x-axis and qtysold(sum) to the y-axis
•	Explore the visualization of your data
•	Choose Share, then create a shared dashboard

4.	Create more visualizations
•	Add new datasets and visualizations to your dashboard. Can you show top buyers by last name? Top events by sales?
[Hint: see the queries from the Using Redshift lab to identify the right tables and fields.]

