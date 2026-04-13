
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";

// Set CORS Headers for Railway Bucket

const client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
  },
});
const corsParams = {
  Bucket: process.env.S3_BUCKET!,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["PUT", "POST"],
        AllowedOrigins: [process.env.SITE_URL!],
        MaxAgeSeconds: 3000,
      },
    ],
  },
};
async function setCors() {
  try {
    const command = new PutBucketCorsCommand(corsParams);
    const response = await client.send(command);
    console.log({
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET
    })
    console.log("CORS configuration applied:", response);
    console.log('CORS RULES----', await client.send(new GetBucketCorsCommand({ Bucket: process.env.S3_BUCKET })))
  } catch (err) {
    console.error("Error setting CORS:", err);
  }
}

setCors();