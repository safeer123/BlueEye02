const config = {
  PropertyList: [
    {
      name: "position",
      type: "vec3",
      value: [0, 0, 40]
    },
    {
      name: "target_position",
      type: "vec3",
      value: [0, 0, 0]
    },
    {
      name: "target_direction",
      type: "vec3",
      value: [0, 0, 0]
    },
    {
      name: "relative_target_position",
      type: "vec3",
      value: [0, 0, 1]
    },
    {
      name: "up_vector",
      type: "vec3",
      value: [0, 1, 0]
    },
    {
      name: "theta",
      type: "float",
      value: Math.PI / 2,
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
    },
    {
      name: "base_phi",
      type: "float",
      value: 1.5 * Math.PI
    },
    {
      name: "base_theta",
      type: "float",
      value: 0.5 * Math.PI
    },
    {
      name: "relative_phi",
      type: "float",
      value: 0
    },
    {
      name: "relative_theta",
      type: "float",
      value: 0
    },
    {
      name: "omega",
      type: "float",
      value: 0
    }
  ]
};

export default config;
