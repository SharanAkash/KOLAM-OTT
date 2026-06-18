import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET || 'kolam-ott-videos';
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    const key = `videos/${uuidv4()}-${file.originalname}`;

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
      });

      await upload.done();

      // Return public URL
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading video to S3:', error);
      throw error;
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const key = `images/${uuidv4()}-${file.originalname}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      // Return public URL
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw error;
    }
  }

  async uploadThumbnail(file: Express.Multer.File): Promise<string> {
    const key = `thumbnails/${uuidv4()}-${file.originalname}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      // Return public URL
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading thumbnail to S3:', error);
      throw error;
    }
  }

  async uploadTrailer(file: Express.Multer.File): Promise<string> {
    const key = `trailers/${uuidv4()}-${file.originalname}`;

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        },
      });

      await upload.done();

      // Return public URL
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading trailer to S3:', error);
      throw error;
    }
  }
}
