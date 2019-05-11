const SHADER_VARS = {
  a_position: "a_position",
  a_color: "a_color",
  a_texCoord: "a_texCoord",
  a_normal: "a_normal",

  u_color: "u_color",
  u_worldViewProjection: "u_worldViewProjection",
  u_worldInverseTranspose: "u_worldInverseTranspose",
  u_matrix: "u_matrix",
  u_resolution: "u_resolution",
  u_reverseLightDirection: "u_reverseLightDirection",
  u_world: "u_world",
  u_viewProjection: "u_viewProjection",

  // specific to multi-lights shader
  u_Lights_0_lightColor: "u_Lights[0].lightColor",
  u_Lights_0_lightPositionInWorld: "u_Lights[0].lightPositionInWorld",
  u_Lights_1_lightColor: "u_Lights[1].lightColor",
  u_Lights_1_lightPositionInWorld: "u_Lights[1].lightPositionInWorld",
  u_Lights_2_lightColor: "u_Lights[2].lightColor",
  u_Lights_2_lightPositionInWorld: "u_Lights[2].lightPositionInWorld",
  u_LightColor: index => `u_Lights[${index}].lightColor`,
  u_LightPosition: index => `u_Lights[${index}].lightPositionInWorld`,

  // sun related properties
  u_sunDirection: "u_sunDirection",
  u_sunLightColor: "u_sunLightColor",

  // material properties
  u_emissiveColor: "u_emissiveColor",
  u_Ka: "u_Ka",
  u_Kd: "u_Kd",
  u_Ks: "u_Ks"
};

const PROGRAMS = {
  COLOR_SHADER_2D: 0,
  TEXTURE_SHADER_2D: 1,
  COLOR_SHADER_3D: 2,
  COLOR_LIGHT_SHADER_3D: 3,
  COLOR_MULTI_LIGHT_SHADER_3D: 4
};

export { PROGRAMS, SHADER_VARS };
