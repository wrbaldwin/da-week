# Data Analytics Week at the AWS Loft

## Stream Analytics

By following the steps in this section, you can create your first Amazon Kinesis data analytics application using the console. You will create an Amazon Kinesis data analytics application. Your application needs a streaming source. To help you get started, the console can create a demo stream (called kinesis-analytics-demo-stream). The console also runs a script that populates records in the stream. You can write your own SQL queries against the in-application stream, but for the following lab you use one of the templates that provides sample code. Finally if time permits, you will explore how to update the application code.

### Prerequisites

[Set Up the AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/setup-awscli.html)

### Create an Application

1.  Sign in to the AWS Management Console and open the Kinesis Data Analytics console.

1.  Choose Create new application.

1.  On the New application page, type an application name, type a description, and then choose Save and continue.
![Screen](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/images/gs-v2-10.png)

### Configure Input

1.  On the application hub page in the console, choose Connect to a source.
![Screenshot of the example app and the connect to a source button](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/images/gs-v2-20.png)

1.  On the page that appears, review the following:
  * _Source_ - This is where you specify a streaming source for your application. You can select an existing stream source or create one. In this exercise, you create a new stream, the demo stream. By default the console names the in-application input stream that is created as INPUT_SQL_STREAM_001. For this exercise, keep this name as it appears.

  * _Stream reference name_ – This option shows the name of the in-application input stream that is created, SOURCE_SQL_STREAM_001. You can change the name, but for this exercise, keep this name.
  
  * _Record pre-processing with AWS Lambda_ - This option is where you specify an AWS Lambda expression that modifies the records in the input stream before your application code executes. In this exercise, leave the Disabled option selected.

         

        Record pre-processing with AWS Lambda: This option is where you specify an AWS Lambda expression that modifies the records in the input stream before your application code executes. In this exercise, leave the Disabled option selected. For more information about Lambda preprocessing, see Preprocessing Data Using a Lambda Function.

After you provide all the information on this page, the console sends an update request (see UpdateApplication) to add the input configuration the application.

1.  On the Source page, choose Configure a new stream.

1.  Choose Create demo stream. The console configures the application input by doing the following:

  * The console creates a Kinesis data stream called kinesis-analytics-demo-stream.

  * The console populates the stream with sample stock ticker data.

  * Using the DiscoverInputSchema input action, the console infers a schema by reading sample records on the stream. The schema that is inferred is the schema for the in-application input stream that is created. For more information, see Configuring Application Input.

  * The console shows the inferred schema and the sample data it read from the streaming source to infer the schema.

The console displays the sample records on the streaming source.
![stream sample tab](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/images/gs-v2-30.png)

The following appear on the Stream sample console page:

  * The Raw stream sample tab shows the raw stream records sampled by the DiscoverInputSchema API action to infer the schema.

  * The Formatted stream sample tab shows the tabular version of the data in the Raw stream sample tab.

  * If you choose Edit schema, you can edit the inferred schema. For this exercise, don't change the inferred schema. For more information about editing a schema, see Working with the Schema Editor.

  * If you choose Rediscover schema, you can request the console to run DiscoverInputSchema again and infer the schema.

1. Choose Save and continue. 


### Add Real-Time Analytics (Add Application Code)

### (Optional) Update the Application Code
