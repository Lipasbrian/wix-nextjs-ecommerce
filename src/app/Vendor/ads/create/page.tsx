
'use client'
import { useState, ChangeEvent } from 'react'
import AdPreview from '@/components/AdPreview'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const adSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  image: z.instanceof(File, { message: "Image is required" })
    .refine(file => file.size <= 5_000_000, "Max image size is 5MB"),
  targetLocation: z.string().min(1, "Location is required"),
  budget: z.number().min(500, "Minimum budget is KES 500")
})

export default function CreateAd() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      image: undefined,
      targetLocation: '',
      budget: 1000
    }
  })

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
      setValue('image', file)
      trigger('image')
    }
  }

  function onSubmit(data: any) {
    console.log('Submitting:', data)
  }

  return (
    <div className="container mx-auto p-4 md:flex gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">Ad Title *</label>
          <input type=''
            id="title"
            {...register('title')}
            placeholder="Enter ad title"
            className={`w-full p-3 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.title ? "true" : "false"}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium">Description *</label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Detailed description of your ad"
            rows={5}
            className={`w-full p-3 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.description ? "true" : "false"}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Image Field */}
        <div>
          <label htmlFor="image" className="block mb-2 font-medium">Ad Image *</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={`w-full p-2 border rounded-lg ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={errors.image ? "true" : "false"}
          />
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
        </div>

        {/* Location Field */}
        <div>
          <label htmlFor="location" className="block mb-2 font-medium">Target Location *</label>
          <select
            id="location"
            {...register('targetLocation')}
            className={`w-full p-3 border rounded-lg ${errors.targetLocation ? 'border-red-500' : 'border-gray-300'}`}
            aria-invalid={!!errors.targetLocation ? "true" : "false"}
          >
            <option value="">Select Location</option>
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
            <option value="nakuru">Nakuru</option>
          </select>
          {errors.targetLocation && <p className="mt-1 text-sm text-red-600">{errors.targetLocation.message}</p>}
        </div>
      </form>
    </div>
  )
}
