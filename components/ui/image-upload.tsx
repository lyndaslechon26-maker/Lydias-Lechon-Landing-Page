"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { compressImageToBase64, formatFileSize, COMPRESSION_PRESETS } from "@/lib/image-compression"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  id?: string
  label?: string
  description?: string
  value?: string
  onChange: (base64: string) => void
  onClear?: () => void
  preset?: keyof typeof COMPRESSION_PRESETS
  required?: boolean
  className?: string
}

export function ImageUpload({
  id = "image-upload",
  label,
  description,
  value,
  onChange,
  onClear,
  preset = "product",
  required = false,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    setOriginalSize(file.size)

    try {
      // Compress image using the specified preset
      const compressedBase64 = await compressImageToBase64(
        file,
        COMPRESSION_PRESETS[preset]
      )

      // Calculate compressed size (rough estimate from base64 length)
      const base64Length = compressedBase64.length - "data:image/jpeg;base64,".length
      const compressedBytes = (base64Length * 3) / 4
      setCompressedSize(compressedBytes)

      onChange(compressedBase64)
    } catch (error) {
      console.error("Image compression error:", error)
      alert("Failed to compress image. Please try another image.")
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleClear = () => {
    onChange("")
    setOriginalSize(0)
    setCompressedSize(0)
    if (onClear) onClear()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="space-y-3">
        {/* Upload Area */}
        {!value ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-8 transition-colors hover:border-muted-foreground/50 hover:bg-muted/20 cursor-pointer",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-12 text-muted-foreground animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">
                  Compressing image...
                </p>
              </>
            ) : (
              <>
                <Upload className="size-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Click to upload image
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </>
            )}
          </div>
        ) : (
          /* Preview Area */
          <div className="relative rounded-lg border bg-card overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
            >
              <X className="size-4" />
            </Button>

            {/* Size Info */}
            {originalSize > 0 && compressedSize > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm px-3 py-2">
                <div className="flex items-center justify-between text-xs text-white">
                  <span>
                    Original: {formatFileSize(originalSize)}
                  </span>
                  <span>→</span>
                  <span className="font-semibold text-green-400">
                    Compressed: {formatFileSize(compressedSize)}
                  </span>
                  <span className="text-green-400">
                    ({Math.round(((originalSize - compressedSize) / originalSize) * 100)}% saved)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
