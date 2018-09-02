# Data Analytics Week at the AWS Loft

## Log Analytics 

This lab demonstrates the basic steps required to get started with Amazon Elasticsearch Service: creating clusters, cluster node configurations, storage configurations, and Identity Access Manager (IAM) Policies 


By the end of this lab you will be able to:
*	Deploy an Amazon Elasticsearch Service domain
*	Create an AWS CloudWatch Log Group
*	Subscribe an Amazon CloudWatch Log Group to Amazon Elasticsearch Service
*	Monitor Amazon Elasticsearch Cluster Metrics

Prerequisites
*	Some familiarity with IAM Roles and EC2 Instances is recommended. Previous kowledge of Kibana and Elasticsearch is desirable. 

*	Have installed node.js and aws-es-proxy (available via npm). 

*	Have correctly installed and configured the AWS command line interface. See [this documentation](https://aws.amazon.com/cli/) for instructions.

## **Create and Test an Amazon Elasticsearch Domain**

**Deploy an Amazon Elasticsearch Service Domain**

1.	In the AWS Management Console, click **Elasticsearch Service**.
2.	Click **Get Started** or **Create a new domain** depending on whether you have an existing domain.
3.	In **Step 1: Elasticsearch domain name**, type **mytestdomain** into the box, and click **Next**.
4.	In **Step 2: Configure cluster page**, under the **Node configuration section**, select the following information from the drop-down lists:
    a.	In the **Instance count** text box, leave **1** (the default).
       This is the number of instances that you wish to deploy with your cluster.
    b.	In the **Instance type** section, select **t2.small.elasticsearch** (free tier eligible).
       When you launch an instance, the instance type that you specify determines the hardware of the host computer used for your              instance. Each instance type offers different compute, memory, and storage capabilities.
       c.	Do not select **Enable dedicated master**.
       A dedicated master node is a cluster node that performs cluster management tasks, but does not hold data or respond to data              upload requests. This offloading of cluster management tasks increases the stability of your Amazon Elasticsearch clusters. We          recommend that you avoid allocating dedicated master nodes for all small and short-lived Amazon Elasticsearch domains.
    d.	Do not select **Enable zone awareness**.
       If you enable zone awareness, you should use Amazon Elasticsearch API to set up replicas for your cluster. Amazon Elasticsearch          Service will distribute replicas across the nodes in Availability Zones. This will increase the availability of your cluster.   
5.	In the **Storage Configuration** section, select the following information from the drop-down lists:
    a.	**Storape 	EBS**
       Elasticsearch provides two different storage option types: Instance store and Elastic Block Store (EBS). 
    b.	**EBS volume type	General Purpose (SSD)**
       General Purpose (SSD) storage is suitable for a wide variety of database workloads that have moderate I/O requirements. The              baseline of 3 IOPS per GB and the ability to burst up to 3,000 IOPS will provide you with predictable performance well-suited to        many applications.
    c.	**EBS volume size	10**
       Amazon EBS provides durable, block-level storage volumes that you can attach to a running instance. You can use Amazon EBS as a          primary storage device for data that requires frequent and granular updates.
6.	In the **Snapshot configuration** section, select the following from the drop-down lists:
    a.	**Automated snapshots start hour	00:00 UTC (default)**
7.	In the **Advanced options** section, leave the values at the default settings. 
8.	Click **Next**.
9.	In the **Step 3: Set up access** page, select the following from the drop-down lists:
    a.	Select the radio button for **Public access**.
    Public access domains have public IPs for their endpoints, resolved through DNS. 
    b.	Under **Access policy**, select **Allow or deny access to one or more AWS accounts or IAM users** from the drop down menu.
    c.	**In the resulting dialog**
        i.	**Set the “Account ID or ARN” to:	Your AWS account ID**
        ii.	Click **OK**.
10.	Click **Next**.
11.	Review the system configuration, and click **Confirm**.
    Note: The service can take ten minutes to deploy. While waiting for the service to deploy, you can complete the steps in the next       section. 
### **Create a CloudTrail Log Group for Amazon Elasticsearch Service**

12.	Click **Services**.
13.	Under **Management Tools**, right-click **CloudTrail**, and click **Open link in new tab**.
    Note: This allows you to keep the Elasticsearch dashboard open so you can monitor the cluster creation progress. 
14.	Hide the **Services** drop-down menu by clicking the icon below.
 
15.	Switch to the new tab, and click **Trails** in the left navigation pane.
16.	Click **Create trail**.
17.	Name the trail **mytestdomain-trail**.
18.	Leave **Apply trail to all regions** set to **Yes**.
19.	Leave **Management events** set to **All**.
20.	Skip the **Data events** section.
21.	Under **Storage location** type **mytestdomain-s3** as the **S3 Bucket**.
22.	Skip the **Advanced** section.
23.	Click **Create**.
24.	You will be returned to the CloudTrail dashboard. Click **mytestdomain-trail** to open the configuration page.
25.	Scroll down to the **CloudWatch Logs** section.
26.	Under CloudWatch Logs, click Configure.
    Note: If the **Configure** button is not visible, click the pencil icon to open the log creation wizard.
 
27.	In the **New or existing log group** text box, delete the existing text, and enter **CloudTrail/mytestdomain-trail**.
28.	Click **Continue**. This will bring you to the IAM console, to enable CloudTrail to write to CloudWatch Logs.
29.	Click **Allow**.
    Note: Wait until the console returns to the **CloudTrail Configuration** page. To generate more CloudTrail log data, view some of       the different AWS Services, such as Amazon VPC, Amazon EC2, or any of the other services in the AWS Management Console. While           CloudTrail generates these logs, they will be sent to your ElasticSearch Cluster.

### **Create an IAM role for Lambda to write to Amazon ES**

This is a workaround for a current bug in the console.

30.	Navigate to the **IAM** console.

31.	Click the **Policies** tab in the left navigation window


32.	Click **Create policy**.
33.	Click the **JSON** tab
34.	Paste the following
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "es:ESHttpPost"
            ],
            "Resource": "*"
        }
    ]
}
```
35.	Click **Review** policy.
36.	Name the policy **PostToAllAmazonESDomains**.
37.	Click **Create policy**.
38.	Select the **Roles** tab in the left navigation pane.
39.	Click **Create role**.
40.	Leave **AWS service** selected under **Select type of trusted entity**.
41.	Select **Lambda** as the **service that will use this role**.
42.	Click **Next: Permissions**.
43.	Type **PostToAllAmazonESDomains** in the search box.
44.	Click the check mark next to the policy in the search results.
45.	Click **Next: Review**.
46.	Set the **Role name** to **PostToAllAmazonESDomains**
47.	Click **Create role**.

### **Subscribe a CloudWatch Log Group to Amazon Elasticsearch Service**

48.	Switch back to the Elasticsearch dashboard browser tab and wait until the mytestdomain cluster Domain **status** changes to **Active**. 
    Note: Here is a link to some additional reading while waiting for the cluster to go Active:
    http://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/what-is-amazon-elasticsearch-service.html 
49.	Enter the **CloudWatch** dashboard by clicking **Services**.
50.	Under **Management Tools**, right-click **CloudWatch**.
51.	Switch to the CloudWatch Logs tab in your browser and click **Logs** in the left navigation pane. 
52.	In the **Log Groups** page, tick the Log Group box you just created, **CloudTrail/mytestdomain-trail**.
53.	Click the **Actions** drop-down list, and select **Stream to Amazon Elasticsearch Service**.
54.	In the **Amazon ES Cluster** drop-down list, select the Amazon Elasticsearch Cluster that was created earlier, **mytestdomain**.
55.	In the **Lambda IAM Execution Role** drop-down list, select **Create new IAM role**, and click **Allow**. [Workaround: choose the role you created above]
56.	Click **Next**.
57.	In the **Log Format** drop-down list, select **AWS CloudTrail**.
58.	Ignore the **Subscription Filter Pattern** section. This is not required for this exercise.
59.	In the **Select Log Data to Test** section, click **Test Pattern**. You should see 50 matches under Results.
60.	Click **Next**.
61.	Review and click **Next** again.
62.	Click **Start Streaming**.
63.	A **Success** page should now be displayed informing you of the service activation.
64.	Click **Close**.
65.	Close the current browser tab.

### **Use Kibana to visualize your CloudTrail logs**

66.	Return to the **Elasticsearch Service** browser tab you initially opened.
67.	Return to the **Elasticsearch Service** dashboard.
68.	In the left navigation pane, click **mytestdomain**.
69.	Copy your domain’s **Endpoint**.
70.	Run **aws-es-proxy** on your laptop, using the **endpoint** from the last step.
71.	In your browser, navigate to http://localhost:9200/_plugin/kibana
72.	In the top right, click **Set up index patterns**.
73.	In the **Index Pattern** text box, type the index name or copy-paste from below (it has the format: cwl-YYYY.DD.MM). 
74.	Click **Next Step**.
75.	Drop down the **Time Filter field name**, and select **@timestamp**.
76.	Click Create **Index Pattern**.
77.	Click the **Discover** tab to view the timestamp Logs events.
Note: By default, we can see logs for the last 15 minutes. You can change the interval by clicking on the small clock symbol in the top right corner.
These are some of the log attributes that are displayed in the Kibana dashboard:
    *	PrincipalId - A unique identifier for the entity that made the call. For requests made with temporary security credentials, this    value includes the session name that is passed to the AssumeRole, AssumeRoleWIthWebIdentity, or GetFederationToken API call.
    *	AccountId - The account that owns the entity that granted permissions for the request. If the request was made using temporary      security credentials, this is the account that owns the IAM user or role that was used to obtain credentials.
    *	AccesKeyId - The access key ID that was used to sign the request. If the request was made using temporary security credentials,     this is the access key ID of the temporary credentials.
    *	SessionContext - If the request was made with temporary security credentials, the SessionContext is an element that provides        information about the session that was created for those credentials. Sessions are created when any API is called that returns          temporary credentials. Sessions are also created when users work in the console and when users make a request using APIs that include    multi-factor authentication.
78.	Click the disclosure triangle next to one of the search results.
79.	Scroll down to reveal the fields and values that CloudTrail sends.
80.	Click   to the right of the **awsRegion**, **eventName**, **eventSource**, **eventType**, and **userIdentity.arn** fields.
81.	Scroll to the top of the list and you will see column headers for the fields you selected, along with the first row of values. Click the disclosure triangle at the left edge of the first row of values to collapse it and see the data in tabular form.
82.	You can easily filter out some logs (rows) that you don’t want to see. Click the disclosure triangle to open one of the table’s rows. Click the <zoom out> next to the **eventName’s** value for the field. This will filter out all rows in the table that have the same value.
83.	Kibana shows you your current filters at the top of the page, right below the search bar.
![screen](https://github.com/wrbaldwin/da-week/blob/master/Labs/img/log-analytics-83.png)
    
84.	If you hover over the filter, you will see additional controls, including a trash basket you can use to remove the filter.

### **Create a visualization**

You create visualizations in Elasticsearch to analyze your data and reveal patterns. You can save your visualizations and build them into dashboards that update in near real time.

85.	Click the **Visualize** tab in the left navigation pane.
86.	Click **Create a visualization**.
87.	Select the **Pie** visualization.
88.	Under **From a New Search**, vSelect Index**, you’ll see your index name. Click it.
89.	Click **Split Slices**.
90.	Under **Aggregation**, select **Terms**.
91.	Under **Field**, select **eventSource.keyword** (you may have to scroll down to the **Strings** section of the menu).
92.	Click the <play button> control to reveal a pie chart of different services
93.	Click **Add sub-buckets**.
94.	Click **Split Slices**.
95.	From the **Sub Aggregation** menu, select **Terms**.
96.	From the **Field** menu, select **userIdentity.arn.keyword**.
97.	This shows you which user has called the different services. (Some calls may not include a user arn.)
98.	At the top of the screen, click **Save**.
99.	Name your visualization **Services and identities pie**.
100.	Click **Save**.
    
### **Create a Time-Based Visualization**

101.	Click the **Visualize** tab again, then click the <plus button>  button to create a new visualization.
102.	Choose a **Line** visualization.
103.	Click your index name.
104.	Under **Buckets**, click **X-Axis**.
105.	Select **Date Histogram** from the **Aggregation** menu. This reveals a **Count** of all events on the Y axis.
106.	You can **Add sub buckets**, e.g. with a **Terms** aggregation again to get a graph of the occurences of different field values. 
107.	Instead, click the disclosure triangle next to **Y-Axis**.
108.	Under **Aggregation**, select **Unique Count**. You could also create sums, mins, maxes, etc. These are useful for monitoring quantities such as CPU, and data flow. 
109.	Select **eventName.keyword** from the **Field** drop down.
110.	This yields a graph of the count of different calls that you are making to various AWS services. Click **Save**, and save your visualization as **Unique calls**.
Continue to experiment with different visualizations to see what you can discover about your account and the resources that you are using.
    
### **Create a Near Real Time Dashboard**

111.	Click the **Dashboard** tab.
112.	Click **Create a dashboard**.
113.	Click the **Add** button.
114.	Click the **Services and identities pie**.
115.	Click **Unique calls**.
116.	Click **Add** again at the top of the screen to collapse the visualizations list.
117.	Click **Auto refresh** at the top of the screen. This drops down a list of choices for the frequency of refresh for Kibana.
118.	Click **10 Seconds**. Kibana refreshes all data in all tabs every 10 seconds. You can experiment with the AWS console and see the results show up in Kibana.

### **Monitoring Amazon Elasticsearch Cluster Metrics and Statistics**

119.	Return to the **Elasticsearch Service dashboard**.
120.	Click **mytestdomain**.
121.	Click the **Indices tab**.
This shows you the documents that have been uploaded to Kibana. Click the drop-down arrows to display further data: **Count, Size in bytes, Query total, and Mappings**.
122.	Click the **Monitoring tab**. 
    This displays the various statistics of the cluster: CPU Utilization, Read Latency, Write Latency, and other core system resources       will be displayed.
123.	Scroll down, and select the **CPUUtilization** metric.
124.	From the Statistic drop-down list, select **Maximum**.
125.	Click **Update graph**.
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

