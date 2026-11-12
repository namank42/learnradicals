import type { CharacterEntry } from "../types";
import { CONNECTION } from "./characters-connection";
import { STRENGTH } from "./characters-strength";
import { REST_JOY } from "./characters-rest-joy";

export const CHARACTERS: CharacterEntry[] = [...CONNECTION, ...STRENGTH, ...REST_JOY];

export const CHARACTERS_BY_SLUG: ReadonlyMap<string, CharacterEntry> = new Map(
  CHARACTERS.map((c) => [c.slug, c]),
);
