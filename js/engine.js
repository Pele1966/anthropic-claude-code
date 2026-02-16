/* ================================================
   Engine — core recommendation logic
   ================================================
   Pure functions: profile + concerns in → recommendations out.
   No DOM access here.
*/

import { PRODUCTS } from "./data.js";
import { uniq, hasAny } from "./helpers.js";

// -----------------------------
// Context detection
// -----------------------------
export function computeContext(profile, selected){
  const like = (re)=> (selected||[]).some(x => re.test(String(x)));

  const inflamed = hasAny(selected, ["acne_inflammatory","razor_burn","barrier_damaged","sensitive_skin","acne_sensitive","redness"]) || like(/inflamm|papul|pustul|razor|burn|redness/i);
  const acne     = hasAny(selected, ["acne_comedonal","acne_inflammatory","acne_sensitive","barrier_damaged"]) || like(/acne|breakout|blemish/i);
  const oily     = profile.skinType === "oily" || hasAny(selected, ["oiliness","large_pores"]);
  const ageing   = hasAny(selected, ["fine_lines","loss_elasticity","uneven_texture"]) || profile.age >= 40;
  const dryness  = profile.skinType === "dry" || hasAny(selected, ["dry_skin","tightness"]);
  const pigment  = hasAny(selected, ["hyperpigmentation","uneven_tone"]);
  const sensitive = profile.skinType === "sensitive" || hasAny(selected, ["sensitive_skin","razor_burn","barrier_damaged","acne_sensitive"]) || like(/sensitive|barrier/i);

  return { inflamed, acne, oily, ageing, dryness, pigment, sensitive };
}

// -----------------------------
// Treatment picker
// -----------------------------
export function pickTreatment(profile, ctx){
  // Core rule set (Meraki / Dr. Sturm):
  // 1) Under 40 + mixed concerns → STURMGLOW with strict layering.
  // 2) 40–44 → SUPER ANTI‑AGING (gentle modifications when needed).
  // 3) 45+ → EXOSO‑METIC only when "clean" profile.

  if ((ctx.acne || ctx.inflamed) && profile.age < 40) return "sturmglow";

  if (profile.age >= 45 && ctx.ageing && !ctx.acne && !ctx.inflamed && !ctx.sensitive) {
    return "exoso";
  }

  if (profile.age >= 40) return "superaa";

  if (ctx.ageing && !ctx.acne && !ctx.inflamed && !ctx.sensitive) return "exoso";

  return "sturmglow";
}

// -----------------------------
// Serum layering
// -----------------------------
export function pickSerumLayering(profile, ctx, treatment){
  const youngAcne = (ctx.acne || ctx.oily) && profile.age <= 25;

  let primary = [];
  if (ctx.acne || ctx.oily) primary.push(PRODUCTS.betterB);
  if (ctx.inflamed || ctx.sensitive || youngAcne) primary.push(PRODUCTS.calming);
  if (!youngAcne && !ctx.inflamed && ctx.pigment) primary.push(PRODUCTS.vitC);
  primary = uniq(primary);

  const chosen = youngAcne
    ? [PRODUCTS.betterB, PRODUCTS.calming].filter(Boolean)
    : primary.slice(0,2);

  const wantsLift = !youngAcne && (ctx.ageing || profile.age >= 35) && !ctx.inflamed;
  const includeLift = wantsLift && treatment !== "exoso";

  const postMoisturiser = [];
  if (includeLift) postMoisturiser.push(PRODUCTS.lifting);

  return { chosen, postMoisturiser };
}

// -----------------------------
// Home care
// -----------------------------
export function pickHomeCare(profile, ctx){
  const am = [];
  const pm = [];
  const youngAcne = (ctx.acne || ctx.oily) && profile.age <= 25;

  am.push(PRODUCTS.cleanser);
  pm.push(PRODUCTS.cleanser);
  am.push(PRODUCTS.toner);
  pm.push(PRODUCTS.toner);

  if (youngAcne) {
    am.push(PRODUCTS.betterB);
    pm.push(PRODUCTS.calming);
    pm.push(PRODUCTS.betterB + " (alternate nights if needed)");
  } else {
    if (ctx.acne || ctx.oily) {
      am.push(PRODUCTS.betterB);
      pm.push(PRODUCTS.betterB);
    }
    if (ctx.inflamed || ctx.sensitive) {
      am.push(PRODUCTS.calming);
      pm.push(PRODUCTS.calming);
    }
    if (ctx.pigment && !ctx.inflamed) {
      am.push(PRODUCTS.vitC);
    }
  }

  if (profile.skinType === "oily" || ctx.oily || youngAcne) {
    am.push(PRODUCTS.lightCream);
    pm.push(PRODUCTS.lightCream);
  } else if (ctx.dryness || profile.skinType === "dry") {
    am.push("FACE CREAM (richer hydration)");
    pm.push("FACE CREAM (richer hydration)");
  } else {
    am.push("FACE CREAM (as needed)");
    pm.push("FACE CREAM (as needed)");
  }

  am.push(PRODUCTS.sunDrops);

  const weekly = [];
  if (ctx.acne || ctx.oily) weekly.push(PRODUCTS.enzyme + " (2–3×/week, gentle – avoid scrub)" );
  if (ctx.pigment) weekly.push(PRODUCTS.enzyme + " (1–2×/week for tone/texture)" );
  if (ctx.dryness) weekly.push("Extra hydration mask as needed" );

  return { am: uniq(am), pm: uniq(pm), weekly: uniq(weekly) };
}

// -----------------------------
// Protocol builder
// -----------------------------
function step(n, title, meta){
  return { n, title, meta };
}

export function buildProtocol(profile, ctx, treatment, layering){
  const enzymeOnly = ctx.inflamed || ctx.acne || ctx.oily || ctx.sensitive || profile.skinType === "sensitive";
  const exfoliationText = enzymeOnly
    ? `${PRODUCTS.enzyme} (gentle, no scrub for this profile)`
    : `${PRODUCTS.scrub} OR ${PRODUCTS.enzyme} (choose based on sensitivity)`;

  if (treatment === "sturmglow"){
    const steps = [
      step(1, "Welcome touch", "2 min"),
      step(2, PRODUCTS.makeup, "If needed • 2 min"),
      step(3, PRODUCTS.cleanser, "3 pumps • 8 min (cleanse + analysis)"),
      step(4, "Steam + Exfoliation", `5 min • ${exfoliationText}`),
      step(5, PRODUCTS.toner, "3 pumps • 1 min"),
      step(6, "Extractions", ctx.acne && ctx.inflamed ? "SKIP extractions (active inflamed acne). If needed, do minimal, non-traumatic." : "Up to 5 min • sanitize extracted areas"),
      step(7, PRODUCTS.ampoule, "3/4 ampoule • 2 min"),
      step(8, "Dr. Sturm Signature Anti‑Aging Massage", `${PRODUCTS.massageCream} • 15 min`),
      step(9, PRODUCTS.mask, `1 walnut • 10 min (arm/hand massage with ${PRODUCTS.bodyCream})`),
      step(10, PRODUCTS.ampoule, "1/4 ampoule • 1 min"),
    ];

    const layer = layering.chosen;
    if (layer.length){
      steps.push(step(11, "Targeted Serum Layering", layer.join(" + ") + " • 1–2 min (1–2 serums max)"));
    }

    steps.push(
      step(12, PRODUCTS.eyeCream, "0.7 pea • 2 min"),
      step(13, PRODUCTS.glowCream, "1 peanut • 1 min"),
    );

    if (layering.postMoisturiser.length){
      steps.push(step(14, "Post‑moisturiser support", layering.postMoisturiser.join(", ") + " • apply AFTER cream"));
    }

    steps.push(
      step(15, "Finishing drops", `${PRODUCTS.antiPollution} OR ${PRODUCTS.glowDrops} OR ${PRODUCTS.sunDrops} (choose 1)`),
      step(16, PRODUCTS.lip, "0.5 pea • 1 min"),
      step(17, PRODUCTS.mist, "3 pumps • 1 min"),
      step(18, PRODUCTS.supplement, "2 capsules (optional)"),
    );

    return {
      name: "STURMGLOW™ FACIAL",
      duration: "60 min",
      comfort: "No pain",
      downtime: "None",
      contraindications: "None (but still screen for active infections / severe irritation)",
      steps
    };
  }

  if (treatment === "superaa"){
    const microcurrentContra = "Pregnancy, pacemaker/metal implants, epilepsy, active or previous cancer tx, diabetes, heart conditions, recent facial surgery";
    const steps = [
      step(1, "Welcome touch", "2 min"),
      step(2, PRODUCTS.makeup, "If needed • 2 min"),
      step(3, PRODUCTS.saacleanser, "1 grape • 8 min (cleanse + analysis)"),
      step(4, "Steam + Exfoliation", `5 min • ${exfoliationText}`),
      step(5, PRODUCTS.toner, "3 pumps • 1 min"),
      step(6, "Extractions", ctx.acne && ctx.inflamed ? "SKIP extractions (active inflamed acne)." : "Up to 10 min • sanitize extracted areas"),
      step(7, PRODUCTS.ampoule, "Full ampoule • 3 min"),
      step(8, "Massage + Microcurrent", `${PRODUCTS.massageCream} • 20 min, then microcurrent with conductive gel (if cleared)`),
      step(9, PRODUCTS.mask, `1 walnut • 10 min (arm/hand massage with ${PRODUCTS.bodyCream})`),
      step(10, PRODUCTS.saaSerum, "4–5 drops • 1 min"),
      step(11, "Eye focus", `${PRODUCTS.saaEyeSerum} (2 drops) + ${PRODUCTS.saaEyeCream} (0.7 pea) • 3–4 min`),
      step(12, PRODUCTS.saaFaceCream, "1 peanut • 1 min"),
    ];

    if (layering.postMoisturiser.length){
      steps.push(step(13, "Post‑moisturiser support", layering.postMoisturiser.join(", ") + " • AFTER cream"));
    }

    steps.push(
      step(14, "Finishing drops", `${PRODUCTS.glowDrops} and/or ${PRODUCTS.sunDrops} (as needed)`),
      step(15, PRODUCTS.neckDec, "1 peanut • 1 min"),
      step(16, PRODUCTS.lip, "0.5 pea • 1 min"),
      step(17, PRODUCTS.mist, "3 pumps • 1 min"),
      step(18, PRODUCTS.supplement, "2 capsules (optional)"),
    );

    return {
      name: "SUPER ANTI‑AGING FACIAL",
      duration: "75 min",
      comfort: "Little or no discomfort",
      downtime: "Little or none",
      contraindications: microcurrentContra,
      steps
    };
  }

  // Exoso‑Metic
  const exoContra = "Pregnancy, skin disease, haemophiliacs/blood disorders, active acne/cold sores, recent injectables, invasive lasers, fillers, corticosteroids, epilepsy, active/previous cancer tx, diabetes, heart conditions, recent facial surgery, heat rash, <24h after Retin‑A, Roaccutane use, bruising, scar tissue, cuts";
  const steps = [
    step(1, "Welcome touch", "2 min"),
    step(2, PRODUCTS.makeup, "If needed • 2 min"),
    step(3, PRODUCTS.saacleanser, "1 grape • 8 min (cleanse + analysis)"),
    step(4, "Steam + Exfoliation", `5 min • ${exfoliationText} (then microdermabrasion if chosen)`),
    step(5, PRODUCTS.toner, "3 pumps • 1 min"),
    step(6, "Extractions", ctx.acne ? "Avoid extractions if acne present." : "Up to 10 min • sanitize extracted areas"),
    step(7, PRODUCTS.ampoule, "1 ampoule • 2 min"),
    step(8, "Dr. Sturm Signature Anti‑Aging Massage", `${PRODUCTS.massageCream} • 10–15 min`),
    step(9, "Microneedling / Microchanneling", "15 min • with 2 ml MC/SERUM"),
    step(10, PRODUCTS.mask, `1 walnut • 10 min (arm/hand massage with ${PRODUCTS.bodyCream})`),
    step(11, PRODUCTS.exoEye, "1 pump • 1 min"),
    step(12, PRODUCTS.exoFace, "1.5 pumps • 1 min"),
    step(13, PRODUCTS.saaEyeCream, "0.7 pea • 2 min"),
    step(14, PRODUCTS.saaFaceCream, "1 peanut • 1 min"),
    step(15, "Finishing drops", `${PRODUCTS.glowDrops} and/or ${PRODUCTS.sunDrops}`),
    step(16, PRODUCTS.lip, "0.5 pea • 1 min"),
    step(17, PRODUCTS.mist, "3 pumps • 1 min"),
    step(18, PRODUCTS.supplement, "2 capsules (optional)"),
  ];

  return {
    name: "EXOSO‑METIC GROWTH FACTOR FACIAL",
    duration: "75 min",
    comfort: "Little or no discomfort",
    downtime: "Little or none",
    contraindications: exoContra,
    steps
  };
}
