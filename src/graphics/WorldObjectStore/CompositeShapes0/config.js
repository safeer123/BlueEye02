const config = {
  lightColor: [1.0, 1.0, 1.0],

  PropertyList: [
    {
      name: "phi",
      type: "float",
      value: 0,
      min: 0,
      max: 2 * Math.PI
    },
    {
      name: "theta",
      type: "float",
      value: 0,
      min: 0,
      max: 2 * Math.PI
    }
  ],

  InitList: [
    {
      name: "k_diffuse",
      value: 0.9
    },
    {
      name: "k_ambient",
      value: 0.1
    },
    {
      name: "emissive_color",
      value: [0.0, 0.0, 0.0]
    }
  ]
};

export default config;
