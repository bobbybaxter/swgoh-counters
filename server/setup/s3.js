const { S3Client } = require('@aws-sdk/client-s3');
const s3Options = require('./s3-config');

module.exports = new S3Client(s3Options);
