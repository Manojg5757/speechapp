import "./style.css";
import { CATS, SHELVES } from "./products.js";
import { ITEMS, search, topScore } from "./search.js";
import { speak, speechText, hasTamilVoice } from "./speak.js";

const $ = id => document.getElementById(id);
let cat = "all", speakOn = true, lastSpoken = "", timer;
let shown = null, picked = null; // result on the big card, and the variant tapped on it
try { if (localStorage.getItem("speakOn") === "0") speakOn = false; } catch (e) {}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const rupee = n => "₹" + n.toLocaleString("en-IN");
const priceRange = vs => {
  const ps = vs.map(v => v.p), lo = Math.min(...ps), hi = Math.max(...ps);
  return lo === hi ? rupee(lo) : `${rupee(lo)}–${rupee(hi).slice(1)}`;
};
const ICON_SAY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>`;

function bestCard(r) {
  const { it } = r, c = CATS[it.c], vi = picked ?? r.vi, v = vi != null ? it.vars[vi] : null;
  const vs = it.vars, sameShelf = vs.every(x => x.s === vs[0].s);
  const shelf = v ? v.s : sameShelf ? vs[0].s : "—";
  const onShelves = new Set(v ? [v.s] : vs.map(x => x.s));
  let strip = ""; for (let i = 1; i <= SHELVES; i++) strip += `<span class="${onShelves.has(i) ? "on" : ""}">${i}</span>`;
  const others = [...it.names.slice(1), ...it.tas.slice(1)];

  return `<article class="label" style="--cat:${c.color}">
  <div class="label-top"><span class="cat">${c.ta} · ${c.en}</span>
   <h3 class="pname">${esc(it.name)}${v && v.label ? ` <span class="vbadge">${esc(v.label)}</span>` : ""}</h3>
   <span class="pta">${esc(it.ta)}${v && v.ta ? " · " + esc(v.ta) : ""}</span>
   ${others.length ? `<span class="aka">மற்ற பெயர்கள் · Also called: ${others.map(esc).join(", ")}</span>` : ""}</div>
  ${r.missing && vi == null ? `<p class="miss"><b>${esc(r.missing.toUpperCase())}</b> இல்லை · not available. கீழே உள்ளவை · Available:</p>` : ""}
  ${it.multi ? `<div class="vars"><span class="k">வகை · Options${vi == null ? " — தேர்வு செய்யுங்கள் · pick one" : ""}</span><div class="vchips">${vs.map((x, i) =>
    `<button class="vchip" data-vi="${i}" aria-pressed="${i === vi}">${esc(x.label)}<small>${rupee(x.p)}${x.b !== vs[0].b || x.s !== vs[0].s || i === 0 ? ` · S${x.s} B${x.b}` : ""}</small></button>`).join("")}</div></div>` : ""}
  <div class="loc">
   <div><span class="k">அலமாரி<br>Shelf</span><span class="v">${shelf}</span></div>
   <div><span class="k">பெட்டி<br>Box</span><span class="v">${v ? v.b : "—"}</span></div>
   <div class="price"><span class="k">விலை<br>Price</span><span class="v${v ? "" : " range"}">${v ? rupee(v.p) : priceRange(vs)}</span><span class="unit">${esc((v || vs[0]).u || "")}</span></div>
  </div>
  <p class="strip-cap">${v || sameShelf ? `கடையில் அலமாரி ${shelf} · Shelf ${shelf} in the shop` : "அளவைப் பொறுத்து அலமாரி மாறும் · Shelf depends on the option"}</p>
  <div class="strip" aria-hidden="true">${strip}</div>
  <div class="label-foot"><span class="note">${v ? `Box ${v.b} on shelf ${v.s}` : `${vs.length} options`}</span>
   <button class="say" id="sayBtn">${ICON_SAY}சொல்லு · Speak</button></div>
 </article>`;
}

function row(r) {
  const { it } = r, v = r.vi != null ? it.vars[r.vi] : null;
  const shelves = [...new Set(it.vars.map(x => x.s))].join(", ");
  const where = v
    ? `S${v.s} · B${v.b}<small>${rupee(v.p)}</small>`
    : `S${shelves}<small>${it.vars.length} options · ${priceRange(it.vars)}</small>`;
  return `<li><button class="row" data-i="${it.i}" data-vi="${r.vi ?? ""}" style="--cat:${CATS[it.c].color}">
  <span class="n">${esc(it.name)}${v && v.label ? ` <span class="vtag">${esc(v.label)}</span>` : ""}</span><span class="t">${esc(it.ta)}</span>
  <span class="where">${where}</span></button></li>`;
}

function say(r, force) {
  const vi = picked ?? r.vi, key = `${r.it.i}:${vi}`;
  if (!force && (!speakOn || lastSpoken === key)) return;
  lastSpoken = key;
  const ta = hasTamilVoice();
  speak(speechText(r, picked, ta ? "ta" : "en"), ta);
}

function render(speakIt) {
  const raw = $("q").value, items = search(raw, cat);
  const best = $("best"), list = $("list"), more = $("moreTitle");
  picked = null;
  if (raw.trim() && !items.length) {
    shown = null;
    best.innerHTML = `<div class="empty"><b>“${esc(raw)}” கிடைக்கவில்லை.</b><br>Not found. Try another name, or check the spelling the keyboard wrote.</div>`;
    list.innerHTML = ""; more.hidden = true; return;
  }
  if (!raw.trim()) {
    shown = null; best.innerHTML = "";
    more.hidden = false; more.textContent = "எல்லா பொருட்களும் · All products";
    list.innerHTML = items.map(row).join("");
    return;
  }
  shown = items[0];
  best.innerHTML = bestCard(shown);
  more.textContent = "மற்றவை · Other matches"; more.hidden = items.length < 2;
  list.innerHTML = items.slice(1, 6).map(row).join("");
  if (speakIt && shown.s >= 60) say(shown, false);
}

$("best").addEventListener("click", e => {
  if (!shown) return;
  if (e.target.closest("#sayBtn")) { say(shown, true); return; }
  const b = e.target.closest(".vchip"); if (!b) return;
  picked = +b.dataset.vi;
  $("best").innerHTML = bestCard(shown);
  say(shown, true);
});

$("q").addEventListener("input", () => { render(false); clearTimeout(timer); timer = setTimeout(() => render(true), 900); });
$("q").addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); clearTimeout(timer); lastSpoken = ""; render(true); $("q").blur(); }
});
$("clear").onclick = () => { $("q").value = ""; lastSpoken = ""; render(false); $("q").focus(); };
$("chips").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return; cat = b.dataset.cat;
  document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b)); render(false);
});
$("list").addEventListener("click", e => {
  const r = e.target.closest(".row"); if (!r) return;
  const it = ITEMS[+r.dataset.i], vi = r.dataset.vi === "" ? null : +r.dataset.vi;
  const label = vi != null ? it.vars[vi].label : "";
  $("q").value = label ? `${it.name} ${label}` : it.name;
  render(false);
  if (shown) say(shown, true);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const tg = $("speakToggle");
function syncToggle() { tg.setAttribute("aria-pressed", speakOn); tg.textContent = "சத்தம்: " + (speakOn ? "ON" : "OFF"); }
tg.onclick = () => { speakOn = !speakOn; try { localStorage.setItem("speakOn", speakOn ? "1" : "0"); } catch (e) {} syncToggle(); };
syncToggle();

// ---- Voice: in-app mic (Chrome / Android). Falls back to the keyboard mic if blocked.
let lang = "ta-IN", rec = null, listening = false;
try { if (localStorage.getItem("lang") === "en-IN") lang = "en-IN"; } catch (e) {}
const langBtn = $("lang"), micBtn = $("mic"), micText = $("micText"), hint = $("hint");
const syncLang = () => { langBtn.textContent = lang === "ta-IN" ? "தமிழ்" : "English"; };
syncLang();
langBtn.onclick = () => { lang = lang === "ta-IN" ? "en-IN" : "ta-IN"; try { localStorage.setItem("lang", lang); } catch (e) {} syncLang(); };
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function fallback(msg) {
  micBtn.classList.remove("listening"); listening = false; micText.textContent = "அழுத்தி பேசுங்கள் · Speak";
  hint.innerHTML = msg || "இந்த இடத்தில் மைக் வேலை செய்யாது. கீபோர்டில் உள்ள <b>மைக்</b> பட்டனை பயன்படுத்துங்கள். <br>Mic is blocked here — use the keyboard mic instead.";
  $("q").focus();
}
// The recogniser gives several guesses; keep the one that best matches a product (and its size)
function bestOf(alts) {
  let top = alts[0] || "", topS = -1;
  for (const t of alts) { const s = topScore(t); if (s > topS) { topS = s; top = t; } }
  return top;
}
micBtn.onclick = () => {
  if (listening) { try { rec && rec.stop(); } catch (e) {} return; }
  if (!SR) { fallback(); return; }
  try {
    rec = new SR(); rec.lang = lang; rec.interimResults = false; rec.maxAlternatives = 5; rec.continuous = false;
    rec.onstart = () => {
      listening = true; micBtn.classList.add("listening"); micText.textContent = "கேட்கிறேன்… · Listening";
      hint.textContent = lang === "ta-IN" ? "பொருள் பெயரும் அளவும் சொல்லுங்கள் — எ.கா. “எல்போ முக்கால் இஞ்ச்”." : "Say the product and size — e.g. “solvent 50 ml”.";
    };
    rec.onresult = e => {
      const alts = []; for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
      $("q").value = bestOf(alts); lastSpoken = ""; render(true);
    };
    rec.onerror = e => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") fallback();
      else if (e.error === "no-speech") fallback("எதுவும் கேட்கவில்லை. மீண்டும் அழுத்தி பேசுங்கள். · Didn't hear anything, tap and try again.");
      else fallback("மீண்டும் முயற்சிக்கவும். · Try again. (" + e.error + ")");
    };
    rec.onend = () => {
      if (listening) {
        listening = false; micBtn.classList.remove("listening"); micText.textContent = "அழுத்தி பேசுங்கள் · Speak";
        if (!/கீபோர்டில்|எதுவும்|மீண்டும்/.test(hint.textContent)) hint.textContent = "மீண்டும் தேட பட்டனை அழுத்துங்கள். · Tap to search again.";
      }
    };
    rec.start();
  } catch (e) { fallback(); }
};

$("q").value = "elbow"; render(false);
