import{a1 as o}from"./index-92c2138d.js";import"./helperFunctions-a4313727.js";const e="rgbdEncodePixelShader",r=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;o.ShadersStore[e]=r;const d={name:e,shader:r};export{d as rgbdEncodePixelShader};