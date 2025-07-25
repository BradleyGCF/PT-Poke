import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { PokemonDetails } from "../../_components";

interface PokemonPageProps {
  params: Promise<{
    nameOrId: string;
  }>;
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  try {
    const { nameOrId } = await params;
    const pokemon = await api.pokemon.getDetailedByNameOrId(nameOrId);
    
    return (
      <div className="max-w-7xl mx-auto">
        <PokemonDetails pokemon={pokemon} />
      </div>
    );
  } catch (error) {
    console.error("Error loading Pokemon:", error);
    redirect("/");
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: PokemonPageProps) {
  try {
    const { nameOrId } = await params;
    const pokemon = await api.pokemon.getDetailedByNameOrId(nameOrId);
    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokemon Details`,
      description: `Learn about ${pokemon.name}, a ${pokemon.types.join(", ")} type Pokemon from ${pokemon.generation}.`,
    };
  } catch {
    return {
      title: "Pokemon App",
      description: "Pokemon application.",
    };
  }
} 