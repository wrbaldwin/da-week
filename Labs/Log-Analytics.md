# Data Analytics Week at the AWS Loft

## Log Analytics 

This lab demonstrates the basic steps required to get started with Amazon Elasticsearch Service: creating clusters, cluster node configurations, storage configurations, and Identity Access Manager (IAM) Policies 


By the end of this lab you will be able to:
*	Deploy an Amazon Elasticsearch Service domain
*	Create an AWS CloudWatch Log Group
*	Subscribe an Amazon CloudWatch Log Group to Amazon Elasticsearch Service
*	Monitor Amazon Elasticsearch Cluster Metrics

Prerequisites
*	Some familiarity with IAM Roles and EC2 Instances is recommended. Previous knowledge of Kibana and Elasticsearch is desirable. 

*	Have installed node.js and aws-es-proxy (available via npm). If you are a Windows user and do not wish to install node.js you can also download the aws-es-proxy from github and use without node.js or npm.

*	Have correctly installed and configured the AWS command line interface. See [this documentation](https://aws.amazon.com/cli/) for instructions.

## **Create and Test an Amazon Elasticsearch Domain**

**Deploy an Amazon Elasticsearch Service Domain**

1.	In the AWS Management Console, click **Services**, then **Elasticsearch Service**
2.	Click **Create a new domain**, then use the follow to step through the wizard:

```
Elasticsearch domain name:      mytestdomain
Instance count:                 1
Instance type:                  t2.small.elasticsearch** (free tier eligible)
Enable dedicated master:        Unchecked
Enable zone awareness:          Unchecked
Storage type:                   EBS
EBS volume type:                General Purpose (SSD)
EBS volume size:                10
Automated snapshots start hour: 00:00 UTC (default)
Advanced options:               leave the values at the default settings
Network configuration:          Public Access
Kibana authentication:          unchecked
Access policy:                  Allow access to the domain from specific IP(s)
IP address:                     Your IP Address (in a new tab you can type My IP to find your IP address)

```

3.	Review the system configuration, and click **Confirm**.
__The service can take ten minutes to deploy. While waiting for the service to deploy, you can complete the steps in the next section.__

### **Create a CloudTrail Log Group for Amazon Elasticsearch Service**

1.	In the AWS Management Console, click **Services**, then **CloudTrail**
2.	Click **Create trail**
3.	Name the trail **mytestdomain-trail**
4.	Leave **Apply trail to all regions** set to **Yes**
5.	Leave **Management events** set to **All**
6.	Skip the **Data events** section
7.	Under **Storage location** type **mytestdomain-s3-{yourname}** as the **S3 Bucket** since S3 bucket names are globally unique.
8.	Skip the **Advanced** section
9.	Click **Create**
10.	You will be returned to the CloudTrail dashboard. Click **mytestdomain-trail** to open the configuration page
11.	Scroll down to the **CloudWatch Logs** section and expand
12.	Under CloudWatch Logs, click **Configure**
13.	In the **New or existing log group** text box, delete the existing text, and enter **CloudTrail/mytestdomain-trail**.
14.	Click **Continue**. This will bring you to the IAM console, to enable CloudTrail to write to CloudWatch Logs.
15.	Click **Allow**.
    Note: Wait until the console returns to the **CloudTrail Configuration** page. To generate more CloudTrail log data, view some of the different AWS Services, such as Amazon VPC, Amazon EC2, or any of the other services in the AWS Management Console. While CloudTrail generates these logs, they will be sent to your ElasticSearch Cluster.

### **Subscribe a CloudWatch Log Group to Amazon Elasticsearch Service**

1.	In the AWS Management Console, click **Services**, then **Elasticsearch Service**
__wait until the mytestdomain cluster Domain **status** changes to **Active**__
2.	In the AWS Management Console, click **Services**, then click **CloudWatch**
3.  Click **Logs** in the left navigation pane
4.	In the **Log Groups** page, tick the Log Group box you just created, **CloudTrail/mytestdomain-trail**
5.	Click the **Actions** drop-down list, and select **Stream to Amazon Elasticsearch Service**
6.	In the **Amazon ES Cluster** drop-down list, select the Amazon Elasticsearch Cluster that was created earlier, **mytestdomain**
7.	In the **Lambda IAM Execution Role** drop-down list, select **Create new IAM role**, and click **Allow**
8.	Click **Next**
9.	In the **Log Format** drop-down list, select **AWS CloudTrail**
10.	Ignore the **Subscription Filter Pattern** section. This is not required for this exercise
11.	In the **Select Log Data to Test** section, click **Test Pattern**. You should see 50 matches under Results
12.	Click **Next**
13.	Review and click **Next** again
14.	Click **Start Streaming**
15.	A **Success** page should now be displayed informing you of the service activation
16.	Close the current browser tab

### **Use Kibana to visualize your CloudTrail logs**

1.  In the AWS Management Console, click **Services**, then **Elasticsearch Service** 
2.  Click **mytestdomain**, then click the URL next to **Kibana**
3.  Under **Manage and Administer the Elastic Stack** click **Index Patterns**
4.	In the **Index Pattern** text box, type the index name or copy-paste from below (it has the format: cwl-YYYY.DD.MM) 
5.	Click **Next Step**
6.	Drop down the **Time Filter field name**, and select **@timestamp**
7.	Click Create **Index Pattern**
8.	Click the **Discover** tab to view the timestamp Logs events
Note: By default, we can see logs for the last 15 minutes. You can change the interval by clicking on the small clock symbol in the top right corner.

These are some of the log attributes that are displayed in the Kibana dashboard:
    *	PrincipalId - A unique identifier for the entity that made the call. For requests made with temporary security credentials, this value includes the session name that is passed to the AssumeRole, AssumeRoleWIthWebIdentity, or GetFederationToken API call.
    *	AccountId - The account that owns the entity that granted permissions for the request. If the request was made using temporary      security credentials, this is the account that owns the IAM user or role that was used to obtain credentials.
    *	AccesKeyId - The access key ID that was used to sign the request. If the request was made using temporary security credentials,     this is the access key ID of the temporary credentials.
    *	SessionContext - If the request was made with temporary security credentials, the SessionContext is an element that provides information about the session that was created for those credentials. Sessions are created when any API is called that returns temporary credentials. Sessions are also created when users work in the console and when users make a request using APIs that include multi-factor authentication.

9.	Click the disclosure triangle next to one of the search results
10.	Scroll down to reveal the fields and values that CloudTrail sends
11.	Click the 3rd icon to the right of the **awsRegion**, **eventName**, **eventSource**, **eventType**, and **userIdentity.arn** fields
12.	Scroll to the top of the list and you will see column headers for the fields you selected, along with the first row of values. Click the disclosure triangle at the left edge of the first row of values to collapse it and see the data in tabular form
13.	You can easily filter out some logs (rows) that you don’t want to see. Click the disclosure triangle to open one of the table’s rows. Click the <zoom out icon> next to the **eventName’s** value for the field. This will filter out all rows in the table that have the same value
14.	Kibana shows you your current filters at the top of the page, right below the search bar
![screen](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/log-analytics-83.png)
    
15.	If you hover over the filter, you will see additional controls, including a trash basket you can use to remove the filter

### **Create a visualization**

You create visualizations in Elasticsearch to analyze your data and reveal patterns. You can save your visualizations and build them into dashboards that update in near real time.

1.	Click the **Visualize** tab in the left navigation pane
2.	Click **Create a visualization**
3.	Select the **Pie** visualization
4.	Under **From a New Search**, vSelect Index**, you’ll see your index name. Click it
5.	Click **Split Slices**
6.	Under **Aggregation**, select **Terms**
7.	Under **Field**, select **eventSource.keyword** (you may have to scroll down to the **Strings** section of the menu).
8.	Click the <play button> control to reveal a pie chart of different services
9.	Click **Add sub-buckets**
10.	Click **Split Slices**
11.	From the **Sub Aggregation** menu, select **Terms**
12.	From the **Field** menu, select **userIdentity.arn.keyword**
13.	This shows you which user has called the different services. (Some calls may not include a user arn.)
14.	At the top of the screen, click **Save**
15.	Name your visualization **Services and identities pie**
16.	Click **Save**
    
### **Create a Time-Based Visualization** **(Optional)**

1.	Click the **Visualize** tab again, then click the <plus button>  button to create a new visualization
2.	Choose a **Line** visualization
3.	Click your index name
4.	Under **Buckets**, click **X-Axis**
5.	Select **Date Histogram** from the **Aggregation** menu. This reveals a **Count** of all events on the Y axis.
6.	You can **Add sub buckets**, e.g. with a **Terms** aggregation again to get a graph of the occurences of different field values
7.	Instead, click the disclosure triangle next to **Y-Axis**
8.	Under **Aggregation**, select **Unique Count**. You could also create sums, mins, maxes, etc. These are useful for monitoring quantities such as CPU, and data flow
9.	Select **eventName.keyword** from the **Field** drop down
10.	This yields a graph of the count of different calls that you are making to various AWS services. Click **Save**, and save your visualization as **Unique calls**
    
### **Create a Near Real Time Dashboard** **(Optional)**

1.	Click the **Dashboard** tab
2.	Click **Create a dashboard**
3.	Click the **Add** button
4.	Click the **Services and identities pie**
5.	Click **Unique calls**
6.	Click **Add** again at the top of the screen to collapse the visualizations list
7.	Click **Auto refresh** at the top of the screen. This drops down a list of choices for the frequency of refresh for Kibana
8.	Click **10 Seconds**. Kibana refreshes all data in all tabs every 10 seconds. You can experiment with the AWS console and see the results show up in Kibana

### **Monitoring Amazon Elasticsearch Cluster Metrics and Statistics**

1.	Return to the **Elasticsearch Service dashboard**
2.	Click **mytestdomain**
3.	Click the **Indices tab**
This shows you the documents that have been uploaded to Kibana. Click the drop-down arrows to display further data: **Count, Size in bytes, Query total, and Mappings**
4.	Click the **Monitoring tab** 
    This displays the various statistics of the cluster: CPU Utilization, Read Latency, Write Latency, and other core system resources       will be displayed
5.	Scroll down, and select the **CPUUtilization** metric
6.	From the Statistic drop-down list, select **Maximum**
7.	Click the refresh button

## **Conclusion**
Congratulations! You now know how to:
* Deploy an Amazon Elasticsearch Service domain
* Create an AWS CloudTrail Log Group
* Subscribe an Amazon CloudWatch Log Group to Amazon Elasticsearch Service
* Monitor Amazon Elasticsearch Cluster Metrics
## **Additional Resources**
* For more information about Elasticsearch, see  https://aws.amazon.com/elasticsearch-service/ 
* For more information about Cloudtrail, see https://aws.amazon.com/cloudtrail/ 
* For more information about Cloudwatch, see https://aws.amazon.com/cloudwatch/ 

