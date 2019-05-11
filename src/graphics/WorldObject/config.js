import { m4 } from "../lib/m4";

const config = {
  PropertyList: [
    {
      name: "model_matrix",
      type: "matrix",
      value: m4.identity()
    },
    {
      name: "world_matrix",
      type: "matrix",
      value: m4.identity()
    },
    {
      name: "viewport",
      type: "object",
      value: { x: 0, y: 0, width: 1, height: 1 }
    },
    // ========= Material properties ======== //
    {
      name: "k_ambient",
      type: "float",
      value: 0.1
    },
    {
      name: "k_diffuse",
      type: "float",
      value: 0.7
    },
    {
      name: "k_specular",
      type: "float",
      value: 0.0
    },
    {
      name: "shininess",
      type: "float",
      value: 0.0
    },
    {
      name: "emissive_color",
      type: "vec3",
      value: [0.0, 0.0, 0.0]
    }
  ]
};

export default config;
