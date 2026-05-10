import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const upload = multer({ storage: multer.memoryStorage() });

// AWS Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Upload API
app.post("/upload", upload.single("file"), (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: Date.now() + "-" + req.file.originalname,
    Body: req.file.buffer
  };

  s3.upload(params, (err, data) => {
    if (err) return res.status(500).send(err);
    res.send({ url: data.Location });
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});