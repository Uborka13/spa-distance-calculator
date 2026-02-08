export function calculateMil({
  distance,
  offset,
  d1,
  mil1,
  d2,
  mil2
}) {
  if (d1 === d2) return null;

  const minD = Math.min(d1, d2);
  const maxD = Math.max(d1, d2);

  if (distance < minD || distance > maxD) return null;

  const mil =
    mil1 + (mil2 - mil1) * ((distance - d1) / (d2 - d1));

  return Math.round(mil) + offset;
}
