export const CATS = {
  plumbing: { ta: "பிளம்பிங்", en: "Plumbing", color: "var(--plumb)" },
  electrical: { ta: "எலக்ட்ரிக்கல்", en: "Electrical", color: "var(--elec)" },
  hardware: { ta: "ஹார்டுவேர்", en: "Hardware", color: "var(--hw)" },
};

export const SHELVES = 8;

/*
  SAMPLE DATA — replace with the shop's real list.

  n   English name, or a list of names. The first one is shown on the label.
      "Rawl plug / gitti" also counts as two names.
  ta  Tamil name, or a list of Tamil names.
  a   Other names people say (spellings, slang, Tamil-English mixes).
  c   Category: plumbing | electrical | hardware
  img Picture: a built-in drawing name (pipe, elbow, tee, valve, tap, roll, tape,
      tube, clamp, shower, hose, switch, socket, bulb, coil, mcb, tubelight, rose,
      board, fuse, screw, plug, nails), or a photo: put the file in
      public/products/ and write e.g. img: "products/elbow.jpg".
      Photos from the internet must be free to use — credit them in src/credits.js.
  s, b, p, u   Shelf, box, price (₹) and unit. Used by every variant unless the
      variant sets its own.
  v   Variants (optional). One entry per size / ml / watt / colour / type:
        v   label, e.g. '½"', "50 ml", "9W", "16A", "Black"
        ta  Tamil label, spoken by the Tamil voice (optional)
        a   other ways to say it (optional)
        s, b, p, u   override shelf / box / price / unit for this variant
        img   a different picture for this variant (optional)
        color colour of the variant, e.g. "#C62828" — tints the tape drawing
      Sizes are understood automatically: '½"' matches "half inch", "1/2",
      "அரை இஞ்ச்"; "50 ml" matches "50ml", "fifty ml", "50 மில்லி".
*/
export const PRODUCTS = [
  { img: "products/pipe.jpg", n: "PVC pipe (10 ft)", ta: "பிவிசி பைப்", a: ["pvc pipe", "pipe", "பைப்", "குழாய்", "பிவிசி", "pvc"], c: "plumbing", s: 1, u: "per length",
    v: [{ v: '½"', b: 1, p: 180 }, { v: '¾"', b: 2, p: 260 }, { v: '1"', b: 3, p: 380 }] },
  { img: "products/elbow.jpg", n: "PVC elbow", ta: "எல்போ", a: ["elbow", "elbo", "bend", "எல்போ", "வளைவு"], c: "plumbing", s: 2, u: "each",
    v: [{ v: '½"', b: 4, p: 12 }, { v: '¾"', b: 5, p: 18 }, { v: '1"', b: 6, p: 28 }] },
  { img: "products/tee.jpg", n: "PVC tee", ta: "டீ ஜாயிண்ட்", a: ["tee", "t joint", "tee joint", "டீ", "டி"], c: "plumbing", s: 2, u: "each",
    v: [{ v: '½"', b: 7, p: 14 }, { v: '¾"', b: 8, p: 22 }] },
  { img: "products/valve.jpg", n: "Ball valve", ta: "பால் வால்வு", a: ["valve", "ball valve", "வால்வு", "வால்வ்"], c: "plumbing", s: 2, b: 9, u: "each",
    v: [{ v: '½"', p: 95 }, { v: '¾"', p: 140 }] },
  { img: "tap", n: "Bib tap (brass)", ta: "தண்ணீர் குழாய் டேப்", a: ["tap", "bib tap", "water tap", "nalli", "டேப்", "நல்லி", "தண்ணி குழாய்", "பித்தளை டேப்"], c: "plumbing", s: 3, b: 2, p: 260, u: "each" },
  { img: "products/roll.jpg", n: "Teflon tape", ta: "டெப்லான் டேப்", a: ["teflon", "thread tape", "white tape", "டெப்லான்", "டெஃப்லான்", "வெள்ளை டேப்"], c: "plumbing", s: 3, b: 7, p: 15, u: "roll" },
  { img: "tube", n: ["Solvent cement", "Pipe glue"], ta: "சால்வெண்ட் பசை", a: ["solvent", "cement", "glue", "பசை", "சால்வென்ட்", "சொல்வென்ட்"], c: "plumbing", s: 3, b: 9, u: "tube",
    v: [{ v: "50 ml", p: 65 }, { v: "100 ml", p: 110 }, { v: "250 ml", p: 240, u: "tin", b: 10 }] },
  { img: "products/clamp.jpg", n: "Pipe clamp", ta: "பைப் கிளாம்ப்", a: ["clamp", "clip", "கிளாம்ப்", "கிளிப்"], c: "plumbing", s: 2, b: 10, u: "each",
    v: [{ v: '½"', p: 4 }, { v: '¾"', p: 5 }, { v: '1"', p: 7 }] },
  { img: "products/shower.jpg", n: "Shower head", ta: "ஷவர்", a: ["shower", "ஷவர்"], c: "plumbing", s: 3, b: 3, p: 350, u: "each" },
  { img: "hose", n: "Connection pipe", ta: "கனெக்ஷன் பைப்", a: ["connection", "flexible pipe", "கனெக்ஷன்", "கனக்ஷன்"], c: "plumbing", s: 3, b: 5, u: "each",
    v: [{ v: '18"', p: 90 }, { v: '24"', p: 110 }] },

  { img: "switch", n: "1-way switch", ta: "சுவிட்ச்", a: ["switch", "one way switch", "சுவிட்ச்", "ஸ்விட்ச்", "சுவிச்"], c: "electrical", s: 5, b: 1, u: "each",
    v: [{ v: "6A", p: 28 }, { v: "16A", p: 55, b: 3 }] },
  { img: "products/socket.png", n: "3-pin socket", ta: ["சாக்கெட்", "பிளக் பாயிண்ட்"], a: ["socket", "plug", "plug point", "three pin", "சாக்கெட்", "பிளக்"], c: "electrical", s: 5, b: 2, u: "each",
    v: [{ v: "6A", p: 45 }, { v: "16A", p: 85, b: 4 }] },
  { img: "products/bulb.jpg", n: "LED bulb", ta: "எல்இடி பல்பு", a: ["bulb", "led", "light", "பல்பு", "பல்ப்", "லைட்", "எல்இடி"], c: "electrical", s: 6, b: 1, u: "each",
    v: [{ v: "9W", p: 99 }, { v: "12W", p: 130 }, { v: "15W", p: 165, b: 2 }] },
  { img: "products/coil.png", n: "Copper wire (90 m)", ta: ["காப்பர் வயர்", "ஒயர்"], a: ["wire", "copper wire", "வயர்", "காப்பர்"], c: "electrical", s: 7, u: "coil",
    v: [{ v: "0.75 sq mm", b: 1, p: 1050 }, { v: "1.0 sq mm", b: 2, p: 1450 }, { v: "1.5 sq mm", b: 3, p: 2100 }, { v: "2.5 sq mm", b: 4, p: 3400 }] },
  { img: "products/tape.jpg", n: "Insulation tape", ta: "இன்சுலேஷன் டேப்", a: ["insulation", "electrical tape", "pvc tape", "கருப்பு டேப்", "இன்சுலேஷன்"], c: "electrical", s: 5, b: 9, p: 20, u: "roll",
    v: [{ v: "Black", color: "#222222", ta: "கருப்பு", a: ["karuppu"] }, { v: "Red", img: "tape", color: "#C62828", ta: "சிவப்பு", a: ["sivappu"] },
        { v: "Blue", img: "tape", color: "#1565C0", ta: "நீலம்", a: ["neelam", "நீல"] }, { v: "Green", img: "tape", color: "#2E7D32", ta: "பச்சை", a: ["pachai"] }] },
  { img: "products/mcb.jpg", n: "MCB", ta: "எம்சிபி", a: ["mcb", "breaker", "எம்சிபி", "எம் சி பி"], c: "electrical", s: 6, b: 6, u: "each",
    v: [{ v: "16A", p: 210 }, { v: "32A", p: 260 }] },
  { img: "products/tubelight.jpg", n: "LED tube light 20W", ta: "டியூப் லைட்", a: ["tube light", "tube", "batten", "டியூப்", "டியூப் லைட்", "ட்யூப்"], c: "electrical", s: 6, b: 3, p: 240, u: "each" },
  { img: "rose", n: "Ceiling rose", ta: "சீலிங் ரோஸ்", a: ["rose", "சீலிங்"], c: "electrical", s: 5, b: 6, p: 35, u: "each" },
  { img: "products/board.jpg", n: ["Extension board", "Spike buster"], ta: "எக்ஸ்டென்ஷன் போர்டு", a: ["extension", "spike", "board", "எக்ஸ்டென்ஷன்", "போர்டு", "ஸ்பைக்"], c: "electrical", s: 6, b: 8, u: "each",
    v: [{ v: "4 socket", p: 320 }, { v: "6 socket", p: 450 }] },
  { img: "products/fuse.jpg", n: "Fuse wire", ta: "பியூஸ் வயர்", a: ["fuse", "பியூஸ்", "ஃபியூஸ்"], c: "electrical", s: 5, b: 10, p: 10, u: "roll" },

  { img: "products/screw.jpg", n: "Wood screws (pack of 50)", ta: ["ஸ்க்ரூ", "திருகாணி"], a: ["screw", "screws", "ஸ்க்ரூ", "ஸ்குரு"], c: "hardware", s: 8, b: 2, u: "pack",
    v: [{ v: '1"', p: 40 }, { v: '1½"', p: 55 }, { v: '2"', p: 70, b: 1 }] },
  { img: "products/plug.jpg", n: "Rawl plug / gitti (pack)", ta: "ரவுல் பிளக் / கிட்டி", a: ["wall plug", "plug gitti"], c: "hardware", s: 8, b: 3, p: 20, u: "pack" },
  { img: "products/nails.jpg", n: "Nails (1 kg)", ta: "ஆணி", a: ["nail", "nails", "ஆணி"], c: "hardware", s: 8, u: "kg",
    v: [{ v: '1"', b: 4, p: 120 }, { v: '2"', b: 5, p: 110 }, { v: '3"', b: 6, p: 105 }] },
];
