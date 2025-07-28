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
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [generationFilter, setGenerationFilter] = useState<string>('');
  
  const { searchTerm, setSearchTerm } = useSearch();
  const debouncedNameSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error, refetch } = api.pokemon.getListWithDetails.useQuery({
    limit,
    offset,
    typeFilter: typeFilter || undefined,
    generationFilter: generationFilter || undefined,
    nameSearch: debouncedNameSearch || undefined,
  });

  const safeData: SafePokemonData = (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) ? data as SafePokemonData : { count: 0, results: [] };

  if (error) {
    logger.error('Pokemon list error', { 
      error: error.message, 
      filters: { typeFilter, generationFilter, searchTerm: debouncedNameSearch },
      pagination: { limit, offset }
    });

    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load Pokemon
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;re having trouble connecting to the Pokemon database. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left bg-red-50 p-4 rounded-lg">
              <summary className="cursor-pointer text-sm text-red-700 mb-2">
                Error Details (Development)
              </summary>
              <code className="text-xs text-red-800 block whitespace-pre-wrap">
                {error.message}
              </code>
            </details>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => void refetch()} variant="primary">
              🔄 Try Again
            </Button>
            <Button 
              onClick={() => {
                setOffset(0);
                setTypeFilter('');
                setGenerationFilter('');
                setSearchTerm('');
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
    setTypeFilter('');
    setGenerationFilter('');
    setSearchTerm('');
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
        <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-400"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            {searchTerm ? 'Searching Pokemon and their evolutions...' : 'Loading Pokemon...'}
          </p>
        </div>
      )}

      {data && (
        <>
          {safeData.results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pokemon found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? (
                  <>
                    No Pokemon matching &ldquo;{searchTerm}&rdquo; found.<br />
                    <span className="text-sm">Try searching for a different name or check the spelling.</span>
                  </>
                ) : (
                  'Try adjusting your filters to see more results.'
                )}
              </p>
              {(typeFilter || generationFilter || searchTerm) && (
                <Button onClick={clearFilters} className="mt-2 text-white bg-red-500 hover:bg-red-600">
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {safeData.results.map((pokemon: PokemonListItemWithDetails) => (
                <ErrorBoundary 
                  key={pokemon.id}
                  fallback={
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-red-400 text-2xl mb-2">0e0f</div>
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