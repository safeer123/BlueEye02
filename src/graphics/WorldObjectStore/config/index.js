import NodeTypes from "../constants/NodeTypes";

import Node from "../../WorldObject/Node";
import WorldObject from "../../WorldObject";
import AbstractCamera from "../AbstractCamera";
import CamThetaPhi from "../CamThetaPhi";
import OneEye from "../OneEye";
import CompositeShapes0 from "../CompositeShapes0";
import AbstractPointLight from "../AbstractPointLight";
import GlowingSphere from "../GlowingSphere";
import TwoEyes from "../TwoEyes";
import GlobalLighting from "./../GlobalLighting";

const TypeNodeMapping = [
  { type: NodeTypes.ABSTRACT_NODE, Class: Node },
  { type: NodeTypes.ABSTRACT_WORLD_OBJECT, Class: WorldObject },
  { type: NodeTypes.CAMERA_ABSTRACT, Class: AbstractCamera },
  { type: NodeTypes.CAMERA_SPHERICAL_PATH, Class: CamThetaPhi },
  { type: NodeTypes.CAMERA_ONE_EYE, Class: OneEye },
  { type: NodeTypes.COMPOSITE_CUSTOM_SHAPES, Class: CompositeShapes0 },
  { type: NodeTypes.ABSTRACT_LIGHT, Class: AbstractPointLight },
  { type: NodeTypes.GLOWING_SPHERE, Class: GlowingSphere },
  { type: NodeTypes.GLOBAL_LIGHTING, Class: GlobalLighting },
  { type: NodeTypes.CAMERA_TWO_EYES, Class: TwoEyes }
];

export { TypeNodeMapping };
