import { calculateMil } from "./calculator.js";
import { setupKnob } from "./knob.js";
import { readCalibration, updateHint } from "./calibration.js";

// ----- DOM -----
const output = document.getElementById("output");
const hint = document.getElementById("hint");

const offsetInput = document.getElementById("offset");
const offsetSign = document.getElementById("offsetSign");
const distanceInput = document.getElementById("distance");

const d1Input = document.getElementById("d1");
const mil1Input = document.getElementById("mil1");
const d2Input = document.getElementById("d2");
const mil2Input = document.getElementById("mil2");

const toggleBtn = document.getElementById("toggleCal");
const calibrationContent = document.getElementById("calibrationContent");

const modeToggle = document.getElementById("modeToggle");
const inputMode = document.getElementById("inputMode");
const gearMode = document.getElementById("gearMode");

// Gear elements
const offsetKnob = document.getElementById("offsetKnob");
const offsetValue = document.getElementById("offsetValue");
const distanceKnob = document.getElementById("distanceKnob");
const distanceValue = document.getElementById("distanceValue");

// ----- STATE -----
let uiMode = "input";
let offsetGearValue = 0;
let distanceGearValue = 0;

// ----- CALIBRATION TOGGLE -----
toggleBtn.addEventListener("click", () => {
  calibrationContent.classList.toggle("open");
});

// ----- MODE TOGGLE -----
modeToggle.addEventListener("click", () => {
  uiMode = uiMode === "input" ? "gear" : "input";

  inputMode.classList.toggle("hidden");
  gearMode.classList.toggle("hidden");

  modeToggle.innerText =
    uiMode === "input"
      ? "Switch to Gear Mode"
      : "Switch to Input Mode";

  recalc();
});

// ----- INPUT MODE EVENTS -----
[offsetInput, distanceInput].forEach(input => {
  input.addEventListener("focus", () => input.select());
  input.addEventListener("input", recalc);
});

// ----- CALIBRATION EVENTS -----
[d1Input, mil1Input, d2Input, mil2Input]
  .forEach(input => input.addEventListener("input", recalc));

offsetSign.addEventListener("change", recalc);

// ----- GEAR MODE SETUP -----
function setupGears() {
  const calibration = readCalibration();
  if (!calibration) return;

  const minD = Math.min(calibration.d1, calibration.d2);
  const maxD = Math.max(calibration.d1, calibration.d2);

  setupKnob({
    element: offsetKnob,
    valueElement: offsetValue,
    min: calibration.offsetMin,
    max: calibration.offsetMax,
    step: 1,
    initial: offsetGearValue,
    onChange: v => {
      offsetGearValue = v;
      recalc();
    }
  });

  setupKnob({
    element: distanceKnob,
    valueElement: distanceValue,
    min: minD,
    max: maxD,
    step: 1,
    initial: minD,
    onChange: v => {
      distanceGearValue = v;
      recalc();
    }
  });
}

// ----- MAIN CALC -----
function recalc() {
  const calibration = readCalibration();
  updateHint(hint, calibration);

  output.innerText = "";

  if (!calibration) return;

  const offset =
    uiMode === "input"
      ? getOffset()
      : offsetGearValue;
  const distance =
    uiMode === "input"
      ? parseInt(distanceInput.value)
      : distanceGearValue;

  if (isNaN(distance)) return;

  const result = calculateMil({
    distance,
    offset,
    ...calibration
  });

  if (result === null) return;

  output.innerText =
    `Final MIL: ${result >= 0 ? "+" : ""}${result}`;
}

function getOffset() {
  const isNegative = offsetSign.checked;
  const value = parseInt(offsetInput.value || 0);
  console.log(value);
  return isNegative ? -value : value;
}

// ----- INIT -----
setupGears();
recalc();
