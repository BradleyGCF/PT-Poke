export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export * from "./hooks";

export * from "./avatar";
export { logger } from "./logger";
