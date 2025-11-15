import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
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
          access_mode: 'public', // Ensure public access
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
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

  async uploadDocument(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Use 'raw' for PDF files
          folder: 'deal-documents',
          format: 'pdf',
          access_mode: 'public', // CRITICAL: Make PDFs publicly accessible
          type: 'upload',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(new Error(`Cloudinary upload error: ${error.message}`));
          } else if (result) {
            // For raw files, we need to construct the URL manually
            const documentUrl = `https://res.cloudinary.com/${this.configService.get('CLOUDINARY_CLOUD_NAME')}/raw/upload/${result.public_id}.pdf`;
            resolve(documentUrl);
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

  async deleteDocument(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });
      if (result.result !== 'ok') {
        throw new Error(`Failed to delete document: ${result.result}`);
      }
    } catch (error) {
      throw new Error(
        `Error deleting document from Cloudinary: ${error.message}`,
      );
    }
  }

  extractPublicId(url: string): string {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : '';
  }

  // New method to get secure URL for documents
  getSecureDocumentUrl(publicId: string): string {
    return `https://res.cloudinary.com/${this.configService.get('CLOUDINARY_CLOUD_NAME')}/raw/upload/${publicId}.pdf`;
  }
}
