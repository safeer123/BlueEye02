import { PROGRAMS, SHADER_VARS } from "../../ShaderFactory/constants";

const attribPtrDetails = [
  {
    attribName: SHADER_VARS.a_position,
    size: 2, // no of typed data per vertex
    type: WebGLRenderingContext.FLOAT,
    normalize: false, // whether to normalize to fall in 0-1
    stride: 24, // bytes to skip, sumAll(size*sizeof(type))
    offset: 0 // offset from the beginning in bytes
  },
  {
    attribName: SHADER_VARS.a_color,
    size: 4, // no of typed data per vertex
    type: WebGLRenderingContext.FLOAT,
    normalize: false,
    stride: 24, // bytes to skip, sumAll(size*sizeof(type))
    offset: 8 // offset from the beginning in bytes
  }
];

const config = {
  programId: PROGRAMS.COLOR_SHADER_2D,
  bufferDetails: {
    triangleBfrPtrConfig: attribPtrDetails,
    lineBfrPtrConfig: attribPtrDetails
  },
  enableDepthTest: true,
  enableCulling: false
};

export default config;
