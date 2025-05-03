'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdPreview from '@/components/AdPreview';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AdFormData, ApiResponse } from '@/types/api';

const adSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size <= 5_000_000, 'Max image size is 5MB'),
  targetLocation: z.string().min(1, 'Location is required'),
  budget: z.number().min(500, 'Minimum budget is KES 500'),
});

export default function CreateAdPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [_isSubmitting, setIsSubmitting] = useState(false); // Prefix with _ to ignore
  const [_submitError, _setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const [_isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoading(true);
      fetch('/api/verifyToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.valid) {
            router.push('/login');
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          router.push('/login');
        });
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      image: undefined,
      targetLocation: '',
      budget: 1000,
    },
  });

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue('image', file);
      trigger('image');
    }
  }

  const handleSubmitForm: SubmitHandler<AdFormData> = async (data) => {
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('image', data.image);
      formData.append('targetLocation', data.targetLocation);
      formData.append('budget', data.budget.toString());

      const response = await fetch('/api/vendor/ads', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create ad');
      }

      router.push('/vendor/ads');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ad creation error:', error.message);
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:flex gap-6">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="md:w-1/2 space-y-6"
      >
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Ad Title *
          </label>
          <input
            type="text" // Add this line to fix the empty type
            id="title"
            {...register('title')}
            placeholder="Enter ad title"
            className={`w-full p-3 border rounded-lg ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Detailed description of your ad"
            rows={5}
            className={`w-full p-3 border rounded-lg ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image Field */}
        <div>
          <label htmlFor="image" className="block mb-2 font-medium">
            Ad Image *
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={`w-full p-2 border rounded-lg ${
              errors.image ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={errors.image ? 'true' : 'false'}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label htmlFor="location" className="block mb-2 font-medium">
            Target Location *
          </label>
          <select
            id="location"
            {...register('targetLocation')}
            className={`w-full p-3 border rounded-lg ${
              errors.targetLocation ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.targetLocation ? 'true' : 'false'}
          >
            <option value="">Select Location</option>
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
            <option value="nakuru">Nakuru</option>
          </select>
          {errors.targetLocation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.targetLocation.message}
            </p>
          )}
        </div>
        {/* Budget Field */}
        <div>
          <label htmlFor="budget" className="block mb-2 font-medium">
            Budget (KES) *
          </label>
          <input
            type="number"
            id="budget"
            {...register('budget', { valueAsNumber: true })}
            placeholder="Enter budget in KES"
            className={`w-full p-3 border rounded-lg ${
              errors.budget ? 'border-red-500' : 'border-gray-300'
            }`}
            min="500"
            aria-invalid={errors.budget ? 'true' : 'false'}
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={_isSubmitting}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {_isSubmitting ? 'Creating Ad...' : 'Create Ad'}
        </button>
      </form>
      {/* Preview Section */}
      <div className="md:w-1/2 mt-6 md:mt-0">
        <h2 className="text-xl font-semibold mb-4">Ad Preview</h2>
        <AdPreview
          ad={[
            {
              title: watch('title') || 'Ad Title',
              description: watch('description') || 'Ad Description',
              image: previewImage,
              targetLocation: watch('targetLocation') || 'Location',
              budget: watch('budget') || 0,
            },
          ]}
        />
      </div>
    </div>
  );
}
