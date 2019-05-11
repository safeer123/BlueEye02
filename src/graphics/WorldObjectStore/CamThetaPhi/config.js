import { m4 } from "../../lib/m4";

const config = {
  PropertyList: [
    {
      name: "theta",
      type: "float",
      value: Math.PI / 3,
      min: 0,
      max: Math.PI
    },
    {
      name: "phi",
      type: "float",
      value: 0,
      min: 0,
      max: 2 * Math.PI
    },
    {
      name: "radius",
      type: "float",
      value: 45,
      min: 1,
      max: 200
    }
  ]
};

export default config;
