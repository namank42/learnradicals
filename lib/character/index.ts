import { ANIMAL_PROFILES } from "./content/animals";
import { CHARACTERS_BY_SLUG } from "./content/characters";
import { ELEMENT_PROFILES } from "./content/elements";
import { decodeResultId, type ResultId } from "./ids";
import type { AnimalProfile, CharacterEntry, ElementProfile } from "./types";

export type ResultView = {
  id: ResultId;
  character: CharacterEntry;
  animal: AnimalProfile;
  element: ElementProfile;
  pair: CharacterEntry;
};

/** Assembles everything a result page, card or reading needs. Null for unknown ids. */
export function getResult(id: string): ResultView | null {
  const parsed = decodeResultId(id);
  if (!parsed) return null;
  const character = CHARACTERS_BY_SLUG.get(parsed.slug);
  const animal = ANIMAL_PROFILES.find((a) => a.animal === parsed.animal);
  const element = ELEMENT_PROFILES.find((e) => e.element === parsed.element);
  const pair = character && CHARACTERS_BY_SLUG.get(character.pairsWith);
  if (!character || !animal || !element || !pair) return null;
  return { id, character, animal, element, pair };
}
