'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, Camera, RotateCw, Check, X } from 'lucide-react';

export default function ProfileAvatarPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(
    session?.user?.image || null
  );
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset any previous errors
    setError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewAvatar(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle click on upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle avatar save
  const handleSave = async () => {
    if (!newAvatar) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create a form data object to send the image
      const formData = new FormData();
      // Convert base64 to blob
      const blob = await fetch(newAvatar).then((r) => r.blob());
      formData.append('avatar', blob);

      // Upload the image
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload avatar');
      }

      const data = await response.json();

      // Update the session with the new avatar URL
      await update({
        ...session,
        user: {
          ...session?.user,
          image: data.imageUrl,
        },
      });

      // Update local state
      setAvatar(data.imageUrl);
      setNewAvatar(null);

      // Redirect back to profile
      router.push('/profile');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setNewAvatar(null);
    setError(null);
  };

  // Handle take photo (in a real implementation, this would use the webcam API)
  const handleTakePhoto = () => {
    alert(
      'This feature is not implemented yet. Please upload an image instead.'
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Profile Picture</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col items-center">
          {/* Current or new avatar preview */}
          <div className="mb-6 relative">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {newAvatar || avatar ? (
                <Image
                  src={newAvatar || avatar || ''}
                  alt="Profile avatar"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-6xl text-gray-400">
                  {session?.user?.name?.[0] || '?'}
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 w-full max-w-md p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Upload/edit controls */}
          {!newAvatar ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Hidden file input with accessibility attributes */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                aria-label="Upload profile picture"
                id="avatar-upload"
              />

              {/* Upload button - add a label association */}
              <button
                onClick={handleUploadClick}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                aria-controls="avatar-upload"
              >
                <Upload size={18} className="mr-2" />
                Upload Image
              </button>

              {/* Take photo button */}
              <button
                onClick={handleTakePhoto}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Camera size={18} className="mr-2" />
                Take Photo
              </button>

              {/* Reset to default button - only show if there's an existing avatar */}
              {avatar && (
                <button
                  onClick={() => setNewAvatar('')}
                  className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <RotateCw size={18} className="mr-2" />
                  Remove Photo
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Save
                  </>
                )}
              </button>

              {/* Cancel button */}
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            Upload a profile picture to personalize your account. We recommend a
            square image of at least 400x400 pixels.
          </div>
        </div>
      </div>
    </div>
  );
}
