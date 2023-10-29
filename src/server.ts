import express, { Request, Response } from 'express';
import multer from 'multer';
import { Upload } from '@aws-sdk/lib-storage'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import uuid from 'uuid-random'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
require("dotenv").config();

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const client = new S3Client({
    region: process.env.AWS_REGION,
})

app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" })
        }
        const extension = req.file.originalname.replace(/.*\./, '');
        const key = uuid()
        const s3upload = new Upload({
            client,
            params: {
                Key: `${key}.${extension}`,
                Bucket: process.env.AWS_S3_BUCKET,
                Body: req.file.buffer,
            }
        })
        await s3upload.done()
        return res.status(200).json({ message: "Upload realizado com sucesso", key: `${key}.${extension}` })
    } catch (error) {
        return res.status(500).json({ message: "Failed to upload your file" })
    }
});

app.get('/:key', async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        })
        const url = await getSignedUrl(client, command, { expiresIn: 3600 })
        return res.status(200).json({ url })
    } catch (error) {
        return res.status(500).json({ message: "Failed to upload your file" })
    }
})

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});