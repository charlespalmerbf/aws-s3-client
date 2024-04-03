# AWS S3 Client

This is a simple node application that allows you to upload, download, and view files in an AWS S3 bucket. It uses the AWS SDK for JavaScript to interact with S3 and supports pulling credentials from a `.env` file.

## Prerequisites

Before running this application, make sure you have the following:

- Node.js and npm installed on your system
- AWS account with access to an S3 bucket
- AWS Access Key ID and Secret Access Key with permissions to read from and write to the S3 bucket
- Environment variables set up in a `.env` file with the following keys:

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name PORT=3000
```

## Installation

1\. Clone this repository to your local machine:

 ```bash
 git clone https://github.com/charlespalmerbf/aws-s3-client.git
```

1.  Navigate to the project directory:

    `cd aws-s3-client`

2.  Install dependencies:

    `npm install`

Usage
-----

1.  Start the server:

    `node app.js`

2.  The server will start running on port 3000 by default. You can change the port by modifying the `PORT` variable in the `.env` file.

3.  Use the following endpoints to interact with the S3 bucket:

    -   `/upload`: Upload a file to the S3 bucket using a `POST` request with `multipart/form-data` content type. Use the field name `file` to upload the file.
    -   `/download/:key`: Download a file from the S3 bucket. Replace `:key` with the key of the file you want to download.
    -   `/files`: List all files in the S3 bucket.
