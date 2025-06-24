import fs from "fs";
import path from "path";

/**
 * Delete a file from the uploads directory
 * @param fileUrl - The URL path of the file (e.g., "/uploads/catalogues/filename.jpg")
 */
export function deleteFileFromUploads(fileUrl: string): boolean {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
    console.warn(`Invalid file URL: ${fileUrl}`);
    return false;
  }

  try {
    const filePath = path.join(process.cwd(), "public", fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Successfully deleted file: ${filePath}`);
      return true;
    } else {
      console.warn(`File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting file ${fileUrl}:`, error);
    return false;
  }
}

/**
 * Extract filename from upload URL
 * @param fileUrl - The URL path of the file
 * @returns The filename or null if invalid
 */
export function getFilenameFromUrl(fileUrl: string): string | null {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
    return null;
  }

  return path.basename(fileUrl);
}

/**
 * Check if a file exists in the uploads directory
 * @param fileUrl - The URL path of the file
 * @returns True if file exists, false otherwise
 */
export function fileExistsInUploads(fileUrl: string): boolean {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
    return false;
  }

  try {
    const filePath = path.join(process.cwd(), "public", fileUrl);
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error checking file existence ${fileUrl}:`, error);
    return false;
  }
}
