import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import { RectAreaLightUniformsLib } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/RectAreaLightHelper.js';
import { VRButton } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/webxr/VRButton.js';			

var stats;
var aspect = window.innerWidth / window.innerHeight;
var camera;
camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var camGroup = new THREE.Object3D();
camGroup.add(camera);
//camera.position.z = 6.5;
//camera.position.y = 0;

camGroup.position.z = 6.5;
camGroup.position.y = 0;

var renderer;
renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize( window.innerWidth, window.innerHeight);
document.getElementById( "persp" ).appendChild( renderer.domElement );

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

var controlsP = new OrbitControls( camera, renderer.domElement );
var controlSpeed = 0.2;

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x446688 );

var lightpos = new THREE.Vector3(0,2,0);
const color = 0xFFFFFF;
const intensity = 1;
var curLight;

//Ambient light
var alight = new THREE.AmbientLight(color, intensity/5);
scene.add(alight);

//Point light
const plight = new THREE.PointLight(color, intensity/2,0,roomlen/2-0.5);
plight.position.set(0,2,0);
plight.castShadow = true;
scene.add(plight);
curLight = plight;
/*
const light1 = new THREE.PointLight( 0xffffff, 1, 0 );
			light1.position.set( 0, 200, 0 );
			scene.add( light1 );

			const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
			light2.position.set( 100, 200, 100 );
			scene.add( light2 );

			const light3 = new THREE.PointLight( 0xffffff, 1, 0 );
			light3.position.set( - 100, - 200, - 100 );
			scene.add( light3 );
*/

//Room Setup
var whitewall = new THREE.MeshPhysicalMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
var greenwall = new THREE.MeshPhysicalMaterial( { color: 0x00bb00, side: THREE.DoubleSide } );
var redwall = new THREE.MeshPhysicalMaterial( { color: 0xbb0000, side: THREE.DoubleSide } );
var materialTransparent =  new THREE.MeshBasicMaterial( { transparent: true, opacity: 0, wireframe: false, side: THREE.DoubleSide} );
var materials = [ greenwall, redwall, whitewall, whitewall, materialTransparent, whitewall ];

var roomlen = 5;

var geometry = new THREE.BoxBufferGeometry( roomlen, roomlen, roomlen );

var mesh = new THREE.Mesh( geometry, materials );
mesh.receiveShadow = true;
scene.add( mesh );

RectAreaLightUniformsLib.init();

const greenWallLight = new THREE.RectAreaLight( 0x00bb00, 1, 5, 5 );
greenWallLight.position.set( 2.51, 0, 0 );
greenWallLight.rotation.y = THREE.Math.degToRad(90);
scene.add( greenWallLight );

const redWallLight = new THREE.RectAreaLight( 0xbb0000, 1, 5, 5 );
redWallLight.position.set( -2.51, 0, 0 );
redWallLight.rotation.y = THREE.Math.degToRad(-90);
scene.add( redWallLight );


const whiteWallLight = new THREE.RectAreaLight( 0xffffff, 1, 5, 5 );
whiteWallLight.position.set( 0, 0, -2.51 );
whiteWallLight.rotation.x = THREE.Math.degToRad(180);
scene.add( whiteWallLight );

/*const whiteRoofLight = new THREE.RectAreaLight( 0xffffff, 1, 5, 5 );
whiteRoofLight.position.set( 0, 2.51, 0 );
whiteRoofLight.rotation.x = THREE.Math.degToRad(-90);
scene.add( whiteRoofLight );
*/


//const rectLightHelper = new RectAreaLightHelper( whiteWallLight );
//whiteWallLight.add( rectLightHelper );

//Objects
var objlen = 2;
var objrad = 1;
var objseg = 500;

//Cone
var coneGeom = new THREE.ConeGeometry(objrad/2, objlen/2,objseg);
//var conemat = new THREE.MeshLambertMaterial({color:0xf23671, envMap: scene.background, combine: THREE.MixOperation, reflectivity:0});
var conemat = new THREE.MeshStandardMaterial({color:0xf23671, envMap: scene.background, combine: THREE.MixOperation, reflectivity:0});
var conemesh = new THREE.Mesh(coneGeom, conemat);
conemesh.castShadow = true;
conemesh.position.x = -roomlen/4;
conemesh.position.y = -roomlen/2+objlen/4;
conemesh.position.z = -roomlen/4;
mesh.add(conemesh);

//Cylinder
var cylGeom = new THREE.CylinderGeometry(objrad/2, objrad/2, objlen,objseg);
//var cylmat = new THREE.MeshPhongMaterial({color:0x2afe92, envMap: scene.background, combine: THREE.MixOperation, reflectivity:0});
var cylmat = new THREE.MeshStandardMaterial({color:0xfefe92, envMap: scene.background, combine: THREE.MixOperation, reflectivity:0});
var cylmesh = new THREE.Mesh(cylGeom, cylmat);
cylmesh.castShadow = true;
cylmesh.position.x = roomlen/3;
cylmesh.position.y = -roomlen/2+objlen/2;
cylmesh.position.z = 0;
mesh.add(cylmesh);

//Sphere
var sphGeom = new THREE.SphereGeometry(objrad/3, objseg, objseg);
var sphmat = new THREE.MeshPhysicalMaterial({color:0x45a2f1, envMap: scene.background, combine: THREE.MixOperation, reflectivity:0});
//var sphmat = new THREE.MeshStandardMaterial({color:0x45a2f1, envMap: scene.background, combine: THREE.MixOperation, reflectivity:0});
var sphmesh = new THREE.Mesh(sphGeom, sphmat);
sphmesh.castShadow = true;
sphmesh.position.x = 0;
sphmesh.position.y = -roomlen/2+objrad/3;
sphmesh.position.z = roomlen/3;
mesh.add(sphmesh);

//transperency
//shininess
//texture map
//specular map
//environmental map


//GUI controls
var gui = new GUI();
var curObj;
var obj = {transparency:0, material:'Standard-Cylinder', shadowRadius:plight.shadow.radius, shadowBlurSamples:plight.shadow.blurSamples, shadowMapHeight:plight.shadow.mapSize.height, shadowMapWidth:plight.shadow.mapSize.width};
var objPhong = { shininess:30, specular: { r: 17/255, g: 17/255, b: 17/255 }, emissive: { r: 17/255, g: 17/255, b: 17/255 }, specularMap:false };
var objLambert = {aoMapIntensity:1, emissiveIntensity:1, lightMapIntensity:1, reflectivity:0.5, refractionRatio: 0.98, emissive: { r: 0/255, g: 0/255, b: 0/255 }, specularMap:false};
var objPhysical = {ior:1.5, reflectivity:0.5, sheen:0.1, sheenColor: { r: 255/255, g: 255/255, b: 255/255 }, specularMap:false, specularIntensity:0, specularColor: { r: 255/255, g: 255/255, b: 255/255 }, roughness:0, metalness:0};

var phongcontrol = [];
var lambertcontrol = [];
var physicalcontrol = [];

gui.add(obj, 'transparency',0,1,0.1).onChange(()=>{
    conemat.transparent = cylmat.transparent = sphmat.transparent = true;
    conemat.opacity = cylmat.opacity = sphmat.opacity = 1 - obj.transparency;
});
gui.add(obj, 'shadowRadius', 0, 10, 1).onChange((val)=>{
    plight.shadow.radius = val;
});
gui.add(obj, 'shadowBlurSamples', 0, 10, 1).onChange((val)=>{
    plight.shadow.blurSamples = val;
});
gui.add(obj, 'shadowMapHeight', 100, 1000, 1).onChange((val)=>{
    plight.shadow.mapSize.height = val;
});
gui.add(obj, 'shadowMapWidth', 100, 1000, 1).onChange((val)=>{
    plight.shadow.mapSize.width = val;
});

function mapSetup(material){
    if(material.map == undefined)
        {
            const mapTexture = new THREE.TextureLoader().load('earthmap1k.jpg')
            material.map = mapTexture;
            const specularTexture = new THREE.TextureLoader().load('earthspec1k.jpg')
            //material.sheenRoughnessMap = specularTexture;
            material.roughnessMap = specularTexture;
            //material.metalnessMap = specularTexture;
            //material.specularMap = specularTexture;
            material.sheen = 0.1;
        }
        else
        {
            material.map = undefined;
            material.sheenRoughnessMap = undefined;
            material.roughnessMap = undefined;
            material.metalnessMap = undefined;
        }
        material.needsUpdate = true;
}

function phongControlInit(){
    /*
    phongcontrol.push(gui.add(cylmat, 'shininess',0,100,1));
    phongcontrol.push(gui.addColor(cylmat, 'color'));
    phongcontrol.push(gui.addColor(cylmat, 'specular'));
    phongcontrol.push(gui.addColor(cylmat, 'emissive'));
    phongcontrol.push(gui.add(objPhong, 'specularMap').onChange(()=>{
        mapSetup(cylmat);
    }));
    phongcontrol.push(gui.add(cylmat, 'reflectivity',0,1,0.1));
    phongcontrol.push(gui.add(cylmat, 'refractionRatio',0,1,0.1));
*/

phongcontrol.push(gui.addColor(cylmat, 'color'));
phongcontrol.push(gui.add(cylmat, 'aoMapIntensity',0,2,0.1));
phongcontrol.push(gui.add(cylmat, 'emissiveIntensity',0,2,0.1));
phongcontrol.push(gui.add(cylmat, 'roughness',0,1,0.1));
phongcontrol.push(gui.add(cylmat, 'metalness',0,1,0.1));
phongcontrol.push(gui.add(cylmat, 'refractionRatio',0,1,0.1));
phongcontrol.push(gui.addColor(cylmat, 'emissive'));

phongcontrol.push(gui.add(objPhong, 'specularMap').onChange(()=>{
        mapSetup(cylmat);
    }));
}

function physicalControlInit(){
    physicalcontrol.push(gui.add(sphmat, 'ior',1,2.3,0.1));
    physicalcontrol.push(gui.add(sphmat, 'reflectivity',0,1,0.1));
    physicalcontrol.push(gui.add(sphmat, 'sheen',0.1,1,0.1));
    physicalcontrol.push(gui.addColor(sphmat, 'color'));
    physicalcontrol.push(gui.addColor(sphmat, 'sheenColor'));
    physicalcontrol.push(gui.add(objPhysical, 'specularMap').onChange(()=>{
        mapSetup(sphmat);
    }));
    physicalcontrol.push(gui.add(sphmat, 'specularIntensity',0,1,0.1));
    physicalcontrol.push(gui.addColor(sphmat, 'specularColor'));
    physicalcontrol.push(gui.add(sphmat, 'roughness',0,1,0.1));
    physicalcontrol.push(gui.add(sphmat, 'metalness',0,1,0.1));
}

function lambertControlInit(){
    lambertcontrol.push(gui.addColor(conemat, 'color'));
    lambertcontrol.push(gui.add(conemat, 'aoMapIntensity',0,2,0.1));
    lambertcontrol.push(gui.add(conemat, 'emissiveIntensity',0,2,0.1));
    lambertcontrol.push(gui.add(conemat, 'lightMapIntensity',0,2,0.1));
    lambertcontrol.push(gui.add(conemat, 'reflectivity',0,1,0.1));
    lambertcontrol.push(gui.add(conemat, 'refractionRatio',0,1,0.1));
    lambertcontrol.push(gui.addColor(conemat, 'emissive'));

    lambertcontrol.push(gui.add(objLambert, 'specularMap').onChange(()=>{
        mapSetup(conemat);
    }));
}

function standardControlInit(){
    lambertcontrol.push(gui.addColor(conemat, 'color'));
    lambertcontrol.push(gui.add(conemat, 'aoMapIntensity',0,2,0.1));
    lambertcontrol.push(gui.add(conemat, 'emissiveIntensity',0,2,0.1));
    lambertcontrol.push(gui.add(conemat, 'roughness',0,1,0.1));
    lambertcontrol.push(gui.add(conemat, 'metalness',0,1,0.1));
    lambertcontrol.push(gui.add(conemat, 'refractionRatio',0,1,0.1));
    lambertcontrol.push(gui.addColor(conemat, 'emissive'));

    lambertcontrol.push(gui.add(objLambert, 'specularMap').onChange(()=>{
        mapSetup(conemat);
    }));
}

gui.add(obj, 'material', ['Standard-Cylinder', 'Standard-Cone', 'Physical']).onChange((value)=>{
    if(value == 'Standard-Cylinder')
    {
        lambertcontrol.forEach(control => {
            control.destroy();
        });
        lambertcontrol = [];
        physicalcontrol.forEach(control => {
            control.destroy();
        });
        physicalcontrol = [];
        phongControlInit();
    }
    else if(value == 'Standard-Cone')
    {
        phongcontrol.forEach(control => {
            control.destroy();
        });
        phongcontrol = [];
        physicalcontrol.forEach(control => {
            control.destroy();
        });
        physicalcontrol = [];
        standardControlInit();
    }
    else
    {
        phongcontrol.forEach(control => {
            control.destroy();
        });
        phongcontrol = [];
        lambertcontrol.forEach(control => {
            control.destroy();
        });
        lambertcontrol = [];
        physicalControlInit();
    }
});

phongControlInit();

//stats = createStats();
//document.body.appendChild( stats.domElement );
/*
var renderP = function () {
    requestAnimationFrame( renderP );
    
    controlsP.update(controlSpeed);
    renderer.render( scene, camera );
    //stats.update();
};
renderP();
*/

renderer.setAnimationLoop( function () {

    controlsP.update(controlSpeed);
	renderer.render( scene, camera );

} );



