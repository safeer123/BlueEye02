import { PROGRAMS, SHADER_VARS } from "./constants";

const programList = [
  {
    programId: PROGRAMS.COLOR_SHADER_2D,
    vertexShaderId: "shader-vcol2d",
    fragmentShaderId: "shader-fcol2d",
    attribs: [
      { name: SHADER_VARS.a_position, type: "vec2" },
      { name: SHADER_VARS.a_color, type: "vec4" }
    ],
    uniforms: [
      { name: SHADER_VARS.u_matrix, type: "mat3" },
      { name: SHADER_VARS.u_resolution, type: "vec2" },
      { name: SHADER_VARS.u_color, type: "vec4" }
    ]
  },
  {
    programId: PROGRAMS.COLOR_SHADER_3D,
    vertexShaderId: "shader-vcol3d",
    fragmentShaderId: "shader-fcol3d",
    attribs: [
      { name: SHADER_VARS.a_position, type: "vec3" },
      { name: SHADER_VARS.a_color, type: "vec4" }
    ],
    uniforms: [{ name: SHADER_VARS.u_worldViewProjection, type: "mat4" }]
  },
  {
    programId: PROGRAMS.COLOR_LIGHT_SHADER_3D,
    vertexShaderId: "shader-v-light-3d",
    fragmentShaderId: "shader-f-light-3d",
    attribs: [
      { name: SHADER_VARS.a_position, type: "vec3" },
      { name: SHADER_VARS.a_color, type: "vec4" },
      { name: SHADER_VARS.a_normal, type: "vec3" }
    ],
    uniforms: [
      { name: SHADER_VARS.u_worldViewProjection, type: "mat4" },
      { name: SHADER_VARS.u_worldInverseTranspose, type: "mat4" },
      { name: SHADER_VARS.u_reverseLightDirection, type: "vec3" }
    ]
  },
  {
    programId: PROGRAMS.COLOR_MULTI_LIGHT_SHADER_3D,
    vertexShaderId: "shader-v-multilight-3d",
    fragmentShaderId: "shader-f-multilight-3d",
    attribs: [
      { name: SHADER_VARS.a_position, type: "vec3" },
      { name: SHADER_VARS.a_color, type: "vec4" },
      { name: SHADER_VARS.a_normal, type: "vec3" }
    ],
    uniforms: [
      { name: SHADER_VARS.u_viewProjection, type: "mat4" },
      { name: SHADER_VARS.u_worldInverseTranspose, type: "mat4" },
      { name: SHADER_VARS.u_world, type: "mat4" },

      { name: SHADER_VARS.u_sunDirection, type: "vec3" },
      { name: SHADER_VARS.u_sunLightColor, type: "vec3" },

      { name: SHADER_VARS.u_emissiveColor, type: "vec3" },
      { name: SHADER_VARS.u_Ka, type: "float" },
      { name: SHADER_VARS.u_Kd, type: "float" },
      { name: SHADER_VARS.u_Ks, type: "float" },

      { name: SHADER_VARS.u_Lights_0_lightColor, type: "vec3" },
      { name: SHADER_VARS.u_Lights_0_lightPositionInWorld, type: "vec3" },
      { name: SHADER_VARS.u_Lights_1_lightColor, type: "vec3" },
      { name: SHADER_VARS.u_Lights_1_lightPositionInWorld, type: "vec3" },
      { name: SHADER_VARS.u_Lights_2_lightColor, type: "vec3" },
      { name: SHADER_VARS.u_Lights_2_lightPositionInWorld, type: "vec3" }
    ]
  }
];

export default programList;
