"use client"
import { useFilters } from "@/context/FilterContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function HeaderFilters() {
  const [inputValue, setInputValue] = useState<string>("");
  const { updateSearchFilter } = useFilters();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    setInputValue(urlQuery);
    updateSearchFilter({ query: urlQuery });
  }, [searchParams, updateSearchFilter]);


  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (inputValue) {
      params.set("query", inputValue);
    } else {
      params.delete("query");
    }
    router.replace(`/${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center">
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
