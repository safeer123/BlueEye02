const config = {
  dayColor: [0.3, 0.1, 0.1],
  nightColor: [0.0, 0.0, 0.0],

  PropertyList: [
    {
      name: "sun_direction",
      type: "vec3",
      value: [-2, 1, -1]
    },
    {
      name: "sun_light_color",
      type: "vec3",
      value: [0.0, 0.0, 0.0]
    },
    {
      name: "isDay",
      type: "bool",
      value: false
    },
    {
      name: "theta",
      type: "float",
      value: 0
    }
  ]
};

export default config;
