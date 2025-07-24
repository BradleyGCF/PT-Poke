export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export * from "./hooks";

// Logger utility
export { logger } from "./logger"; 