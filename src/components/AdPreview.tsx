// components/AdPreview.tsx
import Image from 'next/image'

interface AdPreviewProps {
  ad: {
    title: string
    description: string
    image: string | null
    targetLocation: string
    budget: number
  }
}

export default function AdPreview({ ad }: AdPreviewProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {ad.image ? (
        <div className="relative h-48 mb-4">
          <Image 
            src={ad.image} 
            alt="Ad preview" 
            fill
            className="object-cover rounded"
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
          <span>Image Preview</span>
        </div>
      )}
      <h3 className="text-lg font-semibold">{ad.title}</h3>
      <p className="text-gray-600 mb-2">{ad.description}</p>
      <div className="text-sm text-gray-500">
        <p>Location: {ad.targetLocation}</p>
        <p>Budget: KES {ad.budget.toLocaleString()}</p>
      </div>
    </div>
  )
}