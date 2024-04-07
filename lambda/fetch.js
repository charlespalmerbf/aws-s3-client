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

    // Check if it's a preflight request (OPTIONS)
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow access from all origins
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Adjust methods as needed
            },
            body: "Preflight check passed",
        };
    }

    try {
        const data = await s3.listObjects(params).promise();
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow access from all origins
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(data.Contents),
        };
        return response;
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: "Error listing files",
            headers: {
                "Access-Control-Allow-Origin": "*", // Allow access from all origins
            },
        };
    }
};
