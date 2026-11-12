import { CHARACTERS_BY_SLUG } from "./content/characters";
import { ANIMALS, ELEMENTS, type Animal, type Element } from "./types";

export { encodeResultId, type ResultId } from "./encode";

export function decodeResultId(
  id: string,
): { slug: string; animal: Animal; element: Element } | null {
  const parts = id.split("-");
  if (parts.length !== 3) return null;
  const [slug, animal, element] = parts;
  if (!CHARACTERS_BY_SLUG.has(slug)) return null;
  if (!(ANIMALS as readonly string[]).includes(animal)) return null;
  if (!(ELEMENTS as readonly string[]).includes(element)) return null;
  return { slug, animal: animal as Animal, element: element as Element };
}
