"use client";

import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

interface PokemonPaginationProps {
  offset: number;
  limit: number;
  totalCount: number;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPageClick: (offset: number) => void;
}

export function PokemonPagination({
  offset,
  limit,
  totalCount,
  hasNext,
  onPrevious,
  onNext,
  onPageClick,
}: PokemonPaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  // Calculate which pages to show (show 5 pages around current)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Adjust range if at beginning or end
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + 4);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
  }

  const pages = [];

  // Always show first page if not in range
  if (startPage > 1) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageClick(0)}
        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
      >
        1
      </button>,
    );

    if (startPage > 2) {
      pages.push(
        <span
          key="ellipsis-start"
          className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
        >
          ...
        </span>,
      );
    }
  }

  // Show page numbers in range
  for (let i = startPage; i <= endPage; i++) {
    const isCurrentPage = i === currentPage;
    pages.push(
      <button
        key={i}
        onClick={() => onPageClick((i - 1) * limit)}
        aria-current={isCurrentPage ? "page" : undefined}
        className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
          isCurrentPage
            ? "border-red-400 text-red-500"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        }`}
      >
        {i}
      </button>,
    );
  }

  // Always show last page if not in range
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span
          key="ellipsis-end"
          className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
        >
          ...
        </span>,
      );
    }

    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageClick((totalPages - 1) * limit)}
        className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
      >
        {totalPages}
      </button>,
    );
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={onPrevious}
          disabled={offset === 0}
          className={`inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium ${
            offset === 0
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="mr-3 size-5 text-gray-400"
          />
          Previous
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">{pages}</div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium ${
            !hasNext
              ? "cursor-not-allowed text-gray-300"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Next
          <ArrowLongRightIcon
            aria-hidden="true"
            className="ml-3 size-5 text-gray-400"
          />
        </button>
      </div>
    </nav>
  );
}
