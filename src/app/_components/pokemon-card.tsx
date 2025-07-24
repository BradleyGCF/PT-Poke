"use client";

import { Card, SafeImage } from "~/components";
import { getTypeColor } from "~/constants/pokemon";
import type { PokemonListItemWithDetails } from "~/types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonListItemWithDetails;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {

  return (
    <Card>
      <div className="p-4">
        {/* Pokemon Image */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 relative">
            {pokemon.sprite ? (
              <SafeImage
                src={pokemon.sprite}
                alt={pokemon.name}
                width={96}
                height={96}
                className="w-full h-full object-contain"
                fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32'%3E🔍%3C/text%3E%3C/svg%3E"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Pokemon ID */}
        <div className="text-center mb-2">
          <span className="text-xs text-gray-500 font-mono">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>

        {/* Pokemon Name */}
        <h3 className="text-lg font-semibold text-center mb-3 capitalize">
          {pokemon.name}
        </h3>

        {/* Generation */}
        <div className="text-center mb-3">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {pokemon.generation}
          </span>
        </div>

        {/* Types */}
        <div className="flex flex-wrap justify-center gap-1">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`text-xs text-white px-2 py-1 rounded-full capitalize ${getTypeColor(type)}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
} 