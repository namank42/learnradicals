import { ScrollAnimator } from "./components/scroll-animator";
import { MobileCTA } from "./components/mobile-cta";
import { InkDivider } from "./components/ink-divider";
import { CheckoutButton } from "./components/checkout-button";

const SITE_URL = "https://learnradicals.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Learn Radicals — The 214 Building Blocks of Chinese",
      description:
        "The complete visual guide to all 214 Kangxi radicals with 1,200+ example characters. Learn the building blocks of Chinese characters.",
      url: SITE_URL,
      inLanguage: "en-US",
      datePublished: "2025-01-01",
      dateModified: new Date().toISOString().split("T")[0],
      isPartOf: {
        "@type": "WebSite",
        name: "Learn Radicals",
        url: SITE_URL,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".hero-description", ".faq-answer"],
      },
    },
    {
      "@type": "Product",
      name: "Learn Radicals — The 214 Building Blocks of Chinese",
      description:
        "A beautifully designed PDF guide covering all 214 Kangxi radicals with 1,200+ example characters organized into 17 themed families. Visual decompositions show exactly how characters break down into their radical parts.",
      url: SITE_URL,
      brand: {
        "@type": "Brand",
        name: "Learn Radicals",
      },
      offers: {
        "@type": "Offer",
        price: "10.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is this simplified or traditional Chinese?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The guide covers simplified Chinese radicals — the standard writing system used in mainland China and the most commonly taught worldwide. Many radicals are identical in both systems.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to know any Chinese already?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. This guide is designed for complete beginners. If you can't read a single character yet, this is the perfect starting point.",
          },
        },
        {
          "@type": "Question",
          name: "What format is the guide?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It's a beautifully designed PDF that you download instantly after purchase. Works on any device — phone, tablet, or computer.",
          },
        },
        {
          "@type": "Question",
          name: "Can I print it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! It's designed to look great both on screen and printed. Many learners keep a printed copy on their desk as a reference.",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      name: "Learn Radicals",
      url: SITE_URL,
      sameAs: ["https://threads.net/@lunalang42"],
    },
  ],
};

const heroDemo = [
  { char: "河", meaning: "river" },
  { char: "海", meaning: "sea" },
  { char: "湖", meaning: "lake" },
  { char: "泪", meaning: "tears" },
];

const previewFamily = {
  num: "01",
  title: "Water & Ice",
  desc: "Radicals connected to water, liquids, ice, and flowing.",
  radicals: [
    {
      char: "氵",
      meaning: "water (side form)",
      cnName: "sān diǎn shuǐ — three dots of water",
      examples: [
        { char: "河", py: "hé", en: "river" },
        { char: "海", py: "hǎi", en: "sea" },
        { char: "湖", py: "hú", en: "lake" },
        { char: "泪", py: "lèi", en: "tears" },
        { char: "洗", py: "xǐ", en: "to wash" },
        { char: "酒", py: "jiǔ", en: "alcohol" },
      ],
    },
    {
      char: "冫",
      meaning: "ice",
      cnName: "liǎng diǎn shuǐ — two dots of ice",
      examples: [
        { char: "冷", py: "lěng", en: "cold" },
        { char: "冰", py: "bīng", en: "ice" },
        { char: "冻", py: "dòng", en: "to freeze" },
        { char: "凉", py: "liáng", en: "cool" },
        { char: "净", py: "jìng", en: "clean" },
        { char: "准", py: "zhǔn", en: "accurate" },
      ],
    },
  ],
};

const familyToc = [
  {
    num: "01",
    title: "Water & Ice",
    desc: "Characters connected to water, liquids, ice, and flowing.",
  },
  {
    num: "02",
    title: "Fire & Heat",
    desc: "Characters connected to fire, cooking, heat, and light.",
  },
  {
    num: "03",
    title: "Earth, Stone & Land",
    desc: "Characters connected to ground, terrain, and minerals.",
  },
  {
    num: "04",
    title: "Wood & Plants",
    desc: "Characters connected to trees, bamboo, grass, grain, and flowers.",
  },
  {
    num: "05",
    title: "Metal & Treasure",
    desc: "Characters connected to metals, money, and precious things.",
  },
];

const testimonials = [
  {
    text: "This break down turned on a light bulb!",
    username: "elleephanttt",
  },
  {
    text: "Far less intimidating when you look at it this way.",
    username: "rj.kimmel.5",
  },
  {
    text: "Nooooww I can learn Chinese!!!! I needed to understand how the language worked THANK you!!",
    username: "squiggly.co",
  },
  {
    text: "It\u2019s been an intimidating language for me to take on until finding you.",
    username: "unstoriedself",
  },
  {
    text: "This is incredible!! Thank you so much!!!",
    username: "galicia_sky",
  },
  {
    text: "My 15 yr old has a huge love for languages and was trying to explain this to me but I think I get it now seeing it laid out like this.",
    username: "cy_to_the_fi",
  },
];

const features = [
  {
    num: "01",
    title: "All 214 Kangxi radicals",
    desc: "The complete set of building blocks used in modern Chinese.",
  },
  {
    num: "02",
    title: "1,200+ example characters",
    desc: "Each radical paired with 5\u20118 high\u2011frequency words you\u2019ll actually use.",
  },
  {
    num: "03",
    title: "17 themed families",
    desc: "Grouped by meaning \u2014 water, fire, body, nature \u2014 so related radicals connect.",
  },
  {
    num: "04",
    title: "Visual decompositions",
    desc: "See exactly how characters break down into their radical parts.",
  },
  {
    num: "05",
    title: "Zero filler",
    desc: "No theory essays. No fluff. Just the system, clearly laid out.",
  },
];

const faqItems = [
  {
    q: "Is this simplified or traditional Chinese?",
    a: "The guide covers simplified Chinese radicals \u2014 the standard writing system used in mainland China and the most commonly taught worldwide. Many radicals are identical in both systems.",
  },
  {
    q: "Do I need to know any Chinese already?",
    a: "No. This guide is designed for complete beginners. If you can\u2019t read a single character yet, this is the perfect starting point.",
  },
  {
    q: "What format is the guide?",
    a: "It\u2019s a beautifully designed PDF that you download instantly after purchase. Works on any device \u2014 phone, tablet, or computer.",
  },
  {
    q: "Can I print it?",
    a: "Yes! It\u2019s designed to look great both on screen and printed. Many learners keep a printed copy on their desk as a reference.",
  },
  {
    q: "What\u2019s the refund policy?",
    a: "Because this is a digital product with instant download, all sales are final. If you have any issues accessing your PDF, reach out and we\u2019ll help.",
  },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollAnimator />

      {/* ===== HERO ===== */}
      <section className="px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="font-heading font-bold text-[2.5rem] md:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            The Visual Guide to
            <br />
            <span className="text-red">Reading Chinese</span>
          </h1>

          <p
            className="hero-fade hero-description mt-6 text-lg md:text-xl text-gray leading-relaxed max-w-md mx-auto"
            style={{ animationDelay: "0.1s" }}
          >
            Chinese isn&apos;t 50,000 random symbols. It&apos;s 214 building
            blocks called <strong className="text-ink">radicals</strong>.
          </p>

          {/* Radical demo card */}
          <div
            className="hero-fade mt-10 inline-block w-full max-w-md"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="bg-white rounded-2xl border-l-4 border-l-red shadow-lg shadow-black/5 p-6">
              <div className="flex items-center gap-5">
                <div className="text-center shrink-0">
                  <span className="font-cjk text-5xl md:text-6xl text-red" lang="zh">
                    氵
                  </span>
                  <p className="text-xs text-gray mt-1">water</p>
                </div>
                <span className="text-gray-light text-lg shrink-0">
                  &rarr;
                </span>
                <div className="flex gap-3 justify-around flex-1">
                  {heroDemo.map((item, i) => (
                    <div key={item.char} className="text-center">
                      <span className="font-cjk text-2xl md:text-3xl inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-red-soft/50 rounded-full" lang="zh">
                        {item.char}
                      </span>
                      <p className="text-[11px] text-gray mt-1.5">
                        {item.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="hero-fade mt-10"
            style={{ animationDelay: "0.4s" }}
          >
            <CheckoutButton
              className="cta-button inline-block bg-red text-white px-12 py-5 rounded-2xl text-lg md:text-xl font-medium"
            >
              Get Learn Radicals &mdash; <span className="font-bold">$10</span> <span className="cta-arrow">&rarr;</span>
            </CheckoutButton>
            <p className="mt-4 text-sm text-gray">
              Instant PDF download &middot; Keep forever
            </p>
            <p className="mt-3 text-sm text-gray">
              Joined by{" "}
              <span className="font-heading font-bold text-ink">
                280,000+
              </span>{" "}
              learners on{" "}
              <a
                href="https://threads.net/@lunalang42"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ink transition-colors"
              >
                Threads
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section
        className="below-fold px-6 py-12 md:py-20 bg-cream section-watermark"
        data-char="问"
        data-pos="right"
      >
        <div className="mx-auto max-w-2xl">
          <h2
            className="font-heading text-2xl md:text-3xl text-center mb-8"
            data-reveal="0"
          >
            Sound <span className="brush-accent">familiar</span>?
          </h2>

          <div className="space-y-4 max-w-lg mx-auto" data-reveal="0.1">
            {[
              "You\u2019ve downloaded language apps. Swiped through thousands of flashcards. Nothing stuck.",
              "Characters still look like random scribbles. You can\u2019t tell them apart, let alone remember them.",
              "Everyone says \u201cjust memorize more.\u201d But nobody explains the system underneath.",
            ].map((text, i) => (
              <p
                key={i}
                className="flex items-start gap-3 text-gray text-sm md:text-base leading-relaxed"
              >
                <span className="text-red/40 shrink-0 mt-0.5">&mdash;</span>
                {text}
              </p>
            ))}
          </div>

          <div
            className="mt-10 max-w-lg mx-auto bg-white rounded-2xl border-l-4 border-l-red shadow-lg shadow-black/5 px-6 py-5"
            data-reveal="0.2"
          >
            <p className="text-base md:text-lg leading-relaxed">
              There <em>is</em> a system. Chinese characters aren&apos;t random
              &mdash; they&apos;re built from 214 recurring pieces called{" "}
              <strong className="text-red">radicals</strong>. Learn the pieces,
              and characters stop being mysterious.
            </p>
          </div>
        </div>
      </section>

      {/* ===== INSIGHT (AHA MOMENT) ===== */}
      <section id="insight" className="below-fold px-6 py-12 md:py-20">
        <div className="mx-auto max-w-2xl space-y-5">
          <div
            className="insight bg-ink text-white rounded-2xl p-8 md:p-12"
            data-watermark="忍"
            data-reveal="0"
          >
            <p className="font-cjk text-6xl md:text-7xl mb-4" lang="zh">忍</p>
            <p className="text-lg text-white/70 mb-6">
              <span className="font-cjk" lang="zh">刃</span> blade +{" "}
              <span className="font-cjk" lang="zh">心</span> heart
            </p>
            <p className="font-heading text-xl md:text-2xl italic leading-relaxed text-white/90">
              &ldquo;To endure is to hold a blade above your heart.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 min-[560px]:grid-cols-2 gap-5">
            <div
              className="bg-cream rounded-2xl border-l-4 border-l-red p-6 md:p-8"
              data-reveal="0.1"
            >
              <p className="font-cjk text-4xl md:text-5xl text-red mb-3" lang="zh">
                想
              </p>
              <p className="text-sm text-gray mb-2">
                <span className="font-cjk" lang="zh">相</span> appearance +{" "}
                <span className="font-cjk" lang="zh">心</span> heart
              </p>
              <p className="font-heading text-base md:text-lg italic text-ink/80">
                To think is to see with your heart.
              </p>
            </div>
            <div
              className="bg-cream rounded-2xl border-l-4 border-l-red p-6 md:p-8"
              data-reveal="0.15"
            >
              <p className="font-cjk text-4xl md:text-5xl text-red mb-3" lang="zh">
                愁
              </p>
              <p className="text-sm text-gray mb-2">
                <span className="font-cjk" lang="zh">秋</span> autumn +{" "}
                <span className="font-cjk" lang="zh">心</span> heart
              </p>
              <p className="font-heading text-base md:text-lg italic text-ink/80">
                When autumn touches your heart &mdash; that&apos;s sorrow.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Ink Wash Divider */}
      <InkDivider char="字" />

      {/* ===== RADICAL PREVIEW ===== */}
      <section
        className="below-fold px-6 py-12 md:py-20 section-watermark"
        data-char="文"
        data-pos="left"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            className="font-heading text-2xl md:text-3xl text-center mb-2"
            data-reveal="0"
          >
            A preview of what&apos;s <span className="brush-accent">inside</span>
          </h2>
          <p
            className="text-sm text-gray text-center mb-10"
            data-reveal="0.05"
          >
            One of 17 themed families from the guide
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* Left: Family preview */}
            <div>
              {/* Family header */}
              <div className="mb-5" data-reveal="0.1">
                <div className="flex items-baseline gap-4 mb-1">
                  <span className="font-heading text-4xl md:text-5xl text-ink/10 font-bold leading-none">
                    {previewFamily.num}
                  </span>
                  <h3 className="font-heading text-xl md:text-2xl font-medium">
                    {previewFamily.title}
                  </h3>
                </div>
                <p className="text-sm text-gray ml-[3.25rem] md:ml-[3.75rem]">
                  {previewFamily.desc}
                </p>
              </div>

              {/* Radical entry cards */}
              <div className="space-y-4">
                {previewFamily.radicals.map((radical, i) => (
                  <div
                    key={radical.char}
                    className="radical-card bg-white rounded-2xl border-l-4 border-l-red shadow-lg shadow-black/5 p-5"
                    data-reveal={`${0.15 + i * 0.08}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="font-cjk text-4xl md:text-5xl text-red shrink-0" lang="zh">
                        {radical.char}
                      </span>
                      <div className="pt-1">
                        <p className="font-medium text-sm">{radical.meaning}</p>
                        <p className="text-xs text-gray mt-0.5">{radical.cnName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {radical.examples.map((ex) => (
                        <div key={ex.char} className="flex items-center gap-2 text-sm">
                          <span className="font-cjk text-lg w-6 text-ink" lang="zh">{ex.char}</span>
                          <span className="text-gray text-xs">{ex.py}</span>
                          <span className="ml-auto text-gray text-xs">{ex.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Family TOC */}
            <div
              className="bg-white rounded-2xl border-l-4 border-l-red shadow-lg shadow-black/5 p-6 md:p-8"
              data-reveal="0.25"
            >
              <p className="text-xs font-medium tracking-widest text-red mb-1">
                CONTENTS
              </p>
              <p className="font-heading text-lg md:text-xl font-bold mb-6">
                17 Radical Families
              </p>

              <div className="relative">
                <div className="space-y-5">
                  {familyToc.map((fam) => (
                    <div key={fam.num} className="flex gap-4">
                      <span className="font-heading text-lg text-red font-bold leading-snug pt-0.5 shrink-0">
                        {fam.num}
                      </span>
                      <div>
                        <p className="font-bold text-sm leading-snug">
                          {fam.title}
                        </p>
                        <p className="text-xs text-gray mt-0.5">{fam.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fade overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              <p className="text-sm text-gray mt-5">
                + 12 more families in the full guide
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section id="testimonials" className="below-fold py-12 md:py-20 bg-cream">
        <div className="mx-auto max-w-2xl px-6 text-center mb-10" data-reveal="0">
          <p className="font-heading text-5xl md:text-6xl font-bold text-ink">
            280,000+
          </p>
          <p className="mt-2 text-gray text-sm tracking-wide">
            people have seen the radical system on{" "}
            <a
              href="https://threads.net/@lunalang42"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink transition-colors"
            >
              Threads
            </a>
          </p>
        </div>

        <div className="mx-auto max-w-2xl px-6 grid grid-cols-1 min-[560px]:grid-cols-2 gap-4" data-reveal="0.1">
          {testimonials.map((t, i) => {
            const isFirst = i === 0;
            const isLast = i === testimonials.length - 1;
            const isWide = isFirst || isLast;

            return (
              <div
                key={t.username}
                className={`relative overflow-hidden rounded-xl p-5 ${
                  isWide ? "min-[560px]:col-span-2" : ""
                } ${
                  isFirst
                    ? "bg-white border-l-4 border-l-ink shadow-lg shadow-black/5 px-6 py-6"
                    : isLast
                      ? "bg-white border-l-4 border-l-ink shadow-lg shadow-black/5 px-6 py-6"
                      : "bg-white shadow-lg shadow-black/5"
                }`}
              >
                <span className={`absolute top-2 right-4 font-heading leading-none pointer-events-none select-none ${
                  isFirst ? "text-[120px] text-ink/[0.06]" : "text-[80px] text-ink/[0.04]"
                }`}>
                  &ldquo;
                </span>
                <p
                  className={`leading-relaxed mb-3 relative ${
                    isWide ? "text-base md:text-lg" : "text-sm"
                  }`}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="text-sm text-gray/80 font-medium relative">@{t.username}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto max-w-2xl px-6 text-center mt-10" data-reveal="0.2">
          <CheckoutButton
            className="inline-block text-red font-medium hover:underline transition-colors"
          >
            Get Learn Radicals &mdash; <span className="font-bold">$10</span> <span className="cta-arrow">&rarr;</span>
          </CheckoutButton>
        </div>
      </section>

      {/* Ink Wash Divider */}
      <InkDivider char="学" />

      {/* ===== WHAT'S INSIDE ===== */}
      <section
        id="features"
        className="below-fold px-6 py-12 md:py-20 section-watermark"
        data-char="书"
        data-pos="right"
      >
        <div className="mx-auto max-w-2xl">
          <h2
            className="font-heading text-2xl md:text-3xl text-center mb-10"
            data-reveal="0"
          >
            What&apos;s inside the guide
          </h2>
          <div
            className="bg-white rounded-2xl shadow-lg shadow-black/5 p-8 md:p-10"
            data-reveal="0.1"
          >
            <ol className="space-y-6">
              {features.map((item) => (
                <li key={item.num} className="flex gap-5">
                  <span className="font-heading text-2xl text-ink/30 font-bold leading-none pt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== WHO IT'S FOR ===== */}
      <section className="below-fold px-6 py-12 md:py-16 bg-cream">
        <div className="mx-auto max-w-2xl">
          <h2
            className="font-heading text-2xl md:text-3xl text-center mb-8"
            data-reveal="0"
          >
            This guide is for you if&hellip;
          </h2>
          <div
            className="space-y-3 max-w-lg mx-auto"
            data-reveal="0.1"
          >
            {[
              "You\u2019re curious about Chinese but intimidated by the characters",
              "You\u2019ve tried apps and flashcards but nothing made it \u201cclick\u201d",
              "You want to understand the system, not just memorize shapes",
              "You prefer a reference you own forever \u2014 not another subscription",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-red text-lg leading-none mt-0.5">
                  &#10003;
                </span>
                <p className="text-sm md:text-base text-gray">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING CTA ===== */}
      <section id="pricing" className="below-fold px-6 py-16 md:py-24 text-center">
        <div className="mx-auto max-w-xl" data-reveal="0">
          <h2 className="font-heading text-3xl md:text-4xl leading-tight">
            Stop memorizing.{" "}
            <span className="text-red brush-accent">Start understanding.</span>
          </h2>
          <p className="mt-8 font-heading text-5xl md:text-6xl text-ink">$10</p>
          <p className="mt-2 text-sm text-gray">
            One-time purchase &middot; Yours forever
          </p>
          <p className="mt-4 text-xs text-gray max-w-xs mx-auto">
            Less than a single Chinese lesson. More useful than a year of
            flashcard apps.
          </p>
          <div className="mt-8">
            <CheckoutButton
              className="cta-button inline-block bg-red text-white px-12 py-5 rounded-2xl text-lg md:text-xl font-medium"
            >
              Get Learn Radicals <span className="cta-arrow">&rarr;</span>
            </CheckoutButton>
            <p className="mt-4 text-sm text-gray">
              Secure checkout &middot; Instant PDF download
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="below-fold px-6 py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2
            className="font-heading text-2xl md:text-3xl text-center mb-10"
            data-reveal="0"
          >
            Common questions
          </h2>
          <div className="space-y-3" data-reveal="0.1">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="bg-white rounded-xl shadow-lg shadow-black/5"
              >
                <summary className="flex items-center justify-between p-5 font-medium text-sm md:text-base">
                  {item.q}
                  <span className="faq-icon text-gray-light text-xl ml-4 shrink-0 leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="faq-answer text-sm text-gray leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 py-10 text-center text-xs text-gray">
        <p className="font-heading font-bold text-sm text-ink mb-2">
          Learn Radicals
        </p>
        <p>
          <a
            href="https://threads.net/@lunalang42"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors"
          >
            Follow @lunalang42 on Threads for daily Chinese breakdowns
          </a>
        </p>
      </footer>

      <MobileCTA />
    </main>
  );
}
