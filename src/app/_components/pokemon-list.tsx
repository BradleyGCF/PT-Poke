"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button, ErrorBoundary } from "~/components";
import { PokemonCard } from "./pokemon-card";
import { PokemonFilters } from "./pokemon-filters";
import { PokemonPagination } from "./pokemon-pagination";
import { useDebounce } from "~/utils/hooks";
import { useSearch } from "~/contexts/search-context";
import { logger } from "~/utils";
import type { PokemonListItemWithDetails } from "~/types/pokemon";

interface PokemonListProps {
  initialLimit?: number;
}

interface SafePokemonData {
  count: number;
  results: PokemonListItemWithDetails[];
  next?: string;
}

export function PokemonList({ initialLimit = 20 }: PokemonListProps) {
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [generationFilter, setGenerationFilter] = useState<string>("");

  const { searchTerm, setSearchTerm } = useSearch();
  const debouncedNameSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error, refetch } =
    api.pokemon.getListWithDetails.useQuery({
      limit,
      offset,
      typeFilter: typeFilter || undefined,
      generationFilter: generationFilter || undefined,
      nameSearch: debouncedNameSearch || undefined,
    });

  const safeData: SafePokemonData =
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray(data.results)
      ? (data as SafePokemonData)
      : { count: 0, results: [] };

  if (error) {
    logger.error("Pokemon list error", {
      error: error.message,
      filters: {
        typeFilter,
        generationFilter,
        searchTerm: debouncedNameSearch,
      },
      pagination: { limit, offset },
    });

    return (
      <div className="py-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-4 text-6xl">🔍</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Unable to load Pokemon
          </h2>
          <p className="mb-6 text-gray-600">
            We&apos;re having trouble connecting to the Pokemon database. Please
            try again.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mb-6 rounded-lg bg-red-50 p-4 text-left">
              <summary className="mb-2 cursor-pointer text-sm text-red-700">
                Error Details (Development)
              </summary>
              <code className="block text-xs whitespace-pre-wrap text-red-800">
                {error.message}
              </code>
            </details>
          )}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => void refetch()} variant="primary">
              🔄 Try Again
            </Button>
            <Button
              onClick={() => {
                setOffset(0);
                setTypeFilter("");
                setGenerationFilter("");
                setSearchTerm("");
              }}
              variant="secondary"
            >
              🏠 Reset Filters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePreviousPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  const handleNextPage = () => {
    if (data?.next) {
      setOffset(offset + limit);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  };

  const handleTypeFilterChange = (newType: string) => {
    setTypeFilter(newType);
    setOffset(0);
  };

  const handleGenerationFilterChange = (newGeneration: string) => {
    setGenerationFilter(newGeneration);
    setOffset(0);
  };

  const clearFilters = () => {
    setTypeFilter("");
    setGenerationFilter("");
    setSearchTerm("");
    setOffset(0);
  };

  const handlePageClick = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (
    <div className="space-y-6">
      <PokemonFilters
        filters={{
          typeFilter,
          generationFilter,
          limit,
        }}
        onTypeChange={handleTypeFilterChange}
        onGenerationChange={handleGenerationFilterChange}
        onLimitChange={handleLimitChange}
        onClearFilters={clearFilters}
        totalCount={safeData.count}
        offset={offset}
      />

      {isLoading && (
        <div className="py-12 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-400"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            {searchTerm
              ? "Searching Pokemon and their evolutions..."
              : "Loading Pokemon..."}
          </p>
        </div>
      )}

      {data && (
        <>
          {safeData.results.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No Pokemon found
              </h3>
              <p className="mb-4 text-gray-500">
                {searchTerm ? (
                  <>
                    No Pokemon matching &ldquo;{searchTerm}&rdquo; found.
                    <br />
                    <span className="text-sm">
                      Try searching for a different name or check the spelling.
                    </span>
                  </>
                ) : (
                  "Try adjusting your filters to see more results."
                )}
              </p>
              {(typeFilter || generationFilter || searchTerm) && (
                <Button
                  onClick={clearFilters}
                  className="mt-2 bg-red-500 text-white hover:bg-red-600"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {safeData.results.map((pokemon: PokemonListItemWithDetails) => (
                <ErrorBoundary
                  key={pokemon.id}
                  fallback={
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                      <div className="mb-2 text-2xl text-red-400">0e0f</div>
                      <p className="text-sm text-red-600">
                        Error loading {pokemon.name}
                      </p>
                    </div>
                  }
                >
                  <PokemonCard pokemon={pokemon} />
                </ErrorBoundary>
              ))}
            </div>
          )}

          {safeData.results.length > 0 && (
            <PokemonPagination
              offset={offset}
              limit={limit}
              totalCount={safeData.count}
              hasNext={!!safeData.next}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              onPageClick={handlePageClick}
            />
          )}
        </>
      )}
    </div>
  );
}
