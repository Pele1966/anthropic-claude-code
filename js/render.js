/* ================================================
   Render — all DOM rendering functions
   ================================================ */

import { CONCERNS, PRODUCTS } from "./data.js";
import { $, escapeHtml, linkifyProducts, productLink, prettyConcern } from "./helpers.js";
import { computeContext } from "./engine.js";

// -----------------------------
// Concern group checkboxes
// -----------------------------
export function renderConcernGroups(){
  const host = $("concernGroups");
  host.innerHTML = "";
  CONCERNS.forEach(group => {
    const box = document.createElement("div");
    box.className = "group";
    box.innerHTML = `
      <div class="ghead">
        <div>
          <strong>${escapeHtml(group.title)}</strong>
          <div class="small">${escapeHtml(group.hint)}</div>
        </div>
        <span>${escapeHtml(group.items.length + " options")}</span>
      </div>
      <div class="gbody"><div class="chips"></div></div>
    `;
    const chips = box.querySelector(".chips");
    group.items.forEach(it => {
      const chip = document.createElement("label");
      chip.className = "chip";
      chip.innerHTML = `<input type="checkbox" data-concern="${escapeHtml(it.id)}" /> <span>${escapeHtml(it.label)}</span>`;
      chips.appendChild(chip);
    });
    host.appendChild(box);
  });
}

// -----------------------------
// Full results output
// -----------------------------
export function renderResults(profile, selected, treatmentId, protocol, layering, home){
  const out = $("output");
  out.innerHTML = "";

  const ctx = computeContext(profile, selected);

  out.appendChild(renderHeader(profile, selected, protocol, ctx));
  out.appendChild(renderProtocol(protocol));
  out.appendChild(renderLayering(layering, ctx));
  out.appendChild(renderHomeCare(home));
  out.appendChild(renderContra(protocol.contraindications));

  $("emptyState").style.display = "none";
  out.style.display = "grid";
}

// -----------------------------
// Recommendation header card
// -----------------------------
function renderHeader(profile, selected, protocol, ctx){
  const hdr = document.createElement("div");
  hdr.className = "card";
  hdr.innerHTML = `
    <h2>Recommendation</h2>
    <div class="content">
      <div class="kpi">
        <span class="badge good">Treatment: <b style="color:inherit">${escapeHtml(protocol.name)}</b></span>
        <span class="badge">Duration: <b style="color:inherit">${protocol.duration}</b></span>
        <span class="badge">Comfort: <b style="color:inherit">${protocol.comfort}</b></span>
        <span class="badge">Downtime: <b style="color:inherit">${protocol.downtime}</b></span>
      </div>
      <div class="hr"></div>
      <div class="small"><b>Profile:</b> ${profile.age}y, ${profile.sex}, ${profile.skinType} skin, ${profile.skinTone} tone</div>
      <div class="small"><b>Selected concerns:</b> ${selected.map(prettyConcern).join(", ") || "—"}</div>
      <div class="hr"></div>
      <div class="small"><b>Safety cue:</b> ${ctx.inflamed ? "Inflammation detected → gentle exfoliation (enzyme only), minimise friction, avoid traumatic extractions." : "No major inflammation detected → standard choices allowed."}</div>
    </div>
  `;
  return hdr;
}

// -----------------------------
// Protocol steps (collapsible)
// -----------------------------
function renderProtocol(protocol){
  const d = document.createElement("details");
  d.open = true;
  d.innerHTML = `
    <summary>
      <div>
        <div style="font-weight:900; font-size:13px">Full treatment protocol</div>
        <div class="small">Click to collapse/expand</div>
      </div>
      <span class="badge">Steps: <b style="color:inherit">${protocol.steps.length}</b></span>
    </summary>
    <div class="steps"></div>
  `;
  const wrap = d.querySelector(".steps");
  protocol.steps.forEach(s => {
    const row = document.createElement("div");
    row.className = "step";
    row.innerHTML = `
      <div class="num">${s.n}</div>
      <div>
        <div class="sTitle">${linkifyProducts(s.title)}</div>
        <div class="sMeta">${linkifyProducts(s.meta)}</div>
      </div>
    `;
    wrap.appendChild(row);
  });
  return d;
}

// -----------------------------
// Serum layering card
// -----------------------------
function renderLayering(layering, ctx){
  const c = document.createElement("div");
  c.className = "card";

  const main = layering.chosen.length
    ? `<ul class="list">${layering.chosen.map(x=>`<li><b>${linkifyProducts(x)}</b></li>`).join("")}</ul>`
    : `<div class="small">No additional serum layering needed for this profile.</div>`;

  const post = layering.postMoisturiser.length
    ? `<div class="hr"></div><div class="small"><b>After moisturiser only:</b> ${layering.postMoisturiser.map(x => linkifyProducts(x)).join(", ")}</div>`
    : `<div class="hr"></div><div class="small"><b>After moisturiser only:</b> none recommended.</div>`;

  c.innerHTML = `
    <h2>Targeted Serum Layering</h2>
    <div class="content">
      <div class="small">This section is intentionally strict: it shows only the serums that match the selected concerns. Default is <b>1–2 serums max</b>.</div>
      <div class="hr"></div>
      ${main}
      ${post}
      <div class="hr"></div>
      <div class="small"><b>Placement:</b> Between the last ${productLink(PRODUCTS.ampoule)} step and eye/cream. Lifting goes after moisturiser.</div>
      <div class="small"><b>Acne note:</b> If acne is inflamed, prioritise ${productLink(PRODUCTS.calming)} and avoid over‑layering.</div>
    </div>
  `;
  return c;
}

// -----------------------------
// Home care card
// -----------------------------
function renderHomeCare(home){
  const c = document.createElement("div");
  c.className = "card";

  const fmt = (arr) => `<ul class="list">${arr.map(x=>`<li>${linkifyProducts(x)}</li>`).join("")}</ul>`;

  c.innerHTML = `
    <h2>Home care (tailored)</h2>
    <div class="content">
      <div class="row">
        <div>
          <div class="sectionTitle">AM</div>
          ${fmt(home.am)}
        </div>
        <div>
          <div class="sectionTitle">PM</div>
          ${fmt(home.pm)}
        </div>
      </div>
      <div class="hr"></div>
      <div class="sectionTitle">Weekly / optional</div>
      ${home.weekly.length ? fmt(home.weekly) : `<div class="small">None.</div>`}
      <div class="hr"></div>
      <div class="small">Keep the routine realistic. If irritation increases: simplify → cleanser, toner, calming, moisturiser, SPF.</div>
    </div>
  `;
  return c;
}

// -----------------------------
// Contraindications card
// -----------------------------
function renderContra(contra){
  const c = document.createElement("div");
  c.className = "card";
  c.innerHTML = `
    <h2>Contraindications cue</h2>
    <div class="content">
      <div class="small">This is a quick therapist reminder (not medical advice). If anything feels unclear, consult management / client physician.</div>
      <div class="hr"></div>
      <div class="small"><b>${escapeHtml(contra)}</b></div>
    </div>
  `;
  return c;
}
