export function setupKnob({
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
  let lastAngle = 0;
  let accumulatedRotation = 0;

  const range = max - min;
  const degreesPerStep = 8; // tuning knob sensitivity
  const radiansPerStep = degreesPerStep * Math.PI / 180;

  function getAngle(e) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx);
  }

  function normalizeDelta(delta) {
    if (delta > Math.PI) return delta - 2 * Math.PI;
    if (delta < -Math.PI) return delta + 2 * Math.PI;
    return delta;
  }

  element.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastAngle = getAngle(e);
    element.setPointerCapture(e.pointerId);
  });

  element.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const angle = getAngle(e);
    let delta = angle - lastAngle;
    delta = normalizeDelta(delta);

    accumulatedRotation += delta;
    lastAngle = angle;

    const stepsMoved = Math.round(accumulatedRotation / radiansPerStep);

    if (stepsMoved !== 0) {
      accumulatedRotation -= stepsMoved * radiansPerStep;

      let newValue = value + stepsMoved * step;
      newValue = Math.max(min, Math.min(max, newValue));

      if (newValue !== value) {
        value = newValue;
        updateUI();
        onChange(value);
      }
    }
  });

  element.addEventListener("pointerup", () => {
    dragging = false;
  });

  element.addEventListener("pointercancel", () => {
    dragging = false;
  });

  function updateUI() {
    valueElement.innerText = value;

    const rotation =
      ((value - min) / range) * 270 - 135; // -135° → +135°
    element.style.transform = `rotate(${rotation}deg)`;
    valueElement.style.transform = `translate(-50%, -50%) rotate(${-rotation}deg)`;
  }

  // Init
  updateUI();
  onChange(value);
}
