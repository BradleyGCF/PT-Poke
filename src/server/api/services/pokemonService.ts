import { PokemonSchema, PokemonSpeciesSchema, PokemonListResponseSchema, PokemonListItemWithDetailsSchema, EvolutionItemSchema, type PokemonListItemWithDetails, type EvolutionItem } from "~/types/pokemon";
import { logger } from "~/utils";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

const pokemonCache = new Map<string, PokemonListItemWithDetails>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000;

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

function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, expiry] of cacheExpiry.entries()) {
    if (now > expiry) {
      pokemonCache.delete(key);
      cacheExpiry.delete(key);
    }
  }
}

async function getCachedPokemonDetails(pokemon: { name: string; url: string }): Promise<PokemonListItemWithDetails | null> {
  const cacheKey = pokemon.name;
  const now = Date.now();
  
  if (pokemonCache.has(cacheKey)) {
    const expiry = cacheExpiry.get(cacheKey);
    if (expiry && now < expiry) {
      return pokemonCache.get(cacheKey)!;
    }
  }

  try {
    const pokemonData = await fetchPokemonDetails(pokemon.url);
    const parsedPokemon = PokemonSchema.parse(pokemonData);
    const speciesResponse = await fetch(parsedPokemon.species.url);
    if (!speciesResponse.ok) throw new Error(`Failed to fetch species for ${pokemon.name}`);
    const speciesData: unknown = await speciesResponse.json();
    const parsedSpecies = PokemonSpeciesSchema.parse(speciesData);
    
    const result = PokemonListItemWithDetailsSchema.parse({
      id: parsedPokemon.id,
      name: parsedPokemon.name,
      types: parsedPokemon.types.map(t => t.type.name),
      generation: getGenerationDisplayName(parsedSpecies.generation.name),
      sprite: parsedPokemon.sprites.other?.["official-artwork"]?.front_default ?? parsedPokemon.sprites.front_default,
    });

    pokemonCache.set(cacheKey, result);
    cacheExpiry.set(cacheKey, now + CACHE_DURATION);
    
    return result;
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
}

export async function getEvolutionChain(speciesUrl: string): Promise<string[]> {
  try {
    const speciesResponse = await fetch(speciesUrl);
    if (!speciesResponse.ok) return [];
    const speciesData: unknown = await speciesResponse.json();
    
    if (!speciesData || typeof speciesData !== 'object' || !('evolution_chain' in speciesData)) {
      return [];
    }
    
    const speciesObj = speciesData as { evolution_chain?: { url: string } };
    const evolutionChainUrl = speciesObj.evolution_chain?.url;
    if (!evolutionChainUrl) return [];
    
    const evolutionResponse = await fetch(evolutionChainUrl);
    if (!evolutionResponse.ok) return [];
    
    const evolutionData: unknown = await evolutionResponse.json();
    
    if (!evolutionData || typeof evolutionData !== 'object' || !('chain' in evolutionData)) {
      return [];
    }
    
    const evolutionObj = evolutionData as { chain: EvolutionChainNode };
    const pokemonNames: string[] = [];
    
    function extractEvolutions(evolution: EvolutionChainNode): void {
      if (evolution?.species?.name) {
        pokemonNames.push(evolution.species.name);
      }
      if (evolution?.evolves_to) {
        evolution.evolves_to.forEach((evo) => extractEvolutions(evo));
      }
    }
    
    extractEvolutions(evolutionObj.chain);
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
        const pokemonData: unknown = await pokemonResponse.json();
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
    cleanExpiredCache();
    
    const isNameSearch = !!input.nameSearch;
    const isOtherFiltered = (input.typeFilter && input.typeFilter.trim() !== '') ?? 
                            (input.generationFilter && input.generationFilter.trim() !== '');
    
    let batchSize: number;
    if (isNameSearch) {
      batchSize = 400; 
    } else if (input.generationFilter) {
      batchSize = 1000; 
    } else if (input.typeFilter) {
      batchSize = 600; 
    } else {
      batchSize = input.limit; 
    }
    
    const fetchOffset = (isNameSearch || isOtherFiltered) ? 0 : input.offset;

    const response = await fetch(
      `${POKEAPI_BASE_URL}/pokemon?limit=${batchSize}&offset=${fetchOffset}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon list");
    }
    const listData: unknown = await response.json();
    const pokemonList = PokemonListResponseSchema.parse(listData);

    const detailedPokemon: PokemonListItemWithDetails[] = [];
    const batchProcessSize = 15; 
    
    if (isNameSearch) {
      const normalizedSearch = normalizeSearchTerm(input.nameSearch!);
      const quickMatches = pokemonList.results.filter(pokemon => 
        normalizeSearchTerm(pokemon.name).includes(normalizedSearch)
      );
      
      for (let i = 0; i < quickMatches.length; i += batchProcessSize) {
        const batch = quickMatches.slice(i, i + batchProcessSize);
        const batchResults = await Promise.all(
          batch.map(pokemon => getCachedPokemonDetails(pokemon))
        );
        const validResults = batchResults.filter((result): result is PokemonListItemWithDetails => result !== null);
        detailedPokemon.push(...validResults);
      }
    } else {
      for (let i = 0; i < pokemonList.results.length; i += batchProcessSize) {
        const batch = pokemonList.results.slice(i, i + batchProcessSize);
        const batchResults = await Promise.all(
          batch.map(pokemon => getCachedPokemonDetails(pokemon))
        );
        const validResults = batchResults.filter((result): result is PokemonListItemWithDetails => result !== null);
        detailedPokemon.push(...validResults);
      }
    }
    
    detailedPokemon.sort((a, b) => a.id - b.id);

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
        afterCount: filteredPokemon.length,
        batchSize: batchSize
      });
    }
    
    if (input.nameSearch) {
      logger.debug('Starting evolution search', { 
        searchTerm: input.nameSearch, 
        directMatches: filteredPokemon.length 
      });
      
      const searchResults: PokemonListItemWithDetails[] = [...filteredPokemon];
      const evolutionFamilies = new Set<string>();
      const evolutionPromises: Promise<void>[] = [];
      
      for (const pokemon of filteredPokemon) {
        evolutionPromises.push(
          (async () => {
            try {
              const pokemonDetails = await fetchPokemonDetails(pokemon.name);
              const evolutionNames = await getEvolutionChain(pokemonDetails.species.url);
              logger.debug('Evolution chain found', { 
                pokemon: pokemon.name, 
                evolutions: evolutionNames 
              });
              evolutionNames.forEach(name => evolutionFamilies.add(name));
            } catch (error) {
              logger.error('Error getting evolution family', { pokemonName: pokemon.name, error });
            }
          })()
        );
      }
      
      await Promise.all(evolutionPromises);
      
      const evolutionNamesToFetch = Array.from(evolutionFamilies).filter(name => 
        !searchResults.some(p => p.name === name)
      );
      
      logger.debug('Fetching missing evolutions', { 
        evolutionFamilies: Array.from(evolutionFamilies),
        missing: evolutionNamesToFetch 
      });
      
      for (let i = 0; i < evolutionNamesToFetch.length; i += batchProcessSize) {
        const batch = evolutionNamesToFetch.slice(i, i + batchProcessSize);
        const evolutionResults = await Promise.all(
          batch.map(async (pokemonName) => {
            try {
              const pokemonData = await fetchPokemonDetails(pokemonName);
              const parsedPokemon = PokemonSchema.parse(pokemonData);
              const speciesResponse = await fetch(parsedPokemon.species.url);
              if (!speciesResponse.ok) throw new Error(`Failed to fetch species for ${pokemonName}`);
              const speciesData: unknown = await speciesResponse.json();
              const parsedSpecies = PokemonSpeciesSchema.parse(speciesData);
              
              return PokemonListItemWithDetailsSchema.parse({
                id: parsedPokemon.id,
                name: parsedPokemon.name,
                types: parsedPokemon.types.map(t => t.type.name),
                generation: getGenerationDisplayName(parsedSpecies.generation.name),
                sprite: parsedPokemon.sprites.other?.["official-artwork"]?.front_default ?? parsedPokemon.sprites.front_default,
              });
            } catch (error) {
              logger.error(`Error fetching evolution details for ${pokemonName}`, { error });
              return null;
            }
          })
        );
        
        const validEvolutions = evolutionResults.filter((result): result is PokemonListItemWithDetails => result !== null);
        searchResults.push(...validEvolutions);
      }
      
      const uniqueResults = searchResults.filter((pokemon, index, self) => 
        index === self.findIndex(p => p.id === pokemon.id)
      );
      
      filteredPokemon = uniqueResults.sort((a, b) => a.id - b.id);
      
      logger.debug('Evolution search completed', { 
        searchTerm: input.nameSearch,
        finalResults: filteredPokemon.length,
        pokemonFound: filteredPokemon.map(p => p.name)
      });
    }
    
    const isFiltered = isNameSearch || isOtherFiltered;
    const startIndex = isFiltered ? input.offset : 0;
    const endIndex = startIndex + input.limit;
    const paginatedResults = filteredPokemon.slice(startIndex, endIndex);
    
    const parsedListData = PokemonListResponseSchema.parse(listData);
    const totalCount = isFiltered ? 
      Math.max(filteredPokemon.length, input.offset + paginatedResults.length + (paginatedResults.length === input.limit ? input.limit : 0)) :
      parsedListData.count;
    const hasNext = isFiltered ? 
      (filteredPokemon.length > endIndex) || (paginatedResults.length === input.limit && filteredPokemon.length === batchSize) :
      !!parsedListData.next;
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
