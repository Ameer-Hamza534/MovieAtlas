import React from 'react'
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="p-0 flex gap-3 items-center w-112.5 bg-[#fff3] rounded-md px-4 py-2">
        <Search className='text-gray-400' size={20} />
        <input className='w-full bg-transparent border-none focus:outline-none' type="text" placeholder="Search movies/TV shows..." />
    </div>
  )
}

export default SearchBar