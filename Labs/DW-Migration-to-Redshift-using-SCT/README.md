# Migrating Your On-Premises Data Warehouse to Amazon Redshift with AWS SCT

In this lab, you will migrate a sample Oracle data warehouse to Amazon Redshift. You will first setup the environment using a CloudFormation template. The CloudFormation template will create a RDS Oracle data warehouse, Redshift cluster and three EC2 instance. The Windows EC2 machine will have the AWS SCT installer and requried drivers and other two EC2 Linux machine will have the AWS SCT Data Extraction agents RPM. You will need to install and configure the agents to extract your data and move to Amazon Redshift. You will need a Mac or Windows computer with a Firefox or Chrome browser.


## OPTION 1 - Use your own AWS account 

Follow these steps to get started:

1. Download zip file: [D1S04.zip](https://tiny.amazon.com/1f34lh7i0/D1S04)  which contains
         AWS CloudFormation template,
         Lab instructions guide,
         SQL File, and
         Policy file.

2. Open AWS Management Console and choose AWS Region eu-west-1 (Ireland)

3. Follow lab guide instructions [D1S04 Lab Instructions

4. Once the instructor has completed the overview, use above lab guide to migrate DW to Amazon Redshift.

5. Remember when you are done to delete the CloudFormation stack to remove the workshop resources from your account so that you won't incur additional charges.




# OPTION 2 - This is designed to work in the AWS account created using AWS Event Engine.

Follow these steps to get started:

1. Download [scripts_ee.zip](https://github.com/wrbaldwin/da-week/blob/master/Labs/DW-Migration-to-Redshift-using-SCT/scripts_ee.zip). It contains Lab instructions guide (Instructions_Migrate_ODW_to_Redshift_using_AWS_SCT.pdf), SQL File (SQLfile.txt), Policy file (S3-IAM-Policies.txt) and AWS CloudFormation template.

2. Open AWS Event Engine dashboard: https://dashboard.eventengine.run/dashboard.
   Enter "Team Hash" code, provided by lab instructor, and click "Accept terms & Login".

3. Click “AWS Console” then "Open AWS Console" to access AWS console of the AWS account created for you using AWS event engine. Please make sure AWS Region eu-west-1 (Ireland) is selected throughout the workshop.

4. Click on “SSH Key” and download EC2 SSH KEY (ee-default-keypair.pem). You will be using this later. 

5. Follow step by step instrcutions described in the guide (Instructions_Migrate_ODW_to_Redshift_using_AWS_SCT.pdf).

6. Remember when you are done to delete the CloudFormation stack to remove the AWS resources from the AWS account.
