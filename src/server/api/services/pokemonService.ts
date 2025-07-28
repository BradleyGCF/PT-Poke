import { PokemonSchema, PokemonSpeciesSchema, PokemonListResponseSchema, PokemonListItemWithDetailsSchema, EvolutionItemSchema, type PokemonListItemWithDetails, type EvolutionItem } from "~/types/pokemon";
import { logger } from "~/utils";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export function extractIdFromUrl(url: string): number {
  const matches = /\/(\d+)\/$/.exec(url);
  return matches ? parseInt(matches[1]!, 10) : 0;
}

export function getGenerationDisplayName(generationName: string): string {
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

export async function getEvolutionChain(speciesUrl: string): Promise<string[]> {
  try {
    const speciesResponse = await fetch(speciesUrl);
    if (!speciesResponse.ok) return [];
    const speciesData = await speciesResponse.json() as { evolution_chain?: { url: string } };
    const evolutionChainUrl = speciesData.evolution_chain?.url;
    if (!evolutionChainUrl) return [];
    const evolutionResponse = await fetch(evolutionChainUrl);
    if (!evolutionResponse.ok) return [];
    const evolutionData = await evolutionResponse.json() as { chain: EvolutionChainNode };
    const pokemonNames: string[] = [];
    function extractEvolutions(evolution: EvolutionChainNode): void {
      if (evolution?.species?.name) {
        pokemonNames.push(evolution.species.name);
      }
      if (evolution?.evolves_to) {
        evolution.evolves_to.forEach((evo) => extractEvolutions(evo));
      }
    }
    extractEvolutions(evolutionData.chain);
    return pokemonNames;
  } catch (error) {
    logger.error('Error fetching evolution chain', { error, speciesUrl });
    return [];
  }
}

export async function getDetailedEvolutions(speciesUrl: string): Promise<EvolutionItem[]> {
  try {
    const evolutionNames = await getEvolutionChain(speciesUrl);
    const evolutions: EvolutionItem[] = [];
    for (const name of evolutionNames) {
      try {
        const pokemonResponse = await fetch(`${POKEAPI_BASE_URL}/pokemon/${name}`);
        if (!pokemonResponse.ok) continue;
        const pokemonData = await pokemonResponse.json();
        const parsedPokemon = PokemonSchema.parse(pokemonData);
        evolutions.push(EvolutionItemSchema.parse({
          id: parsedPokemon.id,
          name: parsedPokemon.name,
          sprite: parsedPokemon.sprites.other?.["official-artwork"]?.front_default ?? parsedPokemon.sprites.front_default,
        }));
      } catch (error) {
        logger.error(`Error fetching evolution details for ${name}`, { error });
      }
    }
    return evolutions.sort((a, b) => a.id - b.id);
  } catch (error) {
    logger.error('Error fetching detailed evolutions', { error, speciesUrl });
    return [];
  }
}

export interface EvolutionChainNode {
  species: { name: string };
  evolves_to: EvolutionChainNode[];
}

export function normalizeSearchTerm(term: string): string {
  return term.toLowerCase().trim();
}

export interface BasicPokemonDetails {
  species: { url: string };
  [key: string]: unknown;
}

export async function fetchPokemonDetails(nameOrUrl: string): Promise<BasicPokemonDetails> {
  const url = nameOrUrl.startsWith('http') ? nameOrUrl : `${POKEAPI_BASE_URL}/pokemon/${nameOrUrl}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon details for ${nameOrUrl}`);
  }
  return response.json() as Promise<BasicPokemonDetails>;
}

export async function getListWithDetailsService(input: {
  limit: number;
  offset: number;
  typeFilter?: string;
  generationFilter?: string;
  nameSearch?: string;
}) {
  try {
    const isNameSearch = !!input.nameSearch;
    const isOtherFiltered = (input.typeFilter && input.typeFilter.trim() !== '') || 
                            (input.generationFilter && input.generationFilter.trim() !== '');
    const batchSize = isNameSearch ? 1000 : (isOtherFiltered ? 1000 : input.limit);
    const fetchOffset = (isNameSearch || isOtherFiltered) ? 0 : input.offset;

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
    const batchProcessSize = 20;
    for (let i = 0; i < pokemonList.results.length; i += batchProcessSize) {
      const batch = pokemonList.results.slice(i, i + batchProcessSize);
      const batchResults = await Promise.all(
        batch.map(async (pokemon) => {
          try {
            const pokemonData = await fetchPokemonDetails(pokemon.url);
            const parsedPokemon = PokemonSchema.parse(pokemonData);
            const speciesResponse = await fetch(parsedPokemon.species.url);
            if (!speciesResponse.ok) throw new Error(`Failed to fetch species for ${pokemon.name}`);
            const speciesData = await speciesResponse.json();
            const parsedSpecies = PokemonSpeciesSchema.parse(speciesData);
            return PokemonListItemWithDetailsSchema.parse({
              id: parsedPokemon.id,
              name: parsedPokemon.name,
              types: parsedPokemon.types.map(t => t.type.name),
              generation: getGenerationDisplayName(parsedSpecies.generation.name),
              sprite: parsedPokemon.sprites.other?.["official-artwork"]?.front_default ?? parsedPokemon.sprites.front_default,
            });
          } catch (error) {
            logger.error(`Error fetching details for Pokemon`, { pokemonName: pokemon.name, error });
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
    detailedPokemon.sort((a, b) => a.id - b.id);

    // Apply filters if specified
    let filteredPokemon = detailedPokemon;
    if (input.typeFilter && input.typeFilter.trim() !== '') {
      filteredPokemon = filteredPokemon.filter(pokemon => 
        pokemon.types.some(type => type.toLowerCase() === input.typeFilter!.toLowerCase())
      );
    }
    if (input.generationFilter && input.generationFilter.trim() !== '') {
      const beforeCount = filteredPokemon.length;
      filteredPokemon = filteredPokemon.filter(pokemon => 
        pokemon.generation === input.generationFilter
      );
      logger.debug('Generation filter applied', { 
        generation: input.generationFilter, 
        beforeCount, 
        afterCount: filteredPokemon.length 
      });
    }
    // Apply name search with evolution support
    if (input.nameSearch) {
      const searchResults: PokemonListItemWithDetails[] = [];
      const normalizedSearch = normalizeSearchTerm(input.nameSearch);
      const evolutionFamilies = new Set<string>();
      // First, find direct matches and get their evolution families
      for (const pokemon of filteredPokemon) {
        if (normalizeSearchTerm(pokemon.name).includes(normalizedSearch)) {
          searchResults.push(pokemon);
          // Also get this Pokemon's evolution family to include relatives
          try {
            const pokemonDetails = await fetchPokemonDetails(pokemon.name);
            const evolutionNames = await getEvolutionChain(pokemonDetails.species.url);
            evolutionNames.forEach(name => evolutionFamilies.add(name));
          } catch (error) {
            logger.error('Error getting evolution family', { pokemonName: pokemon.name, error });
          }
        }
      }
      // Now add any Pokemon from those evolution families that aren't already included
      for (const pokemon of filteredPokemon) {
        if (!searchResults.some(p => p.name === pokemon.name) && evolutionFamilies.has(pokemon.name)) {
          searchResults.push(pokemon);
        }
      }
      filteredPokemon = searchResults;
    }
    // Apply pagination to filtered results
    const isFiltered = isNameSearch || isOtherFiltered;
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
    logger.error('Error in getListWithDetailsService', { 
      error, 
      input: { ...input, nameSearch: input.nameSearch ? '[REDACTED]' : undefined } 
    });
    throw new Error("Failed to fetch Pokemon with details");
  }
}
