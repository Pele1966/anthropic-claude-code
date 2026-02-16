/* ================================================
   Data — concerns, products, product URLs
   ================================================
   Edit this file to add/remove products or concerns.
   No logic here — just data.
*/

// -----------------------------
// Concern groups (shown as checkboxes)
// -----------------------------
export const CONCERNS = [
  {
    id: "acne", title: "Acne & Breakouts", hint: "Inflammation first, keep it gentle.",
    items: [
      { id:"acne_comedonal", label:"Non‑inflammatory acne (comedonal)" },
      { id:"acne_inflammatory", label:"Inflammatory acne (papular/pustular)" },
      { id:"acne_sensitive", label:"Sensitive acne" },
      { id:"barrier_damaged", label:"Acne with barrier damaged" },
      { id:"large_pores", label:"Large pores" },
      { id:"oiliness", label:"Excess oil / shine" },
    ]
  },
  {
    id: "sensitivity", title: "Sensitivity & Shaving", hint: "Reduce friction, avoid over‑exfoliation.",
    items: [
      { id:"sensitive_skin", label:"Sensitive / reactive skin" },
      { id:"razor_burn", label:"Razor burn / ingrowns" },
      { id:"redness", label:"Redness / flushing" },
    ]
  },
  {
    id: "ageing", title: "Ageing & Texture", hint: "Lift only after moisturiser.",
    items: [
      { id:"fine_lines", label:"Fine lines & wrinkles" },
      { id:"loss_elasticity", label:"Loss of elasticity" },
      { id:"dullness", label:"Dull / tired skin" },
      { id:"uneven_texture", label:"Uneven texture" },
    ]
  },
  {
    id: "pigment", title: "Tone & Pigment", hint: "Vitamin C is for tone/brightness.",
    items: [
      { id:"hyperpigmentation", label:"Dark spots / post‑acne marks" },
      { id:"uneven_tone", label:"Uneven skin tone" },
    ]
  },
  {
    id: "dryness", title: "Hydration & Barrier", hint: "Hydration always — but tailor the cream.",
    items: [
      { id:"dry_skin", label:"Dry / dehydrated skin" },
      { id:"tightness", label:"Tightness / flaking" },
    ]
  }
];

// -----------------------------
// Product vocabulary (short keys → display names)
// -----------------------------
export const PRODUCTS = {
  cleanser: "CLEANSER",
  saacleanser: "SUPER ANTI‑AGING CLEANSING CREAM",
  makeup: "MAKE‑UP REMOVER",
  toner: "BALANCING TONER",
  enzyme: "ENZYME CLEANSER",
  scrub: "FACIAL SCRUB",
  ampoule: "HYALURONIC AMPOULE",
  mask: "FACE MASK",
  massageCream: "MASSAGE CREAM",
  bodyCream: "ANTI‑AGING BODY CREAM",
  eyeCream: "EYE CREAM",
  lightCream: "LIGHT CREAM",
  glowCream: "GLOW CREAM",
  saaSerum: "SUPER ANTI‑AGING SERUM",
  saaEyeSerum: "SUPER ANTI‑AGING EYE SERUM",
  saaEyeCream: "SUPER ANTI‑AGING EYE CREAM",
  saaFaceCream: "SUPER ANTI‑AGING FACE CREAM",
  neckDec: "SUPER ANTI‑AGING NECK & DÉCOLLETÉ CREAM",
  exoEye: "EXOSO‑METIC EYE SERUM",
  exoFace: "EXOSO‑METIC FACE SERUM",
  betterB: "THE BETTER B SERUM",
  calming: "CALMING SERUM",
  lifting: "LIFTING SERUM",
  vitC: "THE GOOD VITAMIN C SERUM",
  antiPollution: "ANTI‑POLLUTION DROPS",
  glowDrops: "GLOW DROPS",
  sunDrops: "SUN DROPS SPF 50",
  lip: "LIP BALM",
  mist: "HYALURONIC FACE MIST",
  supplement: "SKIN SUPER ANTI‑AGING"
};

// -----------------------------
// Product page URLs (drsturm.com) — open in new tab on click
// To add a new product: add its display name as key, URL as value.
// -----------------------------
export const PRODUCT_URLS = {
  "CLEANSER": "https://www.drsturm.com/cleanser/",
  "SUPER ANTI‑AGING CLEANSING CREAM": "https://www.drsturm.com/super-anti-aging-cleansing-cream/",
  "MAKE‑UP REMOVER": "https://www.drsturm.com/make-up-remover/",
  "BALANCING TONER": "https://www.drsturm.com/balancing-toner/",
  "ENZYME CLEANSER": "https://www.drsturm.com/enzyme-cleanser/",
  "FACIAL SCRUB": "https://www.drsturm.com/facial-scrub/",
  "HYALURONIC AMPOULE": "https://www.drsturm.com/hyaluronic-serum/",
  "FACE MASK": "https://www.drsturm.com/face-mask/",
  "MASSAGE CREAM": "https://www.drsturm.com/shop-all/",
  "ANTI‑AGING BODY CREAM": "https://www.drsturm.com/anti-aging-body-cream/",
  "EYE CREAM": "https://www.drsturm.com/eye-cream/",
  "LIGHT CREAM": "https://www.drsturm.com/face-cream-light/",
  "GLOW CREAM": "https://www.drsturm.com/glow-cream/",
  "SUPER ANTI‑AGING SERUM": "https://www.drsturm.com/super-anti-aging-serum/",
  "SUPER ANTI‑AGING EYE SERUM": "https://www.drsturm.com/super-anti-aging-eye-serum/",
  "SUPER ANTI‑AGING EYE CREAM": "https://www.drsturm.com/super-anti-aging-eye-cream/",
  "SUPER ANTI‑AGING FACE CREAM": "https://www.drsturm.com/super-anti-aging-face-cream/",
  "SUPER ANTI‑AGING NECK & DÉCOLLETÉ CREAM": "https://www.drsturm.com/super-anti-aging-neck-decollete-cream/",
  "EXOSO‑METIC EYE SERUM": "https://www.drsturm.com/exoso-metic-eye-serum/",
  "EXOSO‑METIC FACE SERUM": "https://www.drsturm.com/exoso-metic-face-serum/",
  "THE BETTER B SERUM": "https://www.drsturm.com/the-better-b-niacinamide-serum/",
  "CALMING SERUM": "https://www.drsturm.com/calming-serum/",
  "LIFTING SERUM": "https://www.drsturm.com/lifting-serum/",
  "THE GOOD VITAMIN C SERUM": "https://www.drsturm.com/the-good-c-vitamin-c-serum/",
  "ANTI‑POLLUTION DROPS": "https://www.drsturm.com/anti-pollution-drops/",
  "GLOW DROPS": "https://www.drsturm.com/glow-drops/",
  "SUN DROPS SPF 50": "https://www.drsturm.com/sun-drops-us/",
  "LIP BALM": "https://www.drsturm.com/lip-balm/",
  "HYALURONIC FACE MIST": "https://www.drsturm.com/hyaluronic-face-mist/",
  "SKIN SUPER ANTI‑AGING": "https://www.drsturm.com/skin-super-anti-aging/"
};
