import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { 
  PokemonSchema, 
  PokemonListResponseSchema, 
  PokemonSpeciesSchema,
  PokemonListItemWithDetailsSchema,
  type PokemonListItemWithDetails 
} from "~/types/pokemon";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

// Helper function to extract Pokemon ID from URL
function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? parseInt(matches[1]!, 10) : 0;
}

// Helper function to get generation display name
function getGenerationDisplayName(generationName: string): string {
  const generationMap: Record<string, string> = {
    'generation-i': 'Generation I (Kanto)',
    'generation-ii': 'Generation II (Johto)', 
    'generation-iii': 'Generation III (Hoenn)',
    'generation-iv': 'Generation IV (Sinnoh)',
    'generation-v': 'Generation V (Unova)',
    'generation-vi': 'Generation VI (Kalos)',
    'generation-vii': 'Generation VII (Alola)',
    'generation-viii': 'Generation VIII (Galar)',
    'generation-ix': 'Generation IX (Paldea)',
  };
  return generationMap[generationName] ?? generationName;
}

export const pokemonRouter = createTRPCRouter({
  getList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${POKEAPI_BASE_URL}/pokemon?limit=${input.limit}&offset=${input.offset}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon list");
      }
      
      const data = await response.json();
      return PokemonListResponseSchema.parse(data);
    }),

  getListWithDetails: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        typeFilter: z.string().optional(),
        generationFilter: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        // For filtered requests, we need to fetch more data upfront to have enough results
        // But we'll use a reasonable batch size instead of 1000
        const isFiltered = input.typeFilter || input.generationFilter;
        const batchSize = isFiltered ? Math.min(200, input.limit * 10) : input.limit;
        const fetchOffset = isFiltered ? 0 : input.offset;
        
        // First get the basic list
        const response = await fetch(
          `${POKEAPI_BASE_URL}/pokemon?limit=${batchSize}&offset=${fetchOffset}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon list");
        }
        
        const listData = await response.json();
        const pokemonList = PokemonListResponseSchema.parse(listData);
        
        // Fetch detailed information for each Pokemon in smaller batches
        const detailedPokemon: PokemonListItemWithDetails[] = [];
        const batchProcessSize = 20; // Process 20 Pokemon at a time to avoid overwhelming the API
        
        for (let i = 0; i < pokemonList.results.length; i += batchProcessSize) {
          const batch = pokemonList.results.slice(i, i + batchProcessSize);
          
          const batchResults = await Promise.all(
            batch.map(async (pokemon) => {
            try {
              // Get Pokemon details
              const pokemonResponse = await fetch(pokemon.url);
              if (!pokemonResponse.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
              const pokemonData = await pokemonResponse.json();
              const parsedPokemon = PokemonSchema.parse(pokemonData);
              
              // Get species information for generation
              const speciesResponse = await fetch(parsedPokemon.species.url);
              if (!speciesResponse.ok) throw new Error(`Failed to fetch species for ${pokemon.name}`);
              const speciesData = await speciesResponse.json();
              const parsedSpecies = PokemonSpeciesSchema.parse(speciesData);
              
              return PokemonListItemWithDetailsSchema.parse({
                id: parsedPokemon.id,
                name: parsedPokemon.name,
                types: parsedPokemon.types.map(t => t.type.name),
                generation: getGenerationDisplayName(parsedSpecies.generation.name),
                sprite: parsedPokemon.sprites.other?.["official-artwork"]?.front_default || 
                        parsedPokemon.sprites.front_default,
              });
            } catch (error) {
              console.error(`Error fetching details for ${pokemon.name}:`, error);
              // Return basic info if detailed fetch fails
              const id = extractIdFromUrl(pokemon.url);
              return PokemonListItemWithDetailsSchema.parse({
                id,
                name: pokemon.name,
                types: [],
                generation: 'Unknown',
                sprite: null,
              });
            }
          })
        );
          
          detailedPokemon.push(...batchResults);
        }
        
        // Sort by ID to maintain order
        detailedPokemon.sort((a, b) => a.id - b.id);
        
        // Apply filters if specified
        let filteredPokemon = detailedPokemon;
        
        if (input.typeFilter) {
          filteredPokemon = filteredPokemon.filter(pokemon => 
            pokemon.types.some(type => type.toLowerCase() === input.typeFilter!.toLowerCase())
          );
        }
        
        if (input.generationFilter) {
          filteredPokemon = filteredPokemon.filter(pokemon => 
            pokemon.generation === input.generationFilter
          );
        }
        
        // Apply pagination to filtered results
        const startIndex = isFiltered ? input.offset : 0;
        const endIndex = startIndex + input.limit;
        const paginatedResults = filteredPokemon.slice(startIndex, endIndex);
        
        // For filtered results, estimate total count (since we didn't fetch everything)
        // For unfiltered results, use the API's total count
        const totalCount = isFiltered ? 
          Math.max(filteredPokemon.length, input.offset + paginatedResults.length + (paginatedResults.length === input.limit ? input.limit : 0)) :
          listData.count;
        
        // Determine if there are more results
        const hasNext = isFiltered ? 
          (filteredPokemon.length > endIndex) || (paginatedResults.length === input.limit && filteredPokemon.length === batchSize) :
          !!listData.next;
        const hasPrevious = startIndex > 0;
        
        return {
          count: totalCount,
          next: hasNext ? `${startIndex + input.limit}` : null,
          previous: hasPrevious ? `${Math.max(0, startIndex - input.limit)}` : null,
          results: paginatedResults,
        };
      } catch (error) {
        console.error('Error in getListWithDetails:', error);
        throw new Error("Failed to fetch Pokemon with details");
      }
    }),

  getByNameOrId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${input.toLowerCase()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Pokemon not found");
        }
        throw new Error("Failed to fetch Pokemon");
      }
      
      const data = await response.json();
      return PokemonSchema.parse(data);
    }),

  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      // For a simple search, we'll get the first 1000 Pokemon and filter
      const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=1000`);
      
      if (!response.ok) {
        throw new Error("Failed to search Pokemon");
      }
      
      const data = await response.json();
      const parsedData = PokemonListResponseSchema.parse(data);
      
      // Filter by name
      const filtered = parsedData.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(input.query.toLowerCase())
      );
      
      return {
        ...parsedData,
        results: filtered.slice(0, input.limit),
        count: filtered.length,
      };
    }),
}); 