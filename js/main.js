'use strict;'

var trackingBackend = ARjs.Utils.isTango() === true ? 'tango' : 'artoolkit'
console.log('Guessed Tracking Backend:', trackingBackend)

var trackingMethod = ARjs.Utils.isTango() === true ? 'tango' : 'area-artoolkit'

//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
var runOnMobile = 'ontouchstart' in window ? true : false
var renderer	= new THREE.WebGLRenderer({
	antialias : runOnMobile === true ? false: true,
	alpha : true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild( renderer.domElement );
// enable shadow in renderer
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true;	

renderer.autoClearColor = false;

// array of functions for the rendering loop
var onRenderFcts= [];

// init scene and camera
var scene	= new THREE.Scene();


//////////////////////////////////////////////////////////////////////////////
//		add lighting
//////////////////////////////////////////////////////////////////////////////

;(function(){
	// 3 points lighting - https://github.com/jeromeetienne/threex.basiclighting/blob/master/examples/manual.html
	var object3d	= new THREE.AmbientLight(0x606060)
	object3d.name	= 'Ambient light'
	scene.add(object3d)
	var object3d	= new THREE.DirectionalLight('white', 0.225*3)
	object3d.position.set(2.6,1,3)
	object3d.name	= 'Back light'
	scene.add(object3d)
	var object3d	= new THREE.DirectionalLight('white', 0.375*3)
	object3d.position.set(-2, -1, 0)
	object3d.name 	= 'Key light'
	scene.add(object3d)
	var object3d	= new THREE.DirectionalLight('white', 0.5*3)
	object3d.position.set(3, 3, 2)
	object3d.name	= 'Fill light'
	scene.add(object3d)		
})()
//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
var camera = ARjs.Utils.createDefaultCamera(trackingBackend)
scene.add(camera);

	
////////////////////////////////////////////////////////////////////////////////
//          	Set up Arjs.Profile
////////////////////////////////////////////////////////////////////////////////

var arProfile = new ARjs.Profile()
	.sourceWebcam()
	.trackingMethod(trackingMethod)
	// .changeMatrixMode('modelViewMatrix')
	// .changeMatrixMode('cameraTransformMatrix')
	.defaultMarker()
	.checkIfValid()


if( arProfile.contextParameters.trackingBackend === 'tango' ){
	arProfile.changeMatrixMode('cameraTransformMatrix')
}

//////////////////////////////////////////////////////////////////////////////
//		build ARjs.Session
//////////////////////////////////////////////////////////////////////////////

var arSession = new ARjs.Session({
	scene: scene,
	renderer: renderer,
	camera: camera,
	sourceParameters: arProfile.sourceParameters,
	contextParameters: arProfile.contextParameters		
})
onRenderFcts.push(function(){
	arSession.update()
})

////////////////////////////////////////////////////////////////////////////////
//          Create a ARjs.Anchor
////////////////////////////////////////////////////////////////////////////////

var arAnchor = new ARjs.Anchor(arSession, arProfile.defaultMarkerParameters)
onRenderFcts.push(function(){
	arAnchor.update()
})

//////////////////////////////////////////////////////////////////////////////
//		tango specifics
//////////////////////////////////////////////////////////////////////////////

if( arProfile.contextParameters.trackingBackend === 'tango' ){
	// init tangoVideoMesh
	var tangoVideoMesh = new ARjs.TangoVideoMesh(arSession)
	onRenderFcts.push(function(){
		tangoVideoMesh.update()
	})
}

// if( arProfile.contextParameters.trackingBackend === 'tango' ){
// 	// init tangoPointCloud
// 	var tangoPointCloud = new ARjs.TangoPointCloud(arSession)
// 	scene.add(tangoPointCloud.object3d)
// }

//////////////////////////////////////////////////////////////////////////////
//		honor scanningSpinner visibility
//////////////////////////////////////////////////////////////////////////////

onRenderFcts.push(function(){
	var domElement = document.querySelector('.spinnerScanning')
	var markerFound = arAnchor.object3d.visible
	domElement.style.display = (markerFound === true ? 'none' : '')
})

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
var stats = new Stats();
// document.body.appendChild( stats.dom );

// render the scene
onRenderFcts.push(function(){
	renderer.clear()

	// render tangoVideoMesh
	if( arProfile.contextParameters.trackingBackend === 'tango' ){
		tangoVideoMesh.render()
	}

	renderer.render( scene, camera );
	
	// debug to display pickingPlane
	if( window.cameraPicking ){
		renderer.render( scenePicking, cameraPicking );
	}

	// stats.update();
})

// run the rendering loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	// call each update function
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})
})

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

var arToolkitSource = arSession.arSource

// create App
var app = new App(arAnchor.object3d, trackingBackend)
onRenderFcts.push(function(delta){
	app.update(delta)
})


// if( navigator.serviceWorker ){
// 	navigator.serviceWorker.register('./service-worker.js')
// 		.catch(function(error){
// 			console.error('Unable to register service worker.', error)
// 		})
// }
