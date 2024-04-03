// app.js

const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});

// File upload route
app.post("/upload", upload.single("file"), (req, res, next) => {
    res.status(200).send("File uploaded successfully");
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
        const files = data.Contents.map((obj) => obj.Key);
        res.status(200).json(files);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
