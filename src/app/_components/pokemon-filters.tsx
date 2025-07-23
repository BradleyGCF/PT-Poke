"use client";

import { Select } from "~/components";
import { TYPE_OPTIONS, GENERATION_OPTIONS, PER_PAGE_OPTIONS } from "~/constants/pokemon";

interface FilterState {
  typeFilter: string;
  generationFilter: string;
  limit: number;
}

interface PokemonFiltersProps {
  filters: FilterState;
  onTypeChange: (type: string) => void;
  onGenerationChange: (generation: string) => void;
  onLimitChange: (limit: number) => void;
  onClearFilters: () => void;
  totalCount?: number;
  offset: number;
}

export function PokemonFilters({
  filters,
  onTypeChange,
  onGenerationChange,
  onLimitChange,
  onClearFilters,
  totalCount,
  offset,
}: PokemonFiltersProps) {
  const hasActiveFilters = filters.typeFilter || filters.generationFilter;

  return (
    <div className="space-y-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {totalCount !== undefined ? (
              <>
                Showing <span className="font-semibold text-gray-900">{offset + 1}</span>-
                <span className="font-semibold text-gray-900">{Math.min(offset + filters.limit, totalCount)}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalCount}</span> Pokemon
                {hasActiveFilters && (
                  <span className="text-orange-600"> (filtered)</span>
                )}
              </>
            ) : (
              'Loading...'
            )}
          </p>
        </div>
        
        {/* Selectors Container */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Type Filter */}
          <Select
            label="Type"
            options={TYPE_OPTIONS}
            value={TYPE_OPTIONS.find(option => option.value === filters.typeFilter) || TYPE_OPTIONS[0]!}
            onChange={(selected) => onTypeChange(selected.value as string)}
            minWidth="140px"
          />

          {/* Generation Filter */}
          <Select
            label="Generation"
            options={GENERATION_OPTIONS}
            value={GENERATION_OPTIONS.find(option => option.value === filters.generationFilter) || GENERATION_OPTIONS[0]!}
            onChange={(selected) => onGenerationChange(selected.value as string)}
            minWidth="180px"
          />
          
          {/* Limit selector */}
          <Select
            label="Show"
            options={PER_PAGE_OPTIONS}
            value={PER_PAGE_OPTIONS.find(option => option.value === filters.limit) || PER_PAGE_OPTIONS[1]!}
            onChange={(selected) => onLimitChange(selected.value as number)}
            minWidth="140px"
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-orange-600 hover:text-orange-500 font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.typeFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
              Type: {TYPE_OPTIONS.find(t => t.value === filters.typeFilter)?.name}
              <button
                onClick={() => onTypeChange('')}
                className="ml-1 text-orange-600 hover:text-orange-500"
              >
                ×
              </button>
            </span>
          )}
          {filters.generationFilter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {GENERATION_OPTIONS.find(g => g.value === filters.generationFilter)?.name}
              <button
                onClick={() => onGenerationChange('')}
                className="ml-1 text-blue-600 hover:text-blue-500"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 