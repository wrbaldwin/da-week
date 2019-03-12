var AWS = require('aws-sdk');
var sns = new AWS.SNS( { region: "us-west-2" });
var s3 = new AWS.S3();
	exports.handler = function(event, context) {
		console.log(JSON.stringify(event, null, 3));
		event.records.forEach(function(record) {
			var payload = new Buffer(record.data, 'base64').toString('ascii');
			var rec = payload.split(',');
			var ctr = rec[0];
			var anomaly_score = rec[1];
			var detail = 'Anomaly detected with a click through rate of ' + ctr + '% and an anomaly score of ' + anomaly_score;
			var subject = 'Anomaly Detected';
			var SNSparams = {
				Message: detail,
				MessageStructure: 'String',
				Subject: subject,
				TopicArn: 'arn:aws:sns:us-west-2:341259728059:ClickStreamEvent2'
		};
			sns.publish(SNSparams, function(err, data) {
				if (err) context.fail(err.stack);
				else{
					var anomaly = [{
						'date': Date.now(),
						'ctr': ctr,
						'anomaly_score': anomaly_score
					}];
					convertArrayOfObjectsToCSV({ data: anomaly }, function(err1, data1){
						if(err1) context.fail(err1.stack); // an error occurred
						else{
							var today = new Date();
							var S3params = {
								'Bucket': 'aslkdjnfowqer-processeds3bucket-bnyfgd6z7ayc',
								'Key': `weblogs/processed/${today.getFullYear()}/${today.getMonth()}/${today.getDate()}/${record.recordId}.csv`,
								'Body': data1,
								'ContentType': 'text/csv'
							}
							s3.putObject(S3params, function(err2, data2) {
								if (err2) context.fail(err2.stack); // an error occurred
								else     {
									context.succeed('Published Notification');           // successful response
								}
							})
						}
					})
				}
			});
		});
	};
function convertArrayOfObjectsToCSV(args, callback) {
	var result, ctr, keys, columnDelimiter, lineDelimiter, data;
		data = args.data || null;
		if (data == null || !data.length) {
			callback(new Error('data is null'));
		}
	columnDelimiter = args.columnDelimiter || ',';
	lineDelimiter = args.lineDelimiter || '\n';
	keys = Object.keys(data[0]);
	result = '';
	result += keys.join(columnDelimiter);
	result += lineDelimiter;
	data.forEach(function(item) {
		ctr = 0;
		keys.forEach(function(key) {
			if (ctr > 0) result += columnDelimiter;
				result += item[key];
					ctr++;
				});
			result += lineDelimiter;
		});
		callback(null, result);
	}
