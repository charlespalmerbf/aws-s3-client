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
    // Upload file to S3
    try {
        const body = JSON.parse(event["body"]);

        const file = body.file;

        // Check if file has been correctly passed
        if (!file) {
            return {
                statusCode: 400,
                body: "Please select a file to upload to s3",
            };
        }

        // Set s3 bucket and key (filename) where the file will be stored
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: Date.now() + "-" + body.fileName,
            Body: Buffer.from(file, "base64"),
        };

        await s3.upload(params).promise();
        return {
            statusCode: 200,
            body: "File uploaded successfully to s3",
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify(event),
        };
    }
};
