import { m4, Matrix4 } from "../lib/m4";
import { SHADER_VARS } from "../ShaderFactory/constants";
import Node from "./Node";
import config from "./config";
import NodeTypes from "./constants";
import ObjectRenderer from "./../lib/ObjectRenderer";

export default class WorldObject extends Node {
  constructor(inObj, configList = []) {
    super();
    this.setType(NodeTypes.ABSTRACT_WORLD_OBJECT);

    const { gl, programs, renderConfig } = inObj;

    // (*) ObjectRenderer is created only when there is a valid renderConfig
    if (renderConfig) {
      this.objRenderer = new ObjectRenderer(gl, programs, renderConfig);
    }

    // We combine self configuration with inherited configuration
    // Each one is a configObject having PropertyList/InitList of its own
    this.completeConfigList = [config, ...configList];
    this.completeConfigList.forEach(cnf => {
      // Apply each config object
      if (cnf.PropertyList) this.defineProperties(cnf.PropertyList);
      if (cnf.InitList) this.initProperties(cnf.InitList);
    });

    // default getters
    this.setPropertyGetter("model_matrix", () => this.model().matrix());

    this.setPropertyGetter("world_matrix", () => {
      // world_matrix = parent_world_matrix * model_matrix;
      let worldMatrix = this.getProperty("model_matrix");
      if (this.parentProperties.world_matrix) {
        worldMatrix = m4.multiply(
          this.parentProperties.world_matrix,
          worldMatrix
        );
      }
      // Pass this matrix down to its children
      this.children.forEach(childNode =>
        childNode.setParentProperties({ world_matrix: worldMatrix })
      );
      return worldMatrix;
    });

    this.setPropertyGetter("viewport", () => this.getValue("viewport"));

    this.createObjects(this.defineGeometry());
  }

  createObjects(objList) {
    const { objRenderer } = this;
    if (objRenderer) {
      objRenderer.clearObjects();
      objRenderer.addObjects(objList);
      objRenderer.createBuffers();

      objRenderer.setUniformGetter(SHADER_VARS.u_world, () => {
        const worldMatrix = this.getProperty("world_matrix");
        return worldMatrix;
      });

      // TODO: Remove this if not needed anymore
      objRenderer.setUniformGetter(SHADER_VARS.u_worldViewProjection, () => {
        const projectionViewMatrix = this.getProperty("projection_view_matrix");
        const worldMatrix = this.getProperty("world_matrix");
        const matrix = m4.multiply(projectionViewMatrix, worldMatrix);
        return matrix;
      });

      objRenderer.setUniformGetter(SHADER_VARS.u_worldInverseTranspose, () => {
        const worldMatrix = this.getProperty("world_matrix");
        const matrix = m4.inverseTranspose(worldMatrix);
        return matrix;
      });

      objRenderer.setUniformGetter(SHADER_VARS.u_reverseLightDirection, () => {
        const vec3 = [1, 1, 1];
        return vec3;
      });

      objRenderer.setUniformGetter(SHADER_VARS.u_emissiveColor, () =>
        this.getProperty("emissive_color")
      );

      objRenderer.setUniformGetter(SHADER_VARS.u_Ka, () =>
        this.getValue("k_ambient")
      );

      objRenderer.setUniformGetter(SHADER_VARS.u_Kd, () =>
        this.getValue("k_diffuse")
      );

      objRenderer.setUniformGetter(SHADER_VARS.u_Ks, () =>
        this.getProperty("k_specular")
      );

      // For 2D
      objRenderer.setUniformGetter(SHADER_VARS.u_resolution, () => {
        const { width, height } = objRenderer.gl.canvas;
        return [width, height];
      });

      objRenderer.setUniformGetter(SHADER_VARS.u_matrix, () => [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    }
  }

  computeScene(sceneConfig) {
    this.sceneManager = sceneConfig;

    if (this.rebuildProperties) {
      Object.keys(this.propertyBucket).forEach(p => this.getProperty(p));
      this.rebuildProperties = false;
    }

    // repeate down the hierarchy
    this.children.forEach(childNode => {
      childNode.computeScene(sceneConfig);
    });
  }

  render() {
    if (this.objRenderer) {
      // Todo: do this only once when we keep a unique sceneManager
      // check sceneManager has changed, only then do this
      // (eventually this will go inside sceneManager class)
      if (this.sceneManager) {
        this.sceneManager.sceneSetters.forEach(sceneSetter => {
          sceneSetter.setupScene(this.objRenderer);
        });
        const { viewport } = this.sceneManager;
        this.objRenderer.render(viewport);
      }
    }

    // Render all children
    this.children.forEach(childNode => childNode.render());
  }

  model() {
    if (!this.modelMatrix)
      this.modelMatrix = new Matrix4(() => {
        this.rebuildProperties = true;
        this.trySceneUpdate();
      });
    return this.modelMatrix;
  }

  // override this method to add geometry
  defineGeometry() {
    // return a list of geometry objects to render
    return [];
  }

  addControls(controlList, enabled) {
    if (!this.controlObject) {
      this.controlObject = {
        enabled: true,
        controls: []
      };
    }

    this.controlObject.controls = [
      ...this.controlObject.controls,
      ...controlList
    ];

    if (typeof enabled !== "undefined") {
      this.controlObject.enabled = enabled;
    }
  }

  // By default controlObject is undefined
  // Derived WOs should define create this object
  getUserControls() {
    return this.controlObject;
  }
}
