"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { SafeImage } from "~/components";
import { getTypeColor } from "~/constants/pokemon";
import type { PokemonDetailed } from "~/types/pokemon";

interface PokemonDetailsProps {
  pokemon: PokemonDetailed;
}

export function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  const router = useRouter();
  
  const statNames: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  };

  const getStatColor = (statValue: number): string => {
    if (statValue >= 120) return "bg-green-500";
    if (statValue >= 90) return "bg-blue-500";
    if (statValue >= 60) return "bg-yellow-500";
    if (statValue >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const handleBackClick = () => {
    // Always navigate to home page
    router.push('/');
  };

  // Get the primary type for background
  const primaryType = pokemon.types[0] || 'normal';

  // Custom background configuration - Easy to modify
  const getCustomBackground = (type: string): string => {
    const backgrounds: Record<string, string> = {
      normal: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      fire: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 30%, #fca5a5 60%, #f87171 100%)',
      water: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 30%, #93c5fd 60%, #60a5fa 100%)',
      electric: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fcd34d 60%, #f59e0b 100%)',
      grass: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 30%, #6ee7b7 60%, #34d399 100%)',
      ice: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 60%, #7dd3fc 100%)',
      fighting: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #ec4899 100%)',
      poison: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 30%, #c4b5fd 60%, #a78bfa 100%)',
      ground: 'linear-gradient(135deg, #fef7cd 0%, #fef08a 30%, #fde047 60%, #eab308 100%)',
      flying: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)',
      psychic: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 60%, #f9a8d4 100%)',
      bug: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 60%, #86efac 100%)',
      rock: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 30%, #e7e5e4 60%, #d6d3d1 100%)',
      ghost: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 60%, #64748b 100%)',
      dragon: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 30%, #d8b4fe 60%, #c084fc 100%)',
      dark: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 30%, #94a3b8 60%, #475569 100%)',
      steel: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 60%, #cbd5e1 100%)',
      fairy: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 60%, #f472b6 100%)',
    };

    return backgrounds[type] ?? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
  };

  const backgroundGradient = getCustomBackground(primaryType);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Custom Background for Pokemon Details Page */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: backgroundGradient,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 space-y-6 p-6">
        {/* Back Button */}
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Pokemon List
          </button>
        </div>

        {/* Main Pokemon Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Sticky Pokemon Image */}
          <div className="lg:sticky lg:top-8 lg:h-fit flex justify-center items-start">
            <div className="w-[550px] h-[550px]">
              {pokemon.sprite ? (
                <SafeImage
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  width={450}
                  height={450}
                  className="w-full h-full object-contain"
                  fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='450' height='450' viewBox='0 0 450 450'%3E%3Crect width='450' height='450' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='90'%3E🔍%3C/text%3E%3C/svg%3E"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xl">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - All Pokemon Data */}
          <div className="space-y-6">
            {/* Pokemon ID and Name */}
            <div className="space-y-2">
              <span className="text-lg text-gray-500 font-mono">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 capitalize">
                {pokemon.name}
              </h1>
            </div>

            {/* Generation */}
            <div>
              <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                {pokemon.generation}
              </span>
            </div>

            {/* Types without Icons */}
            <div className="flex flex-wrap gap-3">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`px-4 py-2 rounded-full text-white font-medium capitalize ${getTypeColor(type)}`}
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Physical Stats */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Physical Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Height</div>
                  <div className="text-lg font-semibold">{pokemon.height / 10} m</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Weight</div>
                  <div className="text-lg font-semibold">{pokemon.weight / 10} kg</div>
                </div>
              </div>
              {pokemon.base_experience && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Base Experience</div>
                  <div className="text-lg font-semibold">{pokemon.base_experience}</div>
                </div>
              )}
            </div>

            {/* Battle Stats */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Battle Stats</h3>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {statNames[stat.name] || stat.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {stat.base_stat}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStatColor(stat.base_stat)}`}
                        style={{
                          width: `${Math.min((stat.base_stat / 200) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilities */}
            {pokemon.abilities.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Abilities</h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        ability.is_hidden 
                          ? "bg-yellow-50 border-yellow-200" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="capitalize font-medium">
                        {ability.name.replace("-", " ")}
                      </span>
                      {ability.is_hidden && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evolution Chain - Full Width */}
        {pokemon.evolutions.length > 1 && (
          <div className="pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Evolution Chain</h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {pokemon.evolutions.map((evolution, index) => (
                <div key={evolution.id} className="flex items-center">
                  <Link
                    href={`/pokemon/${evolution.name}`}
                    className={`group block ${
                      evolution.name === pokemon.name
                        ? "ring-4 ring-orange-400 rounded-lg"
                        : "hover:ring-2 hover:ring-gray-300 rounded-lg transition-all"
                    }`}
                  >
                    <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-gray-100 group-hover:border-gray-200 transition-colors">
                      <div className="text-center space-y-2">
                        <div className="w-20 h-20 mx-auto">
                          {evolution.sprite ? (
                            <SafeImage
                              src={evolution.sprite}
                              alt={evolution.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-contain"
                              fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24'%3E🔍%3C/text%3E%3C/svg%3E"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500 font-mono">
                            #{evolution.id.toString().padStart(3, '0')}
                          </div>
                          <div className={`text-sm font-medium capitalize ${
                            evolution.name === pokemon.name
                              ? "text-orange-600"
                              : "text-gray-700 group-hover:text-gray-900"
                          }`}>
                            {evolution.name}
                          </div>
                          {evolution.name === pokemon.name && (
                            <div className="text-xs text-orange-600 font-medium">
                              Current
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Arrow between evolutions */}
                  {index < pokemon.evolutions.length - 1 && (
                    <div className="mx-2 text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 