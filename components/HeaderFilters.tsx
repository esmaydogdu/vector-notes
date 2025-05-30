"use client"
import { useFilters } from "@/context/FilterContext";
import { useEffect, useState } from "react";
import Link from "next/link";
// interface SearchFilterProps {
//   toggleSidebar: () => void;
//   isSidebarOpen: boolean;
// }

export function HeaderFilters() {
  const [inputValue, setInputValue] = useState<string>("");
  const { searchFilter, updateSearchFilter } = useFilters();
  // const [sort, setSort] = useState<'date_asc' | 'date_desc'>('date_desc');

  // const sortOptions = [
  //   { value: 'date_desc', label: 'Date (Newest first)' },
  //   { value: 'date_asc', label: 'Date (Oldest first)' },
  // ];

  // const handleSort = (value: string) => {
  //   // setSort(value as 'date_asc' | 'date_desc');
  //   updateSearchFilter({ 
  //     ...searchFilter,
  //     // sort: value 
  //   });
  // };

  // Init filter values from context
  useEffect(() => {
    if (searchFilter.query) {
      setInputValue(searchFilter.query);
    }
  }, [searchFilter.query]);

  const handleSearch = () => {
    updateSearchFilter({ query: inputValue });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center">
          {/* <div className="w-[200px] self-end mr-4">
            <Dropdown
              options={sortOptions}
              value={sort}
              onChange={handleSort}
            />
        </div> */}
        <div className="flex-1 flex flex-row mr-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            className="bg-purple-300 hover:bg-purple-200 text-gray-900 font-normal text-base py-2 px-4 border border-gray-700 rounded cursor-pointer inline-block mr-4"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <Link href='/notes/new' className="bg-purple-300 hover:bg-purple-200 text-gray-900 font-normal text-base py-2 px-4 border border-gray-700 rounded cursor-pointer inline-block mr-4">+ New Note</Link>
      </div>
    </div>
  )
}
