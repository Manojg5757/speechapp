/*
  Simple product drawings (64×64). Outlines use the text colour, fills use the
  category colour (--cat), so they suit light and dark mode.
  Insulation tape takes the variant's colour from --tape.
*/
const A = `fill="var(--cat)" fill-opacity=".28"`;   // soft category fill
const S = `fill="var(--cat)"`;                       // solid category fill
const W = `fill="var(--surface)"`;                   // plain white/dark face

export const ICONS = {
  pipe: `<rect x="6" y="22" width="48" height="20" rx="2" ${A}/><ellipse cx="54" cy="32" rx="5" ry="10" ${W}/><ellipse cx="54" cy="32" rx="2.5" ry="6"/><path d="M6 22v20"/>`,
  elbow: `<path d="M6 8v26a24 24 0 0 0 24 24h26V42H30a8 8 0 0 1-8-8V8z" ${A}/><path d="M4 8h20M56 40v20"/>`,
  tee: `<path d="M6 16h52v18H41v24H23V34H6z" ${A}/><path d="M6 14v22M58 14v22M21 58h22"/>`,
  valve: `<path d="M4 26h14v12H4zM46 26h14v12H46z" ${A}/><rect x="18" y="20" width="28" height="24" rx="5" ${A}/><path d="M32 20v-8"/><rect x="14" y="6" width="36" height="7" rx="3.5" ${S}/>`,
  tap: `<path d="M4 20h28a12 12 0 0 1 12 12v10h-9V33a4 4 0 0 0-4-4H4z" ${A}/><path d="M22 20v-9M12 10h20"/><circle cx="39.5" cy="50" r="2.2" ${S}/><circle cx="39.5" cy="58" r="2.2" ${S}/>`,
  roll: `<circle cx="28" cy="32" r="22" ${W}/><circle cx="28" cy="32" r="22" ${A}/><circle cx="28" cy="32" r="9" ${W}/><path d="M50 32h10v18"/>`,
  tape: `<circle cx="28" cy="32" r="22" fill="var(--tape,var(--ink))"/><circle cx="28" cy="32" r="9" ${W}/><path d="M50 32h10v18" stroke="var(--tape,var(--ink))" stroke-width="6"/>`,
  tube: `<rect x="26" y="4" width="12" height="8" rx="2" ${S}/><path d="M20 12h24v6l-3 40H23l-3-40z" ${W}/><path d="M20 12h24v6l-3 40H23l-3-40z" ${A}/><path d="M22 28h20v14H22z" ${S}/>`,
  clamp: `<circle cx="32" cy="38" r="11" ${A}/><path d="M6 27h10a16 16 0 0 1 32 0h10"/><circle cx="11" cy="27" r="2.5" ${S}/><circle cx="53" cy="27" r="2.5" ${S}/>`,
  shower: `<path d="M6 8h22v12"/><path d="M14 20h28l8 12H6z" ${A}/><path d="M12 40l-2 6M22 40l-1 8M32 40v8M42 40l1 8M50 40l2 6" stroke="var(--cat)"/>`,
  hose: `<path d="M12 16c22 0 14 34 40 34" stroke="var(--cat)" stroke-width="7" stroke-opacity=".5"/><path d="M12 16c22 0 14 34 40 34" stroke-dasharray="2 3"/><rect x="2" y="10" width="12" height="12" rx="2" ${W}/><rect x="50" y="44" width="12" height="12" rx="2" ${W}/>`,
  switch: `<rect x="10" y="10" width="44" height="44" rx="7" ${W}/><rect x="24" y="18" width="16" height="28" rx="3" ${S}/><path d="M28 32h8"/>`,
  socket: `<rect x="10" y="10" width="44" height="44" rx="7" ${W}/><circle cx="32" cy="23" r="4.5" ${S}/><circle cx="23" cy="40" r="3.5" ${S}/><circle cx="41" cy="40" r="3.5" ${S}/>`,
  bulb: `<path d="M32 4a18 18 0 0 0-10 33v7h20v-7A18 18 0 0 0 32 4z" ${A}/><path d="M27 30l5-8 5 8M22 50h20M24 56h16"/>`,
  coil: `<circle cx="32" cy="32" r="24" ${A}/><circle cx="32" cy="32" r="17"/><circle cx="32" cy="32" r="10"/><circle cx="32" cy="32" r="4" ${W}/><path d="M56 32h6"/>`,
  mcb: `<rect x="18" y="4" width="28" height="56" rx="3" ${W}/><rect x="25" y="20" width="14" height="18" rx="2" ${S}/><path d="M24 10h16M24 54h16"/>`,
  tubelight: `<rect x="4" y="25" width="56" height="14" rx="7" ${A}/><path d="M10 25v14M54 25v14"/><path d="M14 46l-2 5M32 46v6M50 46l2 5" stroke="var(--cat)"/>`,
  rose: `<path d="M10 42a22 22 0 0 1 44 0z" ${A}/><path d="M6 42h52M32 42v18"/><circle cx="32" cy="60" r="1.5"/>`,
  board: `<rect x="10" y="24" width="50" height="22" rx="5" ${W}/><circle cx="21" cy="35" r="4" ${A}/><circle cx="33" cy="35" r="4" ${A}/><circle cx="45" cy="35" r="4" ${A}/><rect x="52" y="31" width="5" height="8" rx="1" ${S}/><path d="M10 35C4 35 4 50 2 56"/>`,
  fuse: `<rect x="16" y="6" width="32" height="52" rx="3" ${W}/><path d="M16 16h32M16 22h32M16 28h32M16 34h32M16 40h32M16 46h32" stroke="var(--cat)"/>`,
  screw: `<path d="M18 6h28l-5 9H23z" ${A}/><path d="M27 15h10v30l-5 14-5-14z" ${W}/><path d="M27 21l10-3M27 28l10-3M27 35l10-3M27 42l10-3"/>`,
  plug: `<rect x="8" y="20" width="7" height="24" rx="2" ${S}/><path d="M15 25h33l10 7-10 7H15z" ${A}/><path d="M24 25v14M32 25v14M40 25v14"/>`,
  nails: `<path d="M14 6h14M21 6v42l0 8" stroke-width="3.5"/><path d="M36 14h14M43 14v36l0 8" stroke-width="3.5"/><path d="M21 48l0 8M43 50l0 8" stroke="var(--cat)" stroke-width="3.5"/>`,
};

const BASE = import.meta.env.BASE_URL;

// img is a drawing name from ICONS, or a photo path inside public/ (e.g. "products/elbow.jpg")
export function productImage(img, cls, tape) {
  if (!img) return "";
  const style = tape ? ` style="--tape:${tape}"` : "";
  if (ICONS[img]) {
    return `<span class="${cls}"${style} aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[img]}</svg></span>`;
  }
  const src = /^(https?:)?\/\//.test(img) ? img : BASE + img.replace(/^\//, "");
  return `<span class="${cls} photo"${style}><img src="${src}" alt="" loading="lazy"></span>`;
}
