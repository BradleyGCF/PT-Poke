// Type filter options
export const TYPE_OPTIONS = [
  { id: 'all', name: 'All Types', value: '' },
  { id: 'normal', name: 'Normal', value: 'normal' },
  { id: 'fire', name: 'Fire', value: 'fire' },
  { id: 'water', name: 'Water', value: 'water' },
  { id: 'electric', name: 'Electric', value: 'electric' },
  { id: 'grass', name: 'Grass', value: 'grass' },
  { id: 'ice', name: 'Ice', value: 'ice' },
  { id: 'fighting', name: 'Fighting', value: 'fighting' },
  { id: 'poison', name: 'Poison', value: 'poison' },
  { id: 'ground', name: 'Ground', value: 'ground' },
  { id: 'flying', name: 'Flying', value: 'flying' },
  { id: 'psychic', name: 'Psychic', value: 'psychic' },
  { id: 'bug', name: 'Bug', value: 'bug' },
  { id: 'rock', name: 'Rock', value: 'rock' },
  { id: 'ghost', name: 'Ghost', value: 'ghost' },
  { id: 'dragon', name: 'Dragon', value: 'dragon' },
  { id: 'dark', name: 'Dark', value: 'dark' },
  { id: 'steel', name: 'Steel', value: 'steel' },
  { id: 'fairy', name: 'Fairy', value: 'fairy' },
] as const;

// Generation filter options
export const GENERATION_OPTIONS = [
  { id: 'all', name: 'All Generations', value: '' },
  { id: 'gen1', name: 'Generation I (Kanto)', value: 'Generation I (Kanto)' },
  { id: 'gen2', name: 'Generation II (Johto)', value: 'Generation II (Johto)' },
  { id: 'gen3', name: 'Generation III (Hoenn)', value: 'Generation III (Hoenn)' },
  { id: 'gen4', name: 'Generation IV (Sinnoh)', value: 'Generation IV (Sinnoh)' },
  { id: 'gen5', name: 'Generation V (Unova)', value: 'Generation V (Unova)' },
  { id: 'gen6', name: 'Generation VI (Kalos)', value: 'Generation VI (Kalos)' },
  { id: 'gen7', name: 'Generation VII (Alola)', value: 'Generation VII (Alola)' },
  { id: 'gen8', name: 'Generation VIII (Galar)', value: 'Generation VIII (Galar)' },
  { id: 'gen9', name: 'Generation IX (Paldea)', value: 'Generation IX (Paldea)' },
] as const;

// Per page options
export const PER_PAGE_OPTIONS = [
  { id: 10, name: '10 per page', value: 10 },
  { id: 20, name: '20 per page', value: 20 },
  { id: 30, name: '30 per page', value: 30 },
  { id: 50, name: '50 per page', value: 50 },
] as const;

// Type colors mapping
export const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
} as const;

// Helper function to get type color
export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? "bg-gray-400";
} 