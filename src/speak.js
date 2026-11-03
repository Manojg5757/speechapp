import { canon, isNum } from "./search.js";

/*
  Everything the app says, in one place. It talks like a son helping his mother
  in the shop. Edit freely — e.g. change அம்மா / Amma to அப்பா / Appa.
  "ta" is used when the phone has a Tamil voice, "en" otherwise.
*/
const LINES = {
  ta: {
    greet: "வணக்கம் அம்மா! உங்களுக்கு என்ன உதவி வேணும்?",
    found: (item, v) => `அம்மா, ${item} இருக்கு. அலமாரி ${v.s}, பெட்டி ${v.b}. விலை ${v.p} ரூபாய்.`,
    missing: m => `அம்மா, ${m} இல்லையே. `,
    options: (name, n, call) => `${call ? "அம்மா, " : ""}${name} ${n} வகையில இருக்கு. `,
    sameShelf: s => `எல்லாமே அலமாரி ${s}. `,
    option: (lab, v, showShelf) => `${lab}, ${showShelf ? `அலமாரி ${v.s}, ` : ""}பெட்டி ${v.b}, ${v.p} ரூபாய்.`,
    more: n => ` இன்னும் ${n} வகை இருக்கு.`,
    pick: " எது வேணும்னு சொல்லுங்க.",
    notFound: q => `அம்மா, ${q} நம்ம கடையில இல்லையே. வேற பேர்ல சொல்லிப் பாருங்க.`,
    noSpeech: "அம்மா, எதுவும் கேக்கலையே. இன்னொரு தடவை சொல்லுங்க.",
  },
  en: {
    greet: "Vanakkam amma! Ungalukku enna udhavi venum?",
    found: (item, v) => `Amma, ${item} is here. Shelf ${v.s}, box ${v.b}. Price ${v.p} rupees.`,
    missing: m => `Amma, sorry, no ${m}. `,
    options: (name, n, call) => `${call ? "Amma, " : ""}${name} comes in ${n} types. `,
    sameShelf: s => `All on shelf ${s}. `,
    option: (lab, v, showShelf) => `${lab}, ${showShelf ? `shelf ${v.s}, ` : ""}box ${v.b}, ${v.p} rupees.`,
    more: n => ` And ${n} more.`,
    pick: " Tell me which one you want.",
    notFound: q => `Amma, I couldn't find ${q}. Try another name.`,
    noSpeech: "Amma, I didn't hear anything. Please say it once more.",
  },
};

const SAY = {
  en: { "0.5": "half", "0.25": "quarter", "0.75": "three fourth", "1.5": "one and a half",
        inch: "inch", ft: "feet", mm: "mm", sqmm: "square mm", ml: "ml", l: "litre", w: "watt", a: "amp", kg: "kg", g: "gram", m: "metre" },
  ta: { "0.5": "அரை", "0.25": "கால்", "0.75": "முக்கால்", "1.5": "ஒன்றரை", "2.5": "இரண்டரை",
        inch: "இஞ்ச்", ft: "அடி", mm: "மில்லிமீட்டர்", sqmm: "சதுர மில்லிமீட்டர்", ml: "மில்லி", l: "லிட்டர்", w: "வாட்", a: "ஆம்ப்", kg: "கிலோ", g: "கிராம்", m: "மீட்டர்" },
};

// '¾"' → "three fourth inch" / "முக்கால் இஞ்ச்";  "Black" → "Black" / "கருப்பு"
export function sayLabel(label, taLabel, lang) {
  if (lang === "ta" && taLabel) return taLabel;
  const c = canon(label);
  if (!/\d/.test(c)) return label;
  const tk = c.split(" ");
  return tk.map((t, i) => {
    // fractions are said as words only for inches ("half inch"), not for "0.75 sq mm"
    if (isNum(t)) return tk[i + 1] === "inch" && SAY[lang][t] ? SAY[lang][t] : t;
    return SAY[lang][t] || t;
  }).join(" ");
}

export const line = (lang, key, ...args) => {
  const l = LINES[lang][key];
  return typeof l === "function" ? l(...args) : l;
};

export function speechText(r, picked, lang) {
  const { it } = r, L = LINES[lang];
  const name = lang === "ta" ? it.ta || it.name : it.name;
  const vi = picked ?? r.vi;

  if (vi != null) {
    const v = it.vars[vi];
    return L.found(v.label ? `${name} ${sayLabel(v.label, v.ta, lang)}` : name, v);
  }

  // No variant named: say what's missing, then read out every option
  const vs = it.vars, sameShelf = vs.every(v => v.s === vs[0].s), MAX = 5;
  let t = r.missing ? L.missing(sayLabel(r.missing, "", lang)) : "";
  t += L.options(name, vs.length, !r.missing); // "அம்மா" once, at the start
  if (sameShelf) t += L.sameShelf(vs[0].s);
  t += vs.slice(0, MAX).map(v => L.option(sayLabel(v.label, v.ta, lang), v, !sameShelf)).join(" ");
  if (vs.length > MAX) t += L.more(vs.length - MAX);
  return t + L.pick;
}

// Prefer a male voice (he's the son); fall back to whatever the phone has
const MALE = /valluvar|ravi|prabhat|hemant|\bmale\b/i;
function pickVoice(voices, langRe) {
  const vs = voices.filter(v => langRe.test(v.lang));
  return vs.find(v => MALE.test(v.name) && !/female/i.test(v.name)) || vs[0];
}

export const hasTamilVoice = () => {
  try { return speechSynthesis.getVoices().some(v => /^ta/i.test(v.lang)); } catch (e) { return false; }
};

export function speak(text, wantTamil, onstart) {
  try {
    const ss = window.speechSynthesis; if (!ss) return;
    ss.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = ss.getVoices();
    const ta = wantTamil && pickVoice(voices, /^ta/i);
    if (ta) { u.voice = ta; u.lang = ta.lang; }
    else { const en = pickVoice(voices, /en.IN/i); if (en) u.voice = en; u.lang = "en-IN"; }
    u.rate = 0.9;
    if (onstart) u.onstart = onstart;
    ss.speak(u);
  } catch (e) {}
}

// Voices load a moment after the page; wait for them (or give up after 1.5 s)
export const voicesReady = () => new Promise(res => {
  try {
    if (speechSynthesis.getVoices().length) return res();
    speechSynthesis.addEventListener("voiceschanged", () => res(), { once: true });
  } catch (e) { return res(); }
  setTimeout(res, 1500);
});
try { speechSynthesis.getVoices(); } catch (e) {}
