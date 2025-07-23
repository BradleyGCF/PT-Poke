import { z } from "zod";

export const PokemonSpeciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  generation: z.object({
    name: z.string(),
    url: z.string(),
  }),
});

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable(),
  species: z.object({
    name: z.string(),
    url: z.string(),
  }),
  sprites: z.object({
    front_default: z.string().nullable(),
    front_shiny: z.string().nullable(),
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().nullable(),
      }),
    }).optional(),
  }),
  types: z.array(
    z.object({
      type: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: z.object({
        name: z.string(),
      }),
    })
  ),
  abilities: z.array(
    z.object({
      ability: z.object({
        name: z.string(),
        url: z.string(),
      }),
      is_hidden: z.boolean(),
    })
  ),
});

export const PokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(PokemonListItemSchema),
});

// Extended schema for listing with complete information
export const PokemonListItemWithDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  types: z.array(z.string()),
  generation: z.string(),
  sprite: z.string().nullable(),
});

export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type PokemonListItem = z.infer<typeof PokemonListItemSchema>;
export type PokemonListResponse = z.infer<typeof PokemonListResponseSchema>;
export type PokemonListItemWithDetails = z.infer<typeof PokemonListItemWithDetailsSchema>; 