/**
 * Image Compression Utility
 * Compresses images to reduce storage size in Supabase
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'image/jpeg' | 'image/webp' | 'image/png'
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'image/jpeg'
}

/**
 * Compress an image file to reduce size
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<Blob> - Compressed image blob
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        const maxWidth = opts.maxWidth!
        const maxHeight = opts.maxHeight!

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Create canvas for compression
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            resolve(blob)
          },
          opts.format,
          opts.quality
        )
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Convert compressed blob to base64 string for storage
 * @param blob - Compressed image blob
 * @returns Promise<string> - Base64 encoded image
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to convert blob to base64'))
    }
    
    reader.readAsDataURL(blob)
  })
}

/**
 * Compress image and return as base64 string
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<string> - Base64 encoded compressed image
 */
export async function compressImageToBase64(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const compressedBlob = await compressImage(file, options)
  return blobToBase64(compressedBlob)
}

/**
 * Get human-readable file size
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Compression presets for different use cases
 */
export const COMPRESSION_PRESETS = {
  // For gallery images - high quality
  gallery: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.9,
    format: 'image/jpeg' as const
  },
  
  // For product/menu images - balanced
  product: {
    maxWidth: 1200,
    maxHeight: 900,
    quality: 0.85,
    format: 'image/jpeg' as const
  },
  
  // For thumbnails - smaller size
  thumbnail: {
    maxWidth: 600,
    maxHeight: 400,
    quality: 0.8,
    format: 'image/jpeg' as const
  },
  
  // For profile pictures - square crop
  avatar: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.85,
    format: 'image/jpeg' as const
  },
  
  // For logos/icons - PNG format preserved
  logo: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.9,
    format: 'image/png' as const
  }
}
