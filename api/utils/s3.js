const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadFile = (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${uuidv4()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read',
  };
  return s3.upload(params).promise();
};

exports.deleteFile = (fileUrl) => {
  const urlParts = fileUrl.split('/');
  const key = urlParts.slice(3).join('/'); // after bucket name
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };
  return s3.deleteObject(params).promise();
};