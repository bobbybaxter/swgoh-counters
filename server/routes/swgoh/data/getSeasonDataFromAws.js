const { GetObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../../../setup/s3');
const streamToString = require('../../../util/streamToString');

module.exports = ({ config }) => async season => {
  const { aws } = config;
  const { bucket, keyPart1, keyPart2 } = aws;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: `${keyPart1}${season}${keyPart2}`,
  });

  try {
    const data = await s3Client.send(command);
    return await streamToString(data.Body);
  } catch (err) {
    console.log('err', err.$metadata, err);
    throw err;
  }
};
