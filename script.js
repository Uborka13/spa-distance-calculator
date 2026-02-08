const offsetInput = document.getElementById("offset");
const distanceInput = document.getElementById("distance");
const output = document.getElementById("output");
const hint = document.getElementById("hint");

const d1Input = document.getElementById("d1");
const mil1Input = document.getElementById("mil1");
const d2Input = document.getElementById("d2");
const mil2Input = document.getElementById("mil2");

const toggleBtn = document.getElementById("toggleCal");
const calibrationContent = document.getElementById("calibrationContent");

const modeToggle = document.getElementById("modeToggle");
const inputMode = document.getElementById("inputMode");
const sliderMode = document.getElementById("sliderMode");

const offsetSlider = document.getElementById("offsetSlider");
const distanceSlider = document.getElementById("distanceSlider");
const offsetValue = document.getElementById("offsetValue");
const distanceValue = document.getElementById("distanceValue");

const offsetMinInput = document.getElementById("offsetMin");
const offsetMaxInput = document.getElementById("offsetMax");

let uiMode = "input";

// Toggle calibration
toggleBtn.addEventListener("click", () => {
  calibrationContent.classList.toggle("open");
});

// Auto-select full value on focus
[offsetInput, distanceInput].forEach(input => {
  input.addEventListener("focus", () => input.select());
});

modeToggle.addEventListener("click", () => {
  uiMode = uiMode === "input" ? "slider" : "input";

  inputMode.classList.toggle("hidden");
  sliderMode.classList.toggle("hidden");

  modeToggle.innerText =
    uiMode === "input"
      ? "Switch to Slider Mode"
      : "Switch to Input Mode";

  syncSliderRanges();
  calculate();
});

[offsetSlider, distanceSlider].forEach(slider => {
  slider.addEventListener("input", () => {
    offsetValue.innerText = offsetSlider.value;
    distanceValue.innerText = distanceSlider.value;
    calculate();
  });
});

// Auto-calculate on any relevant input
[
  offsetInput,
  distanceInput,
  d1Input,
  mil1Input,
  d2Input,
  mil2Input
].forEach(input => input.addEventListener("input", calculate));

function calculate() {
  const offset =
    uiMode === "input"
      ? parseInt(offsetInput.value) || 0
      : offsetGearValue;

  const distance =
    uiMode === "input"
      ? parseInt(distanceInput.value)
      : distanceGearValue;


  const d1 = parseFloat(d1Input.value);
  const mil1 = parseFloat(mil1Input.value);
  const d2 = parseFloat(d2Input.value);
  const mil2 = parseFloat(mil2Input.value);

  // ---- Always show calibration hint ----
  if (!isNaN(d1) && !isNaN(d2) && d1 !== d2) {
    const minD = Math.min(d1, d2);
    const maxD = Math.max(d1, d2);
    hint.innerText = `Calibration range: ${minD}–${maxD} m`;
  } else {
    hint.innerText = "Calibration range: —";
  }

  // Clear output by default (no dash, no placeholder)
  output.innerText = "Final MIL: -";

  // ---- Validation ----
  if (
    isNaN(distance) ||
    [d1, mil1, d2, mil2].some(isNaN) ||
    d1 === d2
  ) {
    return;
  }

  const minD = Math.min(d1, d2);
  const maxD = Math.max(d1, d2);

  // Outside calibration → no result
  if (distance < minD || distance > maxD) {
    return;
  }

  // ---- Calculation ----
  const mil =
    mil1 + (mil2 - mil1) * ((distance - d1) / (d2 - d1));

  const result = Math.round(mil) + offset;

  output.innerText = `Final MIL: ${result}`;
}

function syncSliderRanges() {
  const d1 = parseFloat(d1Input.value);
  const d2 = parseFloat(d2Input.value);

  if (!isNaN(d1) && !isNaN(d2)) {
    distanceSlider.min = Math.min(d1, d2);
    distanceSlider.max = Math.max(d1, d2);
  }

  offsetSlider.min = parseInt(offsetMinInput.value);
  offsetSlider.max = parseInt(offsetMaxInput.value);
}

function setupKnob({
  element,
  valueElement,
  min,
  max,
  step,
  initial,
  onChange
}) {
  let value = initial;
  let dragging = false;
  let startAngle = 0;
  let startValue = 0;

  function angleFromCenter(e) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx);
  }

  element.addEventListener("pointerdown", (e) => {
    dragging = true;
    startAngle = angleFromCenter(e);
    startValue = value;
    element.setPointerCapture(e.pointerId);
  });

  element.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const angle = angleFromCenter(e);
    const delta = angle - startAngle;

    // Sensitivity tuning
    const deltaValue = Math.round(delta * 20);

    let newValue = startValue + deltaValue * step;
    newValue = Math.max(min, Math.min(max, newValue));

    if (newValue !== value) {
      value = newValue;
      valueElement.innerText = value;
      onChange(value);
    }
  });

  element.addEventListener("pointerup", () => {
    dragging = false;
  });

  // Init
  valueElement.innerText = value;
  onChange(value);
}

let offsetGearValue = 0;
let distanceGearValue = 0;

setupKnob({
  element: document.getElementById("offsetKnob"),
  valueElement: document.getElementById("offsetValue"),
  min: -30,
  max: 30,
  step: 1,
  initial: 0,
  onChange: (v) => {
    offsetGearValue = v;
    calculate();
  }
});

setupKnob({
  element: document.getElementById("distanceKnob"),
  valueElement: document.getElementById("distanceValue"),
  min: Math.min(
    parseInt(d1Input.value),
    parseInt(d2Input.value)
  ),
  max: Math.max(
    parseInt(d1Input.value),
    parseInt(d2Input.value)
  ),
  step: 1,
  initial: Math.min(
    parseInt(d1Input.value),
    parseInt(d2Input.value)
  ),
  onChange: (v) => {
    distanceGearValue = v;
    calculate();
  }
});


// 🔹 Initialize UI immediately on load
syncSliderRanges();
calculate();
