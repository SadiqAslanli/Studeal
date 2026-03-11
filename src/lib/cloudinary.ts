import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using process.env
// The user should set these in .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  duration?: number;
};

/**
 * Uploads a file (Base64 string or File/Buffer data) to Cloudinary.
 * Used on the server-side only.
 */
export async function uploadToCloudinary(
  fileData: string, 
  folder: string = 'studeal/uploads'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: 'auto', // Auto-detect image vs video
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      duration: result.duration,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload media to Cloudinary');
  }
}

export { cloudinary };
