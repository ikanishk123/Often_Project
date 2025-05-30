import { CLOUDINARY_CONFIG, FEATURES } from "@/lib/config"

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
  duration?: number
}

export interface CloudinaryError {
  message: string
  http_code: number
}

/**
 * Upload a file to Cloudinary
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  if (!FEATURES.ENABLE_CLOUDINARY) {
    throw new Error(
      "Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    )
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET)

  // Add additional parameters
  formData.append("folder", "travel-invites")
  formData.append("resource_type", "auto") // Automatically detect file type

  try {
    const response = await fetch(CLOUDINARY_CONFIG.API_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`)
    }

    const result: CloudinaryUploadResult = await response.json()
    return result
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to upload to Cloudinary")
  }
}

/**
 * Generate a Cloudinary URL with transformations
 */
export function generateCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: "fill" | "fit" | "scale" | "crop" | "thumb"
    quality?: "auto" | number
    format?: "auto" | "jpg" | "png" | "webp"
  } = {},
): string {
  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    return ""
  }

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`

  const transformations: string[] = []

  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  if (options.format) transformations.push(`f_${options.format}`)

  const transformationString = transformations.length > 0 ? `${transformations.join(",")}/` : ""

  return `${baseUrl}/${transformationString}${publicId}`
}

/**
 * Delete a file from Cloudinary (requires server-side implementation)
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This would typically be done on the server side with your API key and secret
  // For now, we'll just log it
  console.log("Delete from Cloudinary:", publicId)

  // In a real implementation, you would call your backend API:
  // const response = await fetch('/api/cloudinary/delete', {
  //   method: 'DELETE',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ publicId })
  // })
}

/**
 * Get optimized image URL for different use cases
 */
export function getOptimizedImageUrl(publicId: string, type: "thumbnail" | "preview" | "full" = "preview"): string {
  switch (type) {
    case "thumbnail":
      return generateCloudinaryUrl(publicId, {
        width: 300,
        height: 200,
        crop: "fill",
        quality: "auto",
        format: "auto",
      })
    case "preview":
      return generateCloudinaryUrl(publicId, {
        width: 800,
        height: 600,
        crop: "fit",
        quality: "auto",
        format: "auto",
      })
    case "full":
      return generateCloudinaryUrl(publicId, {
        quality: "auto",
        format: "auto",
      })
    default:
      return generateCloudinaryUrl(publicId)
  }
}
