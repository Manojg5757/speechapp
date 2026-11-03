import { canon, isNum } from "./search.js";

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

export function speechText(r, picked, lang) {
  const { it } = r, ta = lang === "ta";
  const name = ta ? it.ta || it.name : it.name;
  const one = v => ta
    ? `அலமாரி ${v.s}. பெட்டி ${v.b}. விலை ${v.p} ரூபாய்.`
    : `Shelf ${v.s}, box ${v.b}. Price ${v.p} rupees.`;
  const vi = picked ?? r.vi;

  if (vi != null) {
    const v = it.vars[vi];
    const lab = v.label ? " " + sayLabel(v.label, v.ta, lang) : "";
    return `${name}${lab}. ${one(v)}`;
  }

  // No variant named: say what's missing, then read out every option
  let t = r.missing ? (ta ? `${sayLabel(r.missing, "", lang)} இல்லை. ` : `No ${sayLabel(r.missing, "", lang)}. `) : "";
  const vs = it.vars, sameShelf = vs.every(v => v.s === vs[0].s), MAX = 5;
  t += ta ? `${name}. ${vs.length} வகைகள் உள்ளன. ` : `${name}. ${vs.length} options. `;
  if (sameShelf) t += ta ? `அலமாரி ${vs[0].s}. ` : `Shelf ${vs[0].s}. `;
  t += vs.slice(0, MAX).map(v => {
    const lab = sayLabel(v.label, v.ta, lang);
    return ta
      ? `${lab}: ${sameShelf ? "" : `அலமாரி ${v.s}, `}பெட்டி ${v.b}, ${v.p} ரூபாய்.`
      : `${lab}: ${sameShelf ? "" : `shelf ${v.s}, `}box ${v.b}, ${v.p} rupees.`;
  }).join(" ");
  if (vs.length > MAX) t += ta ? ` மேலும் ${vs.length - MAX}.` : ` And ${vs.length - MAX} more.`;
  return t;
}

export function speak(text, wantTamil) {
  try {
    const ss = window.speechSynthesis; if (!ss) return;
    ss.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = ss.getVoices();
    const ta = wantTamil && voices.find(v => /^ta/i.test(v.lang));
    if (ta) { u.voice = ta; u.lang = ta.lang; }
    else { const en = voices.find(v => /en.IN/i.test(v.lang)); if (en) u.voice = en; u.lang = "en-IN"; }
    u.rate = 0.9;
    ss.speak(u);
  } catch (e) {}
}

export const hasTamilVoice = () => {
  try { return speechSynthesis.getVoices().some(v => /^ta/i.test(v.lang)); } catch (e) { return false; }
};
try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); } catch (e) {}
