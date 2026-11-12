"""Build the quiz font subset from a full Noto Serif SC file.

Usage:
  python3 -I scripts/subset-fonts.py <NotoSerifSC-Bold.otf>   # build
  python3 -I scripts/subset-fonts.py --check                  # verify coverage

Collects every CJK character used in lib/character/content and app/character,
then writes:
  assets/fonts/quiz-serif.otf      (for next/og ImageResponse; satori can't read woff2)
  public/fonts/quiz-serif.woff2    (for the web pages)
"""
import pathlib
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = [ROOT / "lib/character/content", ROOT / "app/character"]
OTF_OUT = ROOT / "assets/fonts/quiz-serif.otf"
WOFF2_OUT = ROOT / "public/fonts/quiz-serif.woff2"
CJK = re.compile(r"[⺀-⿟　-〿㐀-鿿豈-﫿＀-￯]")
EXTRA = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ·—–‘’“”…"
)


def used_chars() -> set[str]:
    chars: set[str] = set()
    for base in SOURCES:
        if not base.exists():
            continue
        for path in base.rglob("*"):
            if path.suffix in {".ts", ".tsx"}:
                chars.update(CJK.findall(path.read_text(encoding="utf-8")))
    return chars


def build(source: str) -> None:
    text = "".join(sorted(used_chars())) + EXTRA
    for out, flavor in ((OTF_OUT, None), (WOFF2_OUT, "woff2")):
        out.parent.mkdir(parents=True, exist_ok=True)
        opts = subset.Options()
        opts.flavor = flavor
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        font = subset.load_font(source, opts)
        sub = subset.Subsetter(opts)
        sub.populate(text=text)
        sub.subset(font)
        subset.save_font(font, str(out), opts)
        print(f"{out.relative_to(ROOT)}: {out.stat().st_size:,} bytes")
    check()


def check() -> None:
    cmap = TTFont(str(OTF_OUT)).getBestCmap()
    missing = sorted(c for c in used_chars() if ord(c) not in cmap)
    print(f"{len(used_chars())} CJK chars used, {len(cmap)} glyphs mapped")
    if missing:
        print("MISSING:", "".join(missing))
        sys.exit(1)
    print("all CJK characters covered")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--check":
        check()
    elif len(sys.argv) == 2:
        build(sys.argv[1])
    else:
        sys.exit(__doc__)
