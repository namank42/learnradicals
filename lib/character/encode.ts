import type { Animal, Element } from "./types";

/** `${slug}-${animal}-${element}`, e.g. "wisdom-rabbit-water". Content-free so client code can import it. */
export type ResultId = string;

export function encodeResultId(slug: string, animal: Animal, element: Element): ResultId {
  return `${slug}-${animal}-${element}`;
}
