// index.js

const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

// s3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

exports.handler = async (event) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
    };

    try {
        const data = await s3.listObjects(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Contents),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: "Error listing files",
        };
    }
};