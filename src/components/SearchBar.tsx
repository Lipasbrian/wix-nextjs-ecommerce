'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const SearchBar = () => {
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("query") as string
    if (query.trim()) {
      router.push(`/list?query=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="flex items-center gap-2 bg-purple-800 p-3 rounded-lg flex-1"
    >
      <input
        name="query"
        type="text"
        placeholder="Search products..."
        aria-label="Search"
        className="flex-1 bg-transparent outline-none placeholder-purple-300 text-white"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="text-purple-200 hover:text-white transition-colors"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>
    </form>
  )
}

export default SearchBar