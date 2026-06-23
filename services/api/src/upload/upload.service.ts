import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private useLocalStorage: boolean;
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    // Check if we should use local storage (default for development)
    this.useLocalStorage = process.env.USE_LOCAL_STORAGE !== 'false';
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    this.baseUrl = process.env.PUBLIC_URL || 'http://localhost:3001';

    // Create upload directories if using local storage
    if (this.useLocalStorage) {
      ['videos', 'images', 'thumbnails', 'trailers'].forEach((dir) => {
        const dirPath = path.join(this.uploadDir, dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      });
      console.log(`📁 Local file storage enabled at: ${this.uploadDir}`);
    } else {
      // Initialize S3 client for cloud storage
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'ap-south-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
      this.bucketName = process.env.AWS_S3_BUCKET || 'kolam-ott-videos';
      console.log(`☁️  S3 file storage enabled: ${this.bucketName}`);
    }
  }

  private async saveFileLocally(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const filename = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, folder, filename);

    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Return public URL
    return `${this.baseUrl}/uploads/${folder}/${filename}`;
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    // Use local storage if enabled
    if (this.useLocalStorage) {
      return this.saveFileLocally(file, 'videos');
    }

    // Otherwise use S3
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
    // Use local storage if enabled
    if (this.useLocalStorage) {
      return this.saveFileLocally(file, 'images');
    }

    // Otherwise use S3
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
    // Use local storage if enabled
    if (this.useLocalStorage) {
      return this.saveFileLocally(file, 'thumbnails');
    }

    // Otherwise use S3
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
    // Use local storage if enabled
    if (this.useLocalStorage) {
      return this.saveFileLocally(file, 'trailers');
    }

    // Otherwise use S3
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
