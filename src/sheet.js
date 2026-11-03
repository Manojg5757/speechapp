/*
  Load the product list from a Google Sheet.

  In Google Sheets: File → Share → Publish to web → choose the products sheet
  and "Comma-separated values (.csv)" → Publish, then paste the link below.
  Leave it empty to use the list in products.js.
*/
export const SHEET_CSV_URL = "";

const CACHE = "sheetProducts";

// One row per size/type. Rows with the same Product make one product.
// Columns are found by their heading, so their order doesn't matter.
const COLS = {
  product: ["product"], ta: ["tamil name"], names: ["other names"], cat: ["category"],
  v: ["size / type", "size", "type", "variant"], vta: ["size tamil"], va: ["size other names"],
  s: ["shelf"], b: ["box"], p: ["price"], u: ["unit"], img: ["picture", "image", "photo"], color: ["colour", "color"],
};
const CAT = {
  plumbing: "plumbing", பிளம்பிங்: "plumbing", electrical: "electrical", எலக்ட்ரிக்கல்: "electrical",
  hardware: "hardware", ஹார்டுவேர்: "hardware",
};

export function parseCSV(text) {
  const rows = []; let row = [], f = "", q = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { f += '"'; i++; }
      else if (ch === '"') q = false;
      else f += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(f); f = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(f); rows.push(row); row = []; f = "";
    } else f += ch;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}

const split = s => (s || "").split(/[,،]/).map(x => x.trim()).filter(Boolean);
const num = s => { const n = parseFloat(String(s || "").replace(/[₹,\s]/g, "")); return Number.isFinite(n) ? n : undefined; };

// CSV text → the same shape as PRODUCTS in products.js
export function sheetToProducts(text) {
  const [head, ...rows] = parseCSV(text);
  if (!head) return [];
  const h = head.map(x => x.trim().toLowerCase());
  const at = {};
  for (const [k, names] of Object.entries(COLS)) at[k] = h.findIndex(x => names.includes(x));
  if (at.product < 0) throw new Error("Sheet needs a 'Product' column");
  const get = (r, k) => (at[k] >= 0 ? (r[at[k]] || "").trim() : "");

  const byName = new Map();
  for (const r of rows) {
    const name = get(r, "product");
    if (!name) continue;
    let p = byName.get(name.toLowerCase());
    if (!p) {
      p = { n: name, ta: [], a: [], c: "", v: [] };
      byName.set(name.toLowerCase(), p);
    }
    p.ta.push(...split(get(r, "ta")));
    p.a.push(...split(get(r, "names")));
    const c = get(r, "cat").toLowerCase();
    if (c && !p.c) p.c = CAT[c] || c;
    const img = get(r, "img");
    const v = {
      v: get(r, "v"), ta: split(get(r, "vta")), a: split(get(r, "va")),
      s: num(get(r, "s")), b: num(get(r, "b")), p: num(get(r, "p")), u: get(r, "u") || undefined,
      img: img || undefined, color: get(r, "color") || undefined,
    };
    if (!p.img && img) p.img = img;
    p.v.push(v);
  }
  // a product with one row and no size is a plain product
  return [...byName.values()].map(p => {
    if (!p.c) p.c = "hardware";
    if (p.v.length === 1 && !p.v[0].v) {
      const [v] = p.v; delete p.v;
      return { ...p, s: v.s, b: v.b, p: v.p, u: v.u, img: v.img || p.img };
    }
    // the product's own picture is on its first row; other rows only set one when it differs
    p.v.forEach(v => { if (v.img === p.img) delete v.img; });
    return p;
  });
}

export function cachedProducts() {
  try { const c = JSON.parse(localStorage.getItem(CACHE)); return c && c.products && c.products.length ? c : null; } catch (e) { return null; }
}

// Fetch the sheet; keep the last good copy so the app still works offline
export async function fetchProducts() {
  if (!SHEET_CSV_URL) return null;
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store", signal: ctl.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const products = sheetToProducts(await res.text());
    if (!products.length) throw new Error("Sheet is empty");
    const c = { products, at: Date.now() };
    try { localStorage.setItem(CACHE, JSON.stringify(c)); } catch (e) {}
    return c;
  } finally { clearTimeout(t); }
}
