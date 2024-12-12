import{a1 as a}from"./index-92c2138d.js";const e="passPixelShader",r=`varying vec2 vUV;uniform sampler2D textureSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);}`;a.ShadersStore[e]=r;const t={name:e,shader:r};export{t as passPixelShader};
