import { subtractVectors, cross, normalize } from "../../lib/m4";

// p: list of 3 vec3
const surfaceNormal = p => {
  const a = subtractVectors(p[0], p[1]);
  const b = subtractVectors(p[2], p[1]);
  return normalize(cross(a, b));
};

export { surfaceNormal };
