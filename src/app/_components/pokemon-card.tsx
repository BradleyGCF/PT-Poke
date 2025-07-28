"use client";

import Link from "next/link";
import { Card, SafeImage } from "~/components";
import { getTypeColor } from "~/constants/pokemon";
import type { PokemonListItemWithDetails } from "~/types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonListItemWithDetails;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.name}`} className="group block">
      <Card className="transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
        <div className="p-4">
          {/* Pokemon Image */}
          <div className="mb-4 flex justify-center">
            <div className="relative h-24 w-24">
              {pokemon.sprite ? (
                <SafeImage
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                  fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32'%3E🔍%3C/text%3E%3C/svg%3E"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200">
                  <span className="text-sm text-gray-400">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Pokemon ID */}
          <div className="mb-2 text-center">
            <span className="font-mono text-xs text-gray-500">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>

          {/* Pokemon Name */}
          <h3 className="mb-3 text-center text-lg font-semibold capitalize transition-colors group-hover:text-red-600">
            {pokemon.name}
          </h3>

          {/* Generation */}
          <div className="mb-3 text-center">
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {pokemon.generation}
            </span>
          </div>

          {/* Types */}
          <div className="flex flex-wrap justify-center gap-1">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`rounded-full px-2 py-1 text-xs text-white capitalize ${getTypeColor(type)}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
