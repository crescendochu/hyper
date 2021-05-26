var THREEx = THREEx || {}


THREEx.RefractioModels = {}



//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.RefractioModels.GlassTorus = function (videoElement) {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []
	
	// //////////////////////////////////////////////////////////////////////////////
	// //		setup lights
	// //////////////////////////////////////////////////////////////////////////////
	// var ambient = new THREE.AmbientLight( 0x222222 );
	// arApplet.add( ambient );
	// 
	// var directionalLight = new THREE.DirectionalLight( 'white', 0.5);
	// directionalLight.position.set( 1, 2, 1 ).setLength(2)
	// directionalLight.shadow.mapSize.set(256,256)
	// directionalLight.shadow.camera.bottom = -0.6
	// directionalLight.shadow.camera.top = 0.6
	// directionalLight.shadow.camera.right = 0.6
	// directionalLight.shadow.camera.left = -0.6
	// directionalLight.castShadow = true;
	// arApplet.add( directionalLight );
	// 
	// if( false ){
	// 	var cameraHelper = new THREE.CameraHelper( directionalLight.shadow.camera )
	// 	arApplet.add(cameraHelper)
	// 	onRenderFcts.push(function(){
	// 		cameraHelper.update()
	// 	})		
	// }
	// 
	// // add a transparent ground-plane shadow-receiver
	// var material = new THREE.ShadowMaterial();
	// material.opacity = 0.45; //! bug in threejs. can't set in constructor
	// 
	// var geometry = new THREE.PlaneGeometry(3, 3)
	// var planeMesh = new THREE.Mesh( geometry, material);
	// planeMesh.receiveShadow = true;
	// planeMesh.depthWrite = false;
	// planeMesh.rotation.x = -Math.PI/2
	// arApplet.add(planeMesh);
		
	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////
		
	var geometry = new THREE.TorusGeometry(0.3,0.15,16,32);	
	// var geometry = new THREE.TorusGeometry(0.3,0.15,16*4,32*4);	
	// var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);


	console.warn('using arToolkitSource global to get video stream in glass')
	var videoTexture = new THREE.VideoTexture(videoElement)
	videoTexture.minFilter = THREE.NearestFilter
	videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
	var material = new THREEx.RefractionMaterial(videoTexture)

	// var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	// mesh.castShadow = true;
	mesh.position.y	= 0.5
	arApplet.add( mesh );

	// point the directionalLight to the marker
	// directionalLight.target = mesh
	
	onRenderFcts.push(function(delta){
		mesh.rotation.y += delta * Math.PI * 0.5
	})

	return arApplet
}
