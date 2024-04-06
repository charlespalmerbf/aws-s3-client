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
    try {
        const key = event["queryStringParameters"]["file"];
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        };

        const data = await s3.getObject(params).promise();
        return {
            statusCode: 200,
            body: data.Body.toString("base64"),
            isBase64Encoded: true,
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify(event),
        };
    }
};
