"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useSearch } from "~/contexts/search-context";

export function NavbarSearch() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
      <div className="grid w-full grid-cols-1 sm:max-w-xs">
        <input
          name="search"
          type="search"
          placeholder="Search Pokemon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-600"
        />
      </div>
    </div>
  );
}
