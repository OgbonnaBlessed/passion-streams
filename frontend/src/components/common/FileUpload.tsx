import { useState, useRef } from 'react';
import { uploadService, UploadResponse } from '../../services/uploadService';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiLoader } from 'react-icons/fi';

interface FileUploadProps {
  onUploadComplete: (response: UploadResponse) => void;
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

export default function FileUpload({
  onUploadComplete,
  folder = 'uploads',
  accept = 'image/*',
  maxSize = 10,
  multiple = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      toast.error('Invalid file type');
      return;
    }

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    setUploading(true);

    try {
      const response = await uploadService.uploadFile(file, folder);
      onUploadComplete(response);
      toast.success('File uploaded successfully');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full px-4 py-3 border-2 border-dashed border-accent-white rounded-lg hover:border-primary-blue transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin text-primary-blue" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FiUpload className="w-5 h-5 text-primary-blue" />
              <span>Choose file</span>
            </>
          )}
        </button>
      </div>

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-background rounded-full hover:bg-primary-pink transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

