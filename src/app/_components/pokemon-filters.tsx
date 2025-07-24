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
    <div className="space-y-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 p-5 shadow-sm">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClearFilters}
            className="text-sm text-orange-600 hover:text-orange-500 font-medium transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* All Selectors and Results Count in One Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Selects on the left */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Type Filter */}
          <Select
            label="Type:"
            options={TYPE_OPTIONS}
            value={TYPE_OPTIONS.find(option => option.value === filters.typeFilter) || TYPE_OPTIONS[0]!}
            onChange={(selected) => onTypeChange(selected.value as string)}
            minWidth="150px"
          />

          {/* Generation Filter */}
          <Select
            label="Generation:"
            options={GENERATION_OPTIONS}
            value={GENERATION_OPTIONS.find(option => option.value === filters.generationFilter) || GENERATION_OPTIONS[0]!}
            onChange={(selected) => onGenerationChange(selected.value as string)}
            minWidth="180px"
          />

          {/* Results Per Page */}
          <Select
            label="Show:"
            options={PER_PAGE_OPTIONS}
            value={PER_PAGE_OPTIONS.find(option => option.value === filters.limit) || PER_PAGE_OPTIONS[1]!}
            onChange={(selected) => onLimitChange(selected.value as number)}
            minWidth="120px"
          />
        </div>

        {/* Results Count on the right */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {totalCount !== undefined ? (
            `Showing ${offset + 1}-${Math.min(offset + filters.limit, totalCount)} of ${totalCount.toLocaleString()} Pokemon`
          ) : (
            <span className="animate-pulse">Loading...</span>
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