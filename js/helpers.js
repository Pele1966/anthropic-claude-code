/* ================================================
   Helpers — DOM shortcuts, escaping, product links
   ================================================ */

import { PRODUCTS, PRODUCT_URLS, CONCERNS } from "./data.js";

// DOM shortcut
export const $ = (id) => document.getElementById(id);

// Toast notification
export function toast(title, msg){
  const el = $("toast");
  $("toastTitle").textContent = title;
  $("toastMsg").textContent = msg;
  el.style.display = "block";
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>{ el.style.display = "none"; }, 4200);
}

// Deduplicate an array (preserving order)
export function uniq(list){
  return Array.from(new Set(list.filter(Boolean)));
}

// Read checked concern checkboxes
export function getSelectedConcerns(){
  const boxes = Array.from(document.querySelectorAll("input[data-concern]:checked"));
  return boxes.map(b => b.getAttribute("data-concern"));
}

// Check if any of `ids` are in `selected`
export function hasAny(selected, ids){
  const s = new Set(selected);
  return ids.some(x => s.has(x));
}

// HTML-escape a string
export function escapeHtml(s){
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

// Product names sorted longest-first (avoids partial matches during linkification)
const _productNames = Object.values(PRODUCTS).sort((a, b) => b.length - a.length);

// Wrap a single known product name in an <a> linking to drsturm.com
export function productLink(name){
  const esc = escapeHtml(name);
  const url = PRODUCT_URLS[name];
  if (!url) return esc;
  return `<a href="${url}" target="_blank" rel="noopener" class="product-link">${esc}</a>`;
}

// Scan text for ALL known product names and wrap each in a product link
export function linkifyProducts(text){
  let html = escapeHtml(text);
  for (const name of _productNames){
    const esc = escapeHtml(name);
    if (html.includes(esc)){
      const url = PRODUCT_URLS[name];
      if (!url){ continue; }
      const link = `<a href="${url}" target="_blank" rel="noopener" class="product-link">${esc}</a>`;
      html = html.split(esc).join(link);
    }
  }
  return html;
}

// Convert a concern ID to its human-readable label
export function prettyConcern(id){
  const map = prettyConcern._m || (prettyConcern._m = (function(){
    const m = {};
    CONCERNS.forEach(g => g.items.forEach(i => m[i.id] = i.label));
    return m;
  })());
  return map[id] || id;
}
