export function readCalibration() {
  const offsetMin = parseFloat(document.getElementById("offsetMin").value)
  const offsetMax = parseFloat(document.getElementById("offsetMax").value)
  const d1 = parseFloat(document.getElementById("d1").value);
  const mil1 = parseFloat(document.getElementById("mil1").value);
  const d2 = parseFloat(document.getElementById("d2").value);
  const mil2 = parseFloat(document.getElementById("mil2").value);

  if ([d1, mil1, d2, mil2].some(isNaN)) return null;

  return { offsetMin, offsetMax, d1, mil1, d2, mil2 };
}

export function updateHint(hintElement, calibration) {
  if (!calibration) {
    hintElement.innerText = "Calibration range: —";
    return;
  }

  const minD = Math.min(calibration.d1, calibration.d2);
  const maxD = Math.max(calibration.d1, calibration.d2);

  hintElement.innerText = `Calibration range: ${minD}–${maxD} m`;
}

export function getCalibrationRange(calibration) {
  if (!calibration) return null;

  return {
    minDistance: Math.min(calibration.d1, calibration.d2),
    maxDistance: Math.max(calibration.d1, calibration.d2)
  };
}
