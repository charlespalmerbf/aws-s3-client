const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const AWS = require("aws-sdk");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// s3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// File upload route

app.post("/upload", upload.single("file"), function (req, res) {
    const file = req.file;

    // Check if file has been correctly passed
    if (!file) {
        return res.status(400).send("Please select a file to upload");
    }

    // Set s3 bucket and key (filename) where the file will be stored
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: Date.now() + "-" + file.originalname,
        Body: file.buffer,
    };

    // Upload file to S3
    s3.upload(params, function (err, data) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error uploading file to s3");
        }

        // If file upload to S3 is successful, return a 200 OK response
        res.status(200).send("File uploaded successfully to s3");
    });
});

// File download route
app.get("/download/:key", (req, res, next) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.params.key,
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error downloading file");
        }
        res.attachment(req.params.key);
        res.send(data.Body);
    });
});

// List files route
app.get("/files", (req, res, next) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
    };
    s3.listObjects(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error listing files");
        }
        res.status(200).json(data.Contents);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
