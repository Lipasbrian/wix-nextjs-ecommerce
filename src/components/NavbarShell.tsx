import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './SearchBar'
import Navicons from './Navicons'
import Menu from './Menu'

export default function NavbarShell({
  itemCount,
  onCartClick
}: {
  itemCount: number
  onCartClick: () => void
}) {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm h-20">
      <div className='h-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative'>
        {/* Mobile Layout */}
        <div className="md:hidden h-full flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <div className='text-2xl tracking-wide'>LAMA</div>
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-md"
              aria-label="Cart"
            >
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <Menu />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className='hidden md:flex items-center justify-between gap-8 h-full'>
          {/* Left Section */}
          <div className='w-1/3 xl:w-1/2 flex items-center gap-3'>
            <Link href="/" className='flex items-center gap-3'>
              <Image src="/logo.png" alt="LAMA Logo" width={24} height={24} />
              <div className='text-2xl tracking-wide'>LAMA</div>
            </Link>
            <div className='hidden xl:flex gap-4'>
              <Link href="/">Homepage</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/deals">Deals</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          {/* Right Section */}
          <div className='w-2/3 xl:w-1/2 flex items-center justify-between gap-8'>
            <SearchBar />
            <div className="flex items-center gap-4">
              <Navicons />
              <button 
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-md"
                aria-label="Cart"
              >
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}