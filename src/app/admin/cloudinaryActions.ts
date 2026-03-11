"use server";

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary initialization in Next server actions
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Server action to upload media files to Cloudinary.
 * Used for storing company logos and deal images/videos.
 */
export async function uploadMediaAction(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error("No file content provided");

  // Convert File object to buffer -> base64 for Cloudinary uploader
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Content = `data:${file.type};base64,${buffer.toString('base64')}`;

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Content, {
      folder: 'studeal/media',
      resource_type: 'auto', // Detects images and videos
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      resource_type: uploadResponse.resource_type
    };
  } catch (error) {
    console.error("Cloudinary upload action failed:", error);
    return { success: false, error: (error as Error).message };
  }
}
