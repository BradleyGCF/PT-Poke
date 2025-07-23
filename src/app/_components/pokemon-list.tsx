"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components";
import { PokemonCard } from "./pokemon-card";
import { PokemonFilters } from "./pokemon-filters";
import { PokemonPagination } from "./pokemon-pagination";

interface PokemonListProps {
  initialLimit?: number;
}

export function PokemonList({ initialLimit = 20 }: PokemonListProps) {
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [generationFilter, setGenerationFilter] = useState<string>('');

  const { data, isLoading, error, refetch } = api.pokemon.getListWithDetails.useQuery({
    limit,
    offset,
    typeFilter: typeFilter || undefined,
    generationFilter: generationFilter || undefined,
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Error loading Pokemon</p>
          <p className="text-sm">{error.message}</p>
        </div>
        <Button onClick={() => void refetch()}>
          Try Again
        </Button>
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
    setOffset(0);
  };

  const handlePageClick = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
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
        totalCount={data?.count}
        offset={offset}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-400"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading Pokemon...</p>
        </div>
      )}

      {/* Pokemon Grid */}
      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.results.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {/* Pagination */}
          <PokemonPagination
            offset={offset}
            limit={limit}
            totalCount={data.count}
            hasNext={!!data.next}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onPageClick={handlePageClick}
          />
        </>
      )}
    </div>
  );
} 