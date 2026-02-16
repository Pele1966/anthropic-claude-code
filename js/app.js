/* ================================================
   App — entry point, event wiring, orchestration
   ================================================ */

import { $, toast, getSelectedConcerns } from "./helpers.js";
import { computeContext, pickTreatment, pickSerumLayering, pickHomeCare, buildProtocol } from "./engine.js";
import { renderConcernGroups, renderResults } from "./render.js";

// -----------------------------
// Read form values into a profile object
// -----------------------------
function gatherProfile(){
  const age = Math.max(12, Math.min(100, parseInt($("age").value || "18", 10)));
  const sex = $("sex").value;
  const skinTone = $("skinTone").value;
  const skinType = $("skinType").value;
  return { age, sex, skinTone, skinType };
}

// -----------------------------
// Main "Recommend" handler
// -----------------------------
function onRecommend(){
  try{
    const profile = gatherProfile();
    const selected = getSelectedConcerns();
    if (!selected.length){
      toast("Select at least 1 concern", "Pick a concern group (e.g., inflammatory acne, sensitivity, fine lines) so the engine can tailor serum layering and home care.");
      return;
    }

    const ctx = computeContext(profile, selected);
    const treatmentId = pickTreatment(profile, ctx);
    const layering = pickSerumLayering(profile, ctx, treatmentId);
    const protocol = buildProtocol(profile, ctx, treatmentId, layering);
    const home = pickHomeCare(profile, ctx);

    renderResults(profile, selected, treatmentId, protocol, layering, home);

    if (ctx.inflamed){
      toast("Gentle mode", "Inflammation detected → enzyme exfoliation only, minimise friction, avoid traumatic extractions.");
    } else {
      toast("Ready", "Protocol generated. Keep it simple: 1–2 serums. Lifting serum goes after moisturiser only.");
    }

  }catch(err){
    console.error(err);
    toast("Error", "Something broke in the recommendation logic. Open the browser console to view the exact error message.");
  }
}

// -----------------------------
// Reset handler
// -----------------------------
function resetAll(){
  $("age").value = 18;
  $("sex").value = "female";
  $("skinTone").value = "light";
  $("skinType").value = "oily";
  document.querySelectorAll("input[data-concern]").forEach(x => x.checked = false);
  $("output").style.display = "none";
  $("output").innerHTML = "";
  $("emptyState").style.display = "block";
}

// -----------------------------
// Init
// -----------------------------
renderConcernGroups();
$("btnRecommend").addEventListener("click", onRecommend);
$("btnReset").addEventListener("click", resetAll);
