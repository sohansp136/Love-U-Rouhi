/**
 * Compresses an image file (e.g. from camera or phone) down to safe web dimensions
 * (max 1280x1280) and quality (0.82) so it fits comfortably within Firestore's 1MB limit
 * and localStorage quota, preventing silent write failures.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original base64 if canvas 2D is unavailable
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for optimal compression ratio
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Checks if a string looks like a valid data URL or http(s) URL
 */
export function isValidImageUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

export const compressImage = compressImageFile;
