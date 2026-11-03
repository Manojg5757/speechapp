import { PRODUCTS } from "./products.js";

// ---- Text → canonical form, so typed text, voice text and the data all look alike.
// '½"' / "half inch" / "1/2 inch" / "அரை இஞ்ச்"  →  "0.5 inch"
// "50ml" / "fifty ml" / "50 மில்லி"              →  "50 ml"

const NUMW = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, sixteen: 16, eighteen: 18, twenty: 20, twentyfive: 25, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
  ஒன்று: 1, ஒண்ணு: 1, இரண்டு: 2, ரெண்டு: 2, மூன்று: 3, மூணு: 3, நான்கு: 4, நாலு: 4, ஐந்து: 5, அஞ்சு: 5,
  ஆறு: 6, ஏழு: 7, எட்டு: 8, ஒன்பது: 9, பத்து: 10, பன்னிரண்டு: 12, பதினாறு: 16, இருபது: 20,
  முப்பது: 30, ஐம்பது: 50, நூறு: 100,
};

// multi-word or fraction words, longest first
const PHRASES = [
  ["one and a half", "1.5"], ["one and half", "1.5"], ["ஒன்றரை", "1.5"], ["ஒன்னரை", "1.5"], ["இரண்டரை", "2.5"], ["ரெண்டரை", "2.5"],
  ["three fourths", "0.75"], ["three fourth", "0.75"], ["three quarters", "0.75"], ["three quarter", "0.75"],
  ["முக்கால்", "0.75"], ["முக்கா", "0.75"], ["half", "0.5"], ["அரை", "0.5"], ["quarter", "0.25"], ["கால்", "0.25"],
  ["square mm", "sqmm"], ["sq mm", "sqmm"], ["square millimeter", "sqmm"], ["sq", "sqmm"], ["சதுர மில்லிமீட்டர்", "sqmm"], ["சதுர", "sqmm"],
].map(([p, r]) => [p.split(" "), r]);

const UNIT = {
  inch: "inch", inches: "inch", இஞ்ச்: "inch", இன்ச்: "inch", இஞ்சு: "inch", இன்ச்சு: "inch",
  ft: "ft", feet: "ft", foot: "ft", அடி: "ft",
  mm: "mm", millimeter: "mm", millimetre: "mm", மில்லிமீட்டர்: "mm",
  ml: "ml", millilitre: "ml", milliliter: "ml", மில்லி: "ml", மிலி: "ml", எம்எல்: "ml",
  litre: "l", liter: "l", litres: "l", liters: "l", ltr: "l", லிட்டர்: "l",
  watt: "w", watts: "w", வாட்: "w", வாட்ஸ்: "w",
  amp: "a", amps: "a", ampere: "a", ஆம்ப்: "a", ஆம்ப்ஸ்: "a", ஆம்பியர்: "a",
  kg: "kg", kgs: "kg", kilo: "kg", கிலோ: "kg",
  gm: "g", gram: "g", grams: "g", கிராம்: "g",
  meter: "m", metre: "m", meters: "m", metres: "m", மீட்டர்: "m",
};
const UNITS = new Set(["inch", "ft", "mm", "sqmm", "ml", "l", "w", "a", "kg", "g", "m"]);
const LONG_UNITS = new Set(["inch", "ft", "mm", "sqmm", "ml", "kg"]); // units that can't be ordinary words

const FR = { "½": 0.5, "¼": 0.25, "¾": 0.75 };
const fmt = n => String(+(+n).toFixed(3));
export const isNum = t => /^\d+(\.\d+)?$/.test(t);

export function canon(s) {
  let t = String(s || "").toLowerCase().normalize("NFC");
  t = t.replace(/(\d+)?\s*([½¼¾])/g, (m, i, f) => ` ${fmt(+(i || 0) + FR[f])} `);
  t = t.replace(/(\d+)\s+(\d+)\s*\/\s*(\d+)/g, (m, i, a, b) => ` ${fmt(+i + a / b)} `);
  t = t.replace(/(\d+)\s*\/\s*(\d+)/g, (m, a, b) => ` ${fmt(a / b)} `);
  t = t.replace(/(\d)\s*(″|"|”|'')/g, "$1 inch ").replace(/(\d)\s*(′|'|’)/g, "$1 ft ");
  t = t.replace(/(\d)(?=[^\d\s.,])/g, "$1 ").replace(/([^\d\s.,])(?=\d)/g, "$1 ");
  t = t.replace(/(\d)\.(?=\d)/g, "$1§").replace(/[^\p{L}\p{M}\p{N}§\s]/gu, " ").replace(/§/g, ".");
  const tk = t.split(/\s+/).filter(Boolean).map(w => (isNum(w) ? fmt(w) : w));

  const out = [];
  for (let i = 0; i < tk.length; i++) {
    const ph = PHRASES.find(([p]) => p.every((w, j) => tk[i + j] === w));
    if (ph) { out.push(ph[1]); i += ph[0].length - 1; continue; }
    if (tk[i] in NUMW) {
      let n = 0;
      for (; i < tk.length && tk[i] in NUMW; i++) n = NUMW[tk[i]] === 100 ? (n || 1) * 100 : n + NUMW[tk[i]];
      i--; out.push(String(n)); continue;
    }
    out.push(UNIT[tk[i]] || tk[i]);
  }
  // "1 and 0.5" / "1 0.5" → 1.5,  "1 point 5" → 1.5
  for (let i = 0; i < out.length - 1; i++) {
    const a = out[i], b = out[i + 1], c = out[i + 2];
    if (isNum(a) && (b === "point" || b === "பாயிண்ட்") && /^\d+$/.test(c || "")) out.splice(i, 3, fmt(`${a}.${c}`));
    else if (/^\d+$/.test(a) && b === "and" && isNum(c || "") && +c < 1) out.splice(i, 3, fmt(+a + +c));
    else if (/^\d+$/.test(a) && a !== "0" && ["0.5", "0.25", "0.75"].includes(b)) out.splice(i, 2, fmt(+a + +b));
  }
  return out.join(" ");
}

// Drop sizes ("0.5 inch", "50 ml", "16 a") so the product name can be scored on its own.
export function stripSize(c) {
  const tk = c.split(" ");
  return tk.filter((t, i) => !isNum(t) && !LONG_UNITS.has(t) && !(UNITS.has(t) && i > 0 && isNum(tk[i - 1]))).join(" ");
}
const sizeTokens = c => {
  const tk = c.split(" ");
  return tk.filter((t, i) => isNum(t) || LONG_UNITS.has(t) || (UNITS.has(t) && i > 0 && isNum(tk[i - 1]))).join(" ");
};

// ---- Fuzzy scoring (same rules as before)
function lev(a, b) {
  a = [...a]; b = [...b]; const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
const sim = (a, b) => 1 - lev(a, b) / Math.max([...a].length, [...b].length);

function nameScore(q, keys) {
  if (!q) return 0;
  let best = 0; const qt = q.split(" ");
  for (const k of keys) {
    let s = 0;
    if (k === q) s = 100;
    // q is the start of a word in k (typing in progress), or k is a whole word/phrase in q — not a fragment inside a word
    else if ((" " + k).includes(" " + q) || (" " + q + " ").includes(" " + k + " ")) {
      const r = Math.min(k.length, q.length) / Math.max(k.length, q.length); s = 60 + 30 * r;
    } else {
      const kt = k.split(" "); let tot = 0;
      for (const t of qt) { let m = 0; for (const u of kt) m = Math.max(m, sim(t, u)); tot += m; }
      s = 70 * (tot / qt.length);
    }
    if (s > best) best = s;
  }
  return best;
}

// ---- Index
const list = x => (x == null ? [] : Array.isArray(x) ? x : [x]);
const uniq = a => [...new Set(a.filter(Boolean))];

const build = products => products.map((p, i) => {
  const names = list(p.n), tas = list(p.ta);
  // "Rawl plug / gitti (pack)" counts as the full text and as each part, with or without the brackets
  const all = [...names, ...tas, ...list(p.a)]
    .flatMap(s => [s, s.replace(/\(.*?\)/g, " ")])
    .flatMap(s => [s, ...s.split(/\s+\/\s+|\s*[·;]\s*/)]);
  const vars = (p.v && p.v.length ? p.v : [{}]).map(v => {
    const full = uniq([v.v, ...list(v.ta), ...list(v.a)].map(canon));
    // a number alone also picks the size: "elbow 1" → 1", "solvent 50" → 50 ml
    const nums = uniq(full.map(f => (f.match(/^(\d+(?:\.\d+)?) [a-z]+$/) || [])[1]));
    return { label: v.v || "", ta: list(v.ta)[0] || "", s: v.s ?? p.s, b: v.b ?? p.b, p: v.p ?? p.p, u: v.u ?? p.u,
      img: v.img || p.img || "", color: v.color || "", full, nums };
  });
  return {
    i, c: p.c, name: names[0], ta: tas[0] || "", names, tas, vars, img: p.img || "",
    multi: vars.length > 1,
    keys: uniq(all.map(s => stripSize(canon(s)))),
  };
});

// The product list in use: products.js at first, replaced by the Google Sheet when it loads
export let ITEMS = build(PRODUCTS);
export function setProducts(products) { ITEMS = build(products); }

function matchVariant(qc, it) {
  if (!it.vars[0].label) return null;
  const pq = ` ${qc} `; let best = null;
  it.vars.forEach((v, vi) => {
    for (const k of v.full) if (pq.includes(` ${k} `) && (!best || best.w < 2 + k.length / 100)) best = { vi, k, w: 2 + k.length / 100 };
    for (const k of v.nums) if (pq.includes(` ${k} `) && (!best || best.w < 1 + k.length / 100)) best = { vi, k, w: 1 + k.length / 100 };
  });
  return best;
}

/*
  Returns matches, best first: { it, vi, s, missing }
    vi       index of the variant the query named, or null if it named none
    missing  a size the query asked for that this product doesn't have ("10 w")
*/
export function search(query, cat = "all") {
  const qc = canon(query);
  if (!qc) return ITEMS.filter(it => cat === "all" || it.c === cat).map(it => ({ it, vi: it.multi ? null : 0, s: 0, missing: "" }));
  const qn = stripSize(qc);
  const out = [];
  for (const it of ITEMS) {
    if (cat !== "all" && it.c !== cat) continue;
    const vm = matchVariant(qc, it);
    let s = nameScore(qn, it.keys), missing = "";
    if (vm) {
      const rest = stripSize(` ${qc} `.replace(` ${vm.k} `, " ").trim());
      s = Math.max(s, nameScore(rest, it.keys));
      s = rest ? s + 12 : 55; // only a size was said ("50 ml"): show everything that comes in it
    } else if (it.vars[0].label) {
      missing = sizeTokens(qc);
    }
    if (s >= 38) out.push({ it, vi: vm ? vm.vi : it.multi ? null : 0, s, missing });
  }
  return out.sort((a, b) => b.s - a.s);
}

export const topScore = q => (search(q)[0] || { s: -1 }).s;
