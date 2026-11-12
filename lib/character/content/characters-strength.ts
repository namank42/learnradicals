import type { CharacterEntry } from "../types";

export const STRENGTH: CharacterEntry[] = [
  {
    slug: "endurance",
    char: "忍",
    pinyin: "rěn",
    meaning: "to endure",
    parts: [
      { char: "刃", gloss: "blade" },
      { char: "心", gloss: "heart" },
    ],
    decode: "Endurance is a blade balanced on your heart.",
    about:
      "You're the one who keeps going when the room goes quiet. Luna reads 忍 as a blade balanced on a heart, and that's you: something sharp held so steadily that nobody sees it wobble. You carry hard things with a straight back. You finish what you start. When plans fall apart, you're the one still standing in the kitchen at midnight, quietly working out plan B. People lean on you without always noticing they're leaning. They feel calmer when you're in the room, because you don't flinch. Your patience isn't weakness. It's strength with excellent manners. Here's the gentle shadow: you can hold the blade so long that you forget you're allowed to put it down. You say you're fine out of habit. You wait to rest until everything is handled, and everything is never handled. What you need is someone who notices the weight without being told. You need permission to set the blade on the table for an hour and let your heart be just a heart. Endurance doesn't have to be forever. It's a skill you get to use when you choose. And you, of all people, have earned the right to choose.",
    words: [
      { hanzi: "忍不住", pinyin: "rěn bu zhù", en: "can't help it" }, // review: neutral-tone 不 (bu); some sources write rěn bú zhù
      { hanzi: "忍受", pinyin: "rěn shòu", en: "to bear" },
      { hanzi: "忍耐", pinyin: "rěn nài", en: "patience" }, // review: HSK 5+, not 1–4
    ],
    hardDays:
      "You don't have to hold the blade all day. Set it down for an hour. You'll still be strong when you pick it back up.",
    pairsWith: "healing",
  },
  {
    slug: "healing",
    char: "愈",
    pinyin: "yù",
    meaning: "to heal",
    parts: [
      { char: "俞", gloss: "a canoe" },
      { char: "心", gloss: "a heart" },
    ],
    decode: "Healing is a heart that learns to float again.",
    about:
      "You're the one who knows what it's like to sink a little, and to rise anyway. Luna reads 愈 as a heart that learns to float again. Not a heart that never got wet. A heart that hit the water, felt the cold, and figured out how to stay up. That's your quiet superpower. You've been through things, and you didn't come out hard. You came out soft in the right places. People sense that. They tell you things they haven't told anyone, because you listen like someone who's been there. You don't rush anyone's healing, including your own, most days. The shadow side: sometimes you treat your own mending like a project with a deadline. You check your progress. You wonder why you're not over it yet. But canoes don't race the river. They drift, they steady, they find the current. What you need is time without a timer. Slow mornings. People who don't need you to be fully okay to love you. Water to rest on. You already know how to float. Some days you just need to be reminded that floating counts as moving forward.",
    words: [
      { hanzi: "治愈", pinyin: "zhì yù", en: "to heal" }, // review: no common HSK 1–4 words contain 愈
      { hanzi: "愈合", pinyin: "yù hé", en: "to close up (a wound)" },
      { hanzi: "愈来愈", pinyin: "yù lái yù", en: "more and more" }, // review: formal/written; everyday form is 越来越
    ],
    hardDays:
      "Sinking a little today doesn't undo the floating. Lie back. Let the water hold you. You know how to do this.",
    pairsWith: "rest",
  },
  {
    slug: "alive",
    char: "活",
    pinyin: "huó",
    meaning: "alive",
    parts: [
      { char: "氵", gloss: "water" },
      { char: "舌", gloss: "a tongue" },
    ],
    decode: "Being alive is water on your tongue.",
    about:
      "You're the one who tastes everything. Luna reads 活 as water on your tongue, and that's exactly how you move through the world: thirsty, curious, awake. You notice the first cold sip on a hot day. You remember what the street smelled like after rain on a trip years ago. You say yes to the weird little restaurant and the long way home. Being around you reminds people that ordinary days are allowed to be good. You make a Tuesday feel like an occasion. Friends call you when they want to feel something again, because you bring color back into rooms that went gray. Your laugh is a little too loud and nobody minds. The shadow side: you can drink so fast that you forget to swallow. You fill every hour, chase every spark, and then crash when the calendar finally goes empty. Stillness can feel like losing. It isn't. What you need is space to savor, not just sample. One sip, held a little longer. A day with nothing planned that you let be enough. Water is still water when it's quiet. And you're still you, still fully alive, even when you rest.",
    words: [
      { hanzi: "生活", pinyin: "shēng huó", en: "life" },
      { hanzi: "活动", pinyin: "huó dòng", en: "activity" },
      { hanzi: "活泼", pinyin: "huó pō", en: "lively" }, // review: dictionaries give huó pō; often huó po (neutral) in speech
    ],
    hardDays:
      "Even on gray days, you can still taste something. Take one slow sip of water. You're here. That's the whole point.",
    pairsWith: "joy",
  },
  {
    slug: "courage",
    char: "勇",
    pinyin: "yǒng",
    meaning: "brave",
    parts: [
      { char: "甬", gloss: "a narrow path" },
      { char: "力", gloss: "strength" },
    ],
    decode: "Courage is the strength it takes to walk the narrow path.",
    about:
      "You're the one who walks the narrow path when the wide road would be easier. Luna reads 勇 as the strength it takes to walk that path, and that's you. Not loud bravery. Not the movie kind. The everyday kind: sending the hard message, saying no in a room full of yes, starting over in a new city with two suitcases and a hopeful plan. You choose what's right over what's comfortable, and you do it more often than anyone knows. People admire you, sometimes from a distance. You're the friend they think of when they need to do something scary. You make brave look possible, because they've watched you shake and do it anyway. Your courage isn't fearlessness. It's fear with its shoes on. The shadow side: you can start believing every path has to be narrow. You pick the hardest route out of habit, as if ease were cheating. You carry it all alone because asking for help feels like stepping off the path. What you need is to remember that strength can share the load. Let someone walk beside you, even where it's tight. The narrow path is still yours. It's just lighter with company.",
    words: [
      { hanzi: "勇敢", pinyin: "yǒng gǎn", en: "brave" },
      { hanzi: "勇气", pinyin: "yǒng qì", en: "courage" },
      { hanzi: "英勇", pinyin: "yīng yǒng", en: "heroic" }, // review: HSK 5+, more literary than the other two
    ],
    hardDays:
      "Brave today might just mean taking the next step. One foot, then the other. The path is narrow, not endless.",
    pairsWith: "endurance",
  },
  {
    slug: "wisdom",
    char: "慧",
    pinyin: "huì",
    meaning: "wisdom",
    parts: [
      { char: "彗", gloss: "a broom" },
      { char: "心", gloss: "a heart" },
    ],
    decode: "Wisdom is a heart that's been swept clean.",
    about:
      "You're the one people come to when everything's a mess. Luna reads 慧 as a heart that's been swept clean, and that's what you offer: clarity. You've done the sweeping. You've cleared out old grudges, borrowed opinions, the noise that isn't yours. What's left is a calm, uncluttered space where the truth can sit down. Friends bring you their tangled stories, and somehow you hand them back folded neatly. You don't lecture. You ask the one question that makes everything click. You see the pattern three steps before anyone else, and you're kind about it. Being with you feels like opening a window in a stuffy room. The shadow side: you can keep sweeping long after the floor is clean. You study your own heart so carefully that you forget to just live in it. You give everyone else your best advice and save none of the gentleness for yourself. Sometimes wisdom turns into distance, and you watch life instead of joining it. What you need is permission to make a mess now and then. To laugh too hard, to choose wrong, to learn something new. A clean heart is beautiful. A lived-in one is better.",
    words: [
      { hanzi: "智慧", pinyin: "zhì huì", en: "wisdom" }, // review: no common HSK 1–4 words contain 慧
      { hanzi: "聪慧", pinyin: "cōng huì", en: "bright" },
      { hanzi: "慧眼", pinyin: "huì yǎn", en: "a discerning eye" },
    ],
    hardDays:
      "Your heart doesn't have to be tidy today. Let the mess sit. You can sweep tomorrow. Clarity always comes back to you.",
    pairsWith: "feeling",
  },
  {
    slug: "thinking",
    char: "思",
    pinyin: "sī",
    meaning: "to think",
    parts: [
      { char: "田", gloss: "field" },
      { char: "心", gloss: "heart" },
    ],
    decode: "Thinking is your heart plowing a field. Row by row.",
    about:
      "You're the one whose mind never quite clocks out. Luna reads 思 as your heart plowing a field, row by row, and that's the rhythm of you. You don't just think with your head. You think with your whole chest. You turn ideas over like soil, slowly and carefully, until something can grow there. You notice what other people skip. You remember the thing someone said in passing three months ago, and you understand what they really meant. People trust your thoughts because they're never thin. When you finally say something, it's been tended. Your texts are thoughtful. Your gifts are oddly perfect. Your advice lands because you've already walked every row of the problem. The shadow side: some fields don't need another pass. You can replay a conversation until it's worn down to dust. You plow at 2 a.m. when the field should be resting. Not every question needs an answer tonight. What you need is a season of fallow. Time to let the soil sit and trust that the seeds are already in. Walks without a destination. People who let you think out loud. Your harvest is coming. Row by row.",
    words: [
      { hanzi: "意思", pinyin: "yì si", en: "meaning" }, // review: neutral-tone 思 (si) in this word
      { hanzi: "思考", pinyin: "sī kǎo", en: "to think deeply" },
      { hanzi: "思念", pinyin: "sī niàn", en: "to miss someone" },
    ],
    hardDays:
      "Leave the field for tonight. The rows will still be there in the morning, and so will you.",
    pairsWith: "feeling",
  },
  {
    slug: "feeling",
    char: "感",
    pinyin: "gǎn",
    meaning: "to feel",
    parts: [
      { char: "咸", gloss: "salt" },
      { char: "心", gloss: "a heart" },
    ],
    decode: "Feeling something is tasting salt on your heart.",
    about:
      "You're the one who feels everything all the way down. Luna reads 感 as tasting salt on your heart, and that's how life reaches you: sharp, real, unmistakable. Salt is tears. Salt is the ocean. Salt is the thing that makes food taste like food. You get all three. A song in a grocery store can stop you mid-aisle. A stranger's kindness can make your whole week. You cry at the good parts of movies, not only the sad ones. People feel seen around you, because you actually register them. You catch the change in someone's voice before they've said what's wrong. You remember how a moment felt, not only what happened. That's rare. The shadow side: you can soak up so much salt from other people that you lose track of which flavor is yours. You carry a friend's bad day home in your pocket. You feel guilty for feeling too much, as if depth were a flaw. It isn't. What you need is a little fresh water. Quiet time to rinse off what isn't yours. People who can hold your big feelings without flinching. Your heart isn't too much. It's seasoned.",
    words: [
      { hanzi: "感觉", pinyin: "gǎn jué", en: "to feel" },
      { hanzi: "感动", pinyin: "gǎn dòng", en: "moved" },
      { hanzi: "感谢", pinyin: "gǎn xiè", en: "to thank" },
    ],
    hardDays:
      "It's okay if everything tastes like salt today. Feel it, then rinse. Your heart is seasoned, not ruined.",
    pairsWith: "thinking",
  },
  {
    slug: "realizing",
    char: "悟",
    pinyin: "wù",
    meaning: "to realize / awaken",
    parts: [
      { char: "忄", gloss: "heart" },
      { char: "吾", gloss: "self" },
    ],
    decode: "Enlightenment is your heart finally meeting yourself.",
    about:
      "You're the one who lives for the quiet click. Luna reads 悟 as your heart finally meeting yourself, and that's the moment you wait for: when something you've felt for years suddenly has words. You don't learn things once. You learn them, and then one ordinary afternoon, washing a cup or waiting for a bus, you understand them. Your life is full of those small dawns. You grow in layers, and each one is a little truer. People notice that you keep changing, gently, in the right direction. They feel safe telling you their own realizations, because you never laugh at a late lesson. You know every lesson arrives when the heart is ready. The shadow side: you can wait for the big awakening and miss the small ones. You can hold back from living until you've figured yourself out completely. You might judge your past self too harshly for not knowing what you know now. But that self was walking toward you the whole time. What you need is patience with your own timing. Journals, long walks, honest friends. You're not behind. You're arriving. And every time your heart meets you again, it's glad to see you.",
    words: [
      { hanzi: "领悟", pinyin: "lǐng wù", en: "to grasp" }, // review: no common HSK 1–4 words contain 悟
      { hanzi: "感悟", pinyin: "gǎn wù", en: "insight" },
      { hanzi: "觉悟", pinyin: "jué wù", en: "awakening" },
    ],
    hardDays:
      "You don't need to understand today. Some days the heart is still walking toward you. Let it take its time.",
    pairsWith: "wisdom",
  },
];
