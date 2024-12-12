# Kynan Olckers (B00990311)
Incoperated Element04 and Element03 together into one for Element 05
## Menu Scene

- Import Statements
```typescript
import setSceneIndex from "./index";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Camera,
  Engine,
  StandardMaterial,
  Texture,
  Color3,
  CubeTexture,
  Sound
} from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
```
- Creates a text UI element.
```typescript
function createText(scene: Scene, theText: string, x: string, y: string, s: string, c: string, advtex) {
  let text = new GUI.TextBlock();
  text.text = theText;
  text.color = c;
  text.fontSize = s;
  text.fontWeight = "bold"; // Can add a parameter for this if desired
  text.left = x;
  text.top = y;
  advtex.addControl(text);
  return text;
}
```
- Creates a rectangle UI element.
```typescript
function createRectangle(scene: Scene, w: string, h: string, x: string, y: string, cr: number, c: string, t: number, bg: string, advtext) {
  let rectangle = new GUI.Rectangle();
  rectangle.width = w;
  rectangle.height = h;
  rectangle.left = x;
  rectangle.top = y;
  rectangle.cornerRadius = cr;
  rectangle.color = c;
  rectangle.thickness = t;
  rectangle.background = bg;
  advtext.addControl(rectangle);
  return rectangle;
}

```
- Creates a button UI element to switch scenes.
```typescript
function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
  let button = GUI.Button.CreateSimpleButton(name, index);
  button.left = x;
  button.top = y;
  button.width = "160px";
  button.height = "60px";
  button.color = "white";
  button.cornerRadius = 20;
  button.background = "green";

  const buttonClick = new Sound("MenuClickSFX", "./assets/audio/menu-click.wav", scene, null, {
    loop: false,
    autoplay: false,
  });

  button.onPointerUpObservable.add(function() {
    console.log("THE BUTTON HAS BEEN CLICKED");
    buttonClick.play();
    setSceneIndex(1);
  });
  advtex.addControl(button);
  return button;
}

```
- Defines the main menu scene.
```typescript
export default function menuScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    advancedTexture: GUI.AdvancedDynamicTexture;
    textBG: GUI.Rectangle;
    titleText: GUI.TextBlock;
    button1: GUI.Button;
    button2: GUI.Button;
    skybox: Mesh;
    hemiLight: HemisphericLight;
    camera: Camera;
  }

  let scene = new Scene(engine);
  let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
  let textBG = createRectangle(scene, "300px", "100px", "0px", "-200px", 20, "white", 4, "purple", advancedTexture);
  let titleText = createText(scene, "THE GAME", "0px", "-200px", "45", "white", advancedTexture);
  let button1 = createSceneButton(scene, "but1", "Game Scene 1", "0px", "-75px", advancedTexture);
  button1.onPointerUpObservable.add(() => {
    setSceneIndex(1); // Switch to game scene
  });

  let button2 = createSceneButton(scene, "but2", "Game Scene 2", "0px", "0px", advancedTexture);
  button2.onPointerUpObservable.add(() => {
    setSceneIndex(2); // Switch to game scene 1
  });

  let skybox = createSkybox(scene);
  let hemiLight = createHemiLight(scene);
  let camera = createArcRotateCamera(scene);

  let that: SceneData = {
    scene,
    advancedTexture,
    textBG,
    titleText,
    button1,
    button2,
    skybox,
    hemiLight,
    camera
  };

  return that;
}
```
## Game Scene 1

## Description
This script utilizes the Babylon.js framework to create an immersive 3D scene. It includes terrain, music, ground, a skybox, lighting, houses, trees, and lamps. The script demonstrates various Babylon.js features such as materials, meshes, instances, sprites, and sound.

---
- Import Statements
```typescript
import { SceneData } from "./interfaces";
import * as GUI from "@babylonjs/gui";
import setSceneIndex from "./index";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  HemisphericLight,
  Color3,
  Engine,
  Texture,
  SceneLoader,
  AbstractMesh,
  ISceneLoaderAsyncResult,
  Sound,
  CubeTexture,
  Nullable,
  Vector4,
  InstancedMesh,
  SpriteManager,
  Sprite,
  SpotLight,
} from "@babylonjs/core";
import createRunScene from "./createRunScene";
```
- Music
```typescript
function backgroundMusic(scene: Scene): Sound {
  const music = new Sound("music", "./assets/audio/05audio.mp3", scene, null, { loop: true, autoplay: true });
  Engine.audioEngine!.useCustomUnlockedButton = true;

  window.addEventListener('click', () => {
    if (!Engine.audioEngine!.unlocked) {
      Engine.audioEngine!.unlock();
    }
  }, { once: true });

  return music;
}

```
- Ground Creation
```typescript
function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new Texture("./assets/environments/villagegreen.png");
  groundMaterial.diffuseTexture.hasAlpha = true;
  groundMaterial.backFaceCulling = false;

  const ground = MeshBuilder.CreateGround("ground", { width: 24, height: 24 }, scene);
  ground.material = groundMaterial;
  ground.position.y = 0.01;

  return ground;
}

```
- Skybox Creation
```typescript
function createSky(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);

  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture("./assets/textures/skybox1/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  return skybox;
}

```
- Hemispheric Light
```typescript
function createHemisphericLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(2, 1, 0), scene);
  light.intensity = 0.1;
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 0.8, 0.8);
  light.groundColor = new Color3(0, 0.2, 0.7);

  return light;
}

```
- Terrain Creation
```typescript
function createHouses(scene: Scene, style: number) {
  // Create various styles of houses and arrange them in the scene from element 03.
}
```
- Trees Creation
```typescript
function createTrees(scene: Scene) {
  const spriteManagerTrees = new SpriteManager("treesManager", "./assets/sprites/tree.png", 2000, { width: 512, height: 1024 }, scene);

  for (let i = 0; i < 500; i++) {
    const tree: Sprite = new Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.2;
  }
}
```
- Box Creation
```typescript
function createBox(style: number) {
  //style 1 small style 2 semi detatched
  const boxMat = new StandardMaterial("boxMat");
  const faceUV: Vector4[] = []; // faces for small house
  if (style == 1) {
    boxMat.diffuseTexture = new Texture("./assets/textures/cubehouse.png");
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    // faceUV[4] would be for bottom but not used
    // faceUV[5] would be for top but not used
  } else {
    boxMat.diffuseTexture = new Texture("./assets/textures/semihouse.png");
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    // faceUV[4] would be for bottom but not used
    // faceUV[5] would be for top but not used
  }
  
  const box = MeshBuilder.CreateBox("box", {
    width: style,
    height: 1,
    faceUV: faceUV,
    wrap: true,
  });
  box.position = new Vector3(0, 0.5, 0);
  box.scaling = new Vector3(1, 1, 1);
  box.material = boxMat;
  return box;
}
```
- Lamps
```typescript
function createLamps(scene: Scene) {
  SceneLoader.ImportMeshAsync("", "./assets/models/lamp/", "lamp.babylon", scene).then((result) => {
    const lamp = scene.getMeshByName("lamp") as Mesh | null;
    const bulb = scene.getMeshByName("bulb");

    if (!lamp || !bulb) return;

    const lampLight = new SpotLight("lampLight", Vector3.Zero(), new Vector3(0, -1, 0), 0.8 * Math.PI, 0.01, scene);
    lampLight.diffuse = Color3.Yellow();
    lampLight.parent = bulb;

    lamp.position = new Vector3(2, 0, 2);
    lamp.rotation.y = -Math.PI / 4;

    // Cloned lamps
    const lamp1 = lamp.clone("lamp1");
    lamp1.position.x = -8;
    lamp1.rotation.y = Math.PI / 2;

    const lamp2 = lamp1.clone("lamp2");
    lamp2.position.x = -2.7;

    const lamp3 = lamp.clone("lamp3");
    lamp3.position.z = -8;
  });
}
```
- Import player and animations
```typescript
function importMeshA(scene: Scene, x: number, y: number) {
  let item: Promise<void | ISceneLoaderAsyncResult> =
    SceneLoader.ImportMeshAsync(
      "",
      "./assets/models/men/",
      "dummy3.babylon",
      scene
    );

  item.then((result) => {
    let character: AbstractMesh = result!.meshes[0];
    character.position.x = x;
    character.position.y = y + 0.1;
    character.scaling = new Vector3(1, 1, 1);
    character.rotation = new Vector3(0, 0, 0);

  });
  return item;
}
```
- Creates a button to go back to main menu scene
```typescript
function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
  let button = GUI.Button.CreateSimpleButton(name, index);
  button.left = x;
  button.top = y;
  button.width = "160px";
  button.height = "60px";
  button.color = "white";
  button.cornerRadius = 10;
  button.background = "blue";
  advtex.addControl(button);
  return button;
}
```
- Defines the game scene 1.
```typescript
export default function gameScene(engine: Engine) {
  let scene = new Scene(engine);
  let audio = backgroundMusic(scene);
  createHemisphericLight(scene);
  let sky = createSky(scene);
  createHouses(scene, 3);
  createTrees(scene);
  createTerrain(scene);
  createLamps(scene);
  let camera = createArcRotateCamera(scene);
  let box1 = createBox1(scene);
  let box2 = createBox2(scene);
  let player = importMeshA(scene, 0, 0);
  let ground = createGround(scene);
  let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("gameSceneUI", true);
  let button = createSceneButton(scene, "but1", "Back", "0px", "100px", advancedTexture);
  button.onPointerUpObservable.add(() => {
    setSceneIndex(0); // Switch to gamescene
  });
  
  let that: SceneData = {
    scene,
    audio,
    sky,
    camera,
    box1,
    box2,
    player,
    ground,
  };

  createRunScene(that);
  return that;
}
```

## Game Scene 2

## Description
This script sets up a game scene using Babylon.js, implementing various features such as lighting, a skybox, a camera, and other interactive elements.

---
- Import Statements
```typescript
import { SceneData } from "./interfaces";
import * as GUI from "@babylonjs/gui";
import setSceneIndex from "./index";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  ParticleSystem,
  Color3,
  SpotLight,
  Engine,
  Texture,
  SceneLoader,
  AbstractMesh,
  ISceneLoaderAsyncResult,
  Sound,
  CubeTexture,
  DirectionalLight,
} from "@babylonjs/core";
import createRunScene from "./createRunScene";
```
- Music
```typescript
function backgroundMusic(scene: Scene): Sound {
  let music = new Sound("music", "./assets/audio/06audio.mp3", scene, null, {
    loop: true,
    autoplay: true,
  });

  Engine.audioEngine!.useCustomUnlockedButton = true;
  window.addEventListener('click', () => {
    if (!Engine.audioEngine!.unlocked) {
      Engine.audioEngine!.unlock();
    }
  }, { once: true });
  return music;
}
```
- Lighting with included spotlights of different colours
```typescript
function createDirectionalLight(scene: Scene) {
  const light = new DirectionalLight("light", new Vector3(0.2, -1, 0.2), scene);
  light.position = new Vector3(20, 40, 20);
  light.intensity = 0.7;
  return light;
}

function createSpotLight(scene: Scene) {
  const light = new SpotLight("spotLight", new Vector3(-Math.cos(Math.PI / 6), 7, -Math.sin(Math.PI / 6)), new Vector3(0, -1, 0), Math.PI / 4, 1.5, scene);
  light.diffuse = new Color3(1, 0, 0);

  const light1 = new SpotLight("spotLight1", new Vector3(0, 7, 1 - Math.sin(Math.PI / 6)), new Vector3(0, -1, 0), Math.PI / 4, 1.5, scene);
  light1.diffuse = new Color3(0, 1, 0);

  const light2 = new SpotLight("spotLight2", new Vector3(Math.cos(Math.PI / 6), 7, -Math.sin(Math.PI / 6)), new Vector3(0, -1, 0), Math.PI / 4, 1.5, scene);
  light2.diffuse = new Color3(0, 0, 1);
}
```
- Ground and Sky
```typescript
function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new Texture("./assets/textures/ground.jpg");
  const ground = MeshBuilder.CreateGround("ground", { width: 24, height: 24 }, scene);
  ground.material = groundMaterial;
  return ground;
}

function createSky(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.reflectionTexture = new CubeTexture("./assets/textures/skybox/industrialSky.env", scene);
  skybox.material = skyboxMaterial;
  return skybox;
}
```
- Boxes and player
```typescript
function createGround(scene: Scene) 
    // create boxes like scene 1

function importMeshA(scene: Scene, x: number, y: number) 
  //Import mesh like scene 1
```
- Simple particle creation
```typescript
function createParticles(scene: Scene){
  const particleSystem = new ParticleSystem("particles", 2000, scene);
  particleSystem.particleTexture = new Texture("./assets/textures/flare.png");
  particleSystem.start();
}
```
- Create button to go back to menu scene
```typescript
function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
  let button = GUI.Button.CreateSimpleButton(name, index);
  button.left = x;
  button.top = y;
  button.width = "160px";
  button.height = "60px";
  button.color = "white";
  button.cornerRadius = 10;
  button.background = "blue";
  advtex.addControl(button);
  return button;
}

```
- Defines game scene 2
```typescript
export default function gameScene1(engine: Engine) {
  let scene = new Scene(engine);
  let audio = backgroundMusic(scene);
  let sky = createSky(scene);
  createSpotLight(scene);
  createParticles(scene);
  createDirectionalLight(scene);
  let camera = createArcRotateCamera(scene);
  let box1 = createBox1(scene);
  let box2 = createBox2(scene);
  let player = importMeshA(scene, 0, 0);
  let ground = createGround(scene);
  let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("gameSceneUI", true);
  let button = createSceneButton(scene, "but1", "Back", "0", "100", advancedTexture);
  button.onPointerUpObservable.add(() => {
    setSceneIndex(0); // Switch to gamescene
  });
  
  let that: SceneData = { 
    scene,
    audio,
    sky,
    camera,
    box1,
    box2,
    player,
    ground,
  };

  createRunScene(that);
  return that;
}
```