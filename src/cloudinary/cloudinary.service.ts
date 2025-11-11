// cloudinary/cloudinary.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    // Configure Cloudinary when module initializes
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'deals',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(`Cloudinary upload error: ${error.message}`));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Cloudinary upload failed: No result returned'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new Error(`Failed to delete image: ${result.result}`);
      }
    } catch (error) {
      throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
    }
  }

  // Helper method to extract public ID from Cloudinary URL
  extractPublicId(url: string): string {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : '';
  }
}