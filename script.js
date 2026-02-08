const offsetInput = document.getElementById("offset");
const offsetSignButton = document.getElementById("offsetSignButton");
const distanceInput = document.getElementById("distance");
const output = document.getElementById("output");
const hint = document.getElementById("hint");

const d1Input = document.getElementById("d1");
const mil1Input = document.getElementById("mil1");
const d2Input = document.getElementById("d2");
const mil2Input = document.getElementById("mil2");

const toggleBtn = document.getElementById("toggleCal");
const calibrationContent = document.getElementById("calibrationContent");

// Toggle calibration
toggleBtn.addEventListener("click", () => {
  calibrationContent.classList.toggle("open");
});

// Auto-select full value on focus
[offsetInput, distanceInput].forEach(input => {
  input.addEventListener("focus", () => input.select());
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

// Sign button event listener
let isNegative = false;
offsetSignButton.addEventListener("click", () => {
  isNegative = !isNegative;
  offsetSignButton.textContent = isNegative ? "-" : "+";
  calculate()
});

// update signed value whenever input changes
offsetInput.addEventListener("input", calculate);

function getOffset() {
  const value = parseInt(offsetInput.value || 0);
  const signed = isNegative ? -value : value;
  return -signed;
}

function calculate() {
  const offset = getOffset();
  const distance = parseInt(distanceInput.value);

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

// 🔹 Initialize UI immediately on load
calculate();
