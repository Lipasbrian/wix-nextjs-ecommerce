'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Define validation schema
const surveySchema = z.object({
  businessType: z.string().min(1, "Business type is required"),
  weeklyBudget: z.number().min(500, "Minimum budget is KES 500"),
  targetLocations: z.array(z.string()).min(1, "Select at least one location"),
  preferredAdTypes: z.array(z.string()).min(1, "Select at least one ad type")
})

type SurveyData = z.infer<typeof surveySchema>

export default function VendorSurvey() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SurveyData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      targetLocations: [],
      preferredAdTypes: []
    }
  })

  const onSubmit = async (data: SurveyData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }

      setSubmitSuccess(true)
      reset() // Reset form after successful submission
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p>Your survey has been submitted successfully.</p>
        </div>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Another Survey
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Needs Survey</h1>
      
      {submitError && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Business Type *</label>
          <select
            {...register("businessType")}
            className={`w-full p-2 border rounded ${errors.businessType ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select your business type</option>
            <option value="restaurant">Restaurant</option>
            <option value="retail">Retail Shop</option>
            <option value="service">Service Provider</option>
          </select>
          {errors.businessType && (
            <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Weekly Ad Budget (KES) *</label>
          <input
            type="number"
            {...register("weeklyBudget", { valueAsNumber: true })}
            className={`w-full p-2 border rounded ${errors.weeklyBudget ? 'border-red-500' : 'border-gray-300'}`}
            min="500"
            step="100"
            placeholder="500"
          />
          {errors.weeklyBudget && (
            <p className="mt-1 text-sm text-red-600">{errors.weeklyBudget.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Target Locations *</label>
          <div className="space-y-2">
            {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map((location) => (
              <label key={location} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={location.toLowerCase()}
                  {...register("targetLocations")}
                  className="rounded border-gray-300"
                />
                <span>{location}</span>
              </label>
            ))}
          </div>
          {errors.targetLocations && (
            <p className="mt-1 text-sm text-red-600">{errors.targetLocations.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Preferred Ad Types *</label>
          <div className="space-y-2">
            {['Banner Ads', 'Social Media', 'Email', 'Search Ads'].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={type.toLowerCase()}
                  {...register("preferredAdTypes")}
                  className="rounded border-gray-300"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
          {errors.preferredAdTypes && (
            <p className="mt-1 text-sm text-red-600">{errors.preferredAdTypes.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  )
}