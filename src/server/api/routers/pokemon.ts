import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  PokemonSchema,
  PokemonListResponseSchema,
  PokemonSpeciesSchema,
  PokemonDetailedSchema,
  type PokemonDetailed,
} from "~/types/pokemon";
import { logger } from "~/utils";
import {
  getGenerationDisplayName,
  getDetailedEvolutions,
  getListWithDetailsService,
} from "~/server/api/services/pokemonService";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const pokemonRouter = createTRPCRouter({
  getList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `${POKEAPI_BASE_URL}/pokemon?limit=${input.limit}&offset=${input.offset}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Pokemon list");
      }

      const data: unknown = await response.json();
      const parsed = PokemonListResponseSchema.parse(data);
      return parsed;
    }),

  getListWithDetails: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
        typeFilter: z.string().optional(),
        generationFilter: z.string().optional(),
        nameSearch: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        return await getListWithDetailsService(input);
      } catch (error) {
        logger.error("Error in getListWithDetails", {
          error,
          input: {
            ...input,
            nameSearch: input.nameSearch ? "[REDACTED]" : undefined,
          },
        });
        throw new Error("Failed to fetch Pokemon with details");
      }
    }),

  getByNameOrId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const response = await fetch(
      `${POKEAPI_BASE_URL}/pokemon/${input.toLowerCase()}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Pokemon not found");
      }
      throw new Error("Failed to fetch Pokemon");
    }

    const data: unknown = await response.json();
    const parsed = PokemonSchema.parse(data);
    return parsed;
  }),

  getDetailedByNameOrId: publicProcedure
    .input(z.string())
    .query(async ({ input }): Promise<PokemonDetailed> => {
      try {
        const pokemonResponse = await fetch(
          `${POKEAPI_BASE_URL}/pokemon/${input.toLowerCase()}`,
        );

        if (!pokemonResponse.ok) {
          if (pokemonResponse.status === 404) {
            throw new Error("Pokemon not found");
          }
          throw new Error("Failed to fetch Pokemon");
        }

        const pokemonData: unknown = await pokemonResponse.json();
        const parsedPokemon = PokemonSchema.parse(pokemonData);

        const speciesResponse = await fetch(parsedPokemon.species.url);
        if (!speciesResponse.ok) {
          throw new Error("Failed to fetch Pokemon species");
        }

        const speciesData: unknown = await speciesResponse.json();
        const parsedSpecies = PokemonSpeciesSchema.parse(speciesData);

        const evolutions = await getDetailedEvolutions(
          parsedPokemon.species.url,
        );

        const detailedPokemon: PokemonDetailed = PokemonDetailedSchema.parse({
          id: parsedPokemon.id,
          name: parsedPokemon.name,
          height: parsedPokemon.height,
          weight: parsedPokemon.weight,
          base_experience: parsedPokemon.base_experience,
          types: parsedPokemon.types.map((t) => t.type.name),
          generation: getGenerationDisplayName(parsedSpecies.generation.name),
          sprite:
            parsedPokemon.sprites.other?.["official-artwork"]?.front_default ??
            parsedPokemon.sprites.front_default,
          sprites: {
            front_default: parsedPokemon.sprites.front_default,
            front_shiny: parsedPokemon.sprites.front_shiny,
            back_default:
              (parsedPokemon.sprites as { back_default?: string | null })
                .back_default ?? null,
            back_shiny:
              (parsedPokemon.sprites as { back_shiny?: string | null })
                .back_shiny ?? null,
            official_artwork:
              parsedPokemon.sprites.other?.["official-artwork"]?.front_default,
          },
          stats: parsedPokemon.stats.map((stat) => ({
            name: stat.stat.name,
            base_stat: stat.base_stat,
          })),
          abilities: parsedPokemon.abilities.map((ability) => ({
            name: ability.ability.name,
            is_hidden: ability.is_hidden,
          })),
          evolutions,
        });

        return detailedPokemon;
      } catch (error) {
        logger.error("Error in getDetailedByNameOrId", {
          error,
          input: input.slice(0, 50), // Truncate input for logging
        });
        throw error;
      }
    }),

  someProtectedEndpoint: protectedProcedure
    .input(
      z.object({
        /* ... */
      }),
    )
    .mutation(async () => {
      // Only authenticated users can reach this point
    }),
});
