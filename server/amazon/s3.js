// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

AWS.config.update({
    signatureVersion: 'v4'
});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

var uploadParams = {Bucket: 'hornikhornak124', Key: '', Body: ''};

module.exports = s3;
