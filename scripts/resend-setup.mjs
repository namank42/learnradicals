// Creates the Resend lists (segments) and contact fields the character quiz uses. Safe to rerun.
// Usage: node --env-file=.env.local scripts/resend-setup.mjs
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SEGMENTS = { RESEND_SEGMENT_QUIZ: "Character quiz", RESEND_SEGMENT_BUYERS: "Character buyers" };
const PROPERTIES = ["quiz_result", "quiz_character", "quiz_animal", "quiz_element"];

const must = (res, what) => {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  return res.data;
};

const existing = must(await resend.segments.list(), "list segments").data ?? [];
const out = {};
for (const [env, name] of Object.entries(SEGMENTS)) {
  const found = existing.find((s) => s.name === name);
  const id = found ? found.id : must(await resend.segments.create({ name }), `create segment ${name}`).id;
  out[env] = id;
  console.error(`${found ? "exists " : "created"}  segment  ${name}`);
}

const props = must(await resend.contactProperties.list(), "list contact properties").data ?? [];
for (const key of PROPERTIES) {
  if (props.some((p) => p.key === key)) {
    console.error(`exists   field    ${key}`);
  } else {
    must(await resend.contactProperties.create({ key, type: "string" }), `create field ${key}`);
    console.error(`created  field    ${key}`);
  }
}

for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`);
