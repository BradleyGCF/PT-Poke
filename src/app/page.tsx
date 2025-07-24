import { PokemonList } from "./_components";

export default async function Home() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Pokemon Collection
        </h1>
        <p className="mt-3 text-xl text-gray-500">
        Discover, explore, and master every Pokémon from all generations — all in one place.
        </p>
      </div>

      {/* Pokemon List */}
      <PokemonList initialLimit={20} />
    </div>
  );
}
