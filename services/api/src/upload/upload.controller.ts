import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('video')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only MP4, MPEG, and MOV videos are allowed');
    }

    // Validate file size (max 5GB)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5GB limit');
    }

    const url = await this.uploadService.uploadVideo(file);
    return { url };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    const url = await this.uploadService.uploadImage(file);
    return { url };
  }

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    const url = await this.uploadService.uploadThumbnail(file);
    return { url };
  }

  @Post('trailer')
  @UseInterceptors(FileInterceptor('trailer'))
  async uploadTrailer(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only MP4, MPEG, and MOV videos are allowed');
    }

    // Validate file size (max 500MB for trailers)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new BadRequestException('Trailer size exceeds 500MB limit');
    }

    const url = await this.uploadService.uploadTrailer(file);
    return { url };
  }
}
