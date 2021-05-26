THREEx.ARAppletBuilder.SimpleImage = function (imageURL, onLoaded) {
	var arApplet = new THREE.Group

	// create geometry and material
	var texture = new THREE.TextureLoader().load( imageURL, function(){
		var width = texture.image.naturalWidth / texture.image.naturalHeight
		mesh.scale.set(width, 0, 1)

		// honor onLoaded
		onLoaded && onLoaded()
	})

	var geometry	= new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2)
	var material	= new THREE.MeshBasicMaterial({
		map: texture,
	})
	var mesh = new THREE.Mesh(geometry, material)
	arApplet.add(mesh)

	return arApplet
}

THREEx.ARAppletBuilder.SimpleVideo = function (videoURL) {
	var arApplet = new THREE.Group


	var videoElement = document.createElement( 'video' );
	videoElement.src = videoURL
	videoElement.autoplay = true;
	videoElement.webkitPlaysinline = true;
	videoElement.controls = false;
	videoElement.loop = true;
	videoElement.muted = true
	// trick to trigger the video on android
	document.body.addEventListener('click', function onClick(){
		document.body.removeEventListener('click', onClick);
		videoElement.play()
	})

	videoElement.addEventListener('loadedmetadata', function(event){
		var width = videoElement.videoWidth / videoElement.videoHeight
		mesh.scale.set(width, 0, 1)
	})
	
	var videoTexture = new THREE.VideoTexture(videoElement)
	videoTexture.needsUpdate = true		
	videoTexture.minFilter =  THREE.NearestFilter
	

	var geometry	= new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2)
	var material	= new THREE.MeshBasicMaterial({
		map: videoTexture,
	})
	var mesh = new THREE.Mesh(geometry, material)
	arApplet.add(mesh)

	return arApplet
}
//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ARAppletBuilder.ShaddowTorusKnot = function () {
	var arApplet = new THREE.Group
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []
	//////////////////////////////////////////////////////////////////////////////
	//		setup lights
	//////////////////////////////////////////////////////////////////////////////
	var ambient = new THREE.AmbientLight( 0x222222 );
	arApplet.add( ambient );
	
	var directionalLight = new THREE.DirectionalLight( 'white', 0.5);
	directionalLight.position.set( 1, 2, 0.3 ).setLength(2)
	directionalLight.shadow.mapSize.set(128,128)
	directionalLight.shadow.camera.bottom = -0.6
	directionalLight.shadow.camera.top = 0.6
	directionalLight.shadow.camera.right = 0.6
	directionalLight.shadow.camera.left = -0.6
	directionalLight.castShadow = true;
	arApplet.add( directionalLight );

	onRenderFcts.push(function(){
		if( arApplet.parent === null )	return
		directionalLight.shadow.camera.scale.copy(arApplet.parent.scale)
	})

	if( false ){
		var cameraHelper = new THREE.CameraHelper( directionalLight.shadow.camera )
		arApplet.add(cameraHelper)
		onRenderFcts.push(function(){
			cameraHelper.update()
		})		
	}
	
	// add a transparent ground-plane shadow-receiver
	var material = new THREE.ShadowMaterial({
		// opacity: 0.7
	});
	material.opacity = 0.7; //! bug in threejs. can't set in constructor

	var geometry = new THREE.PlaneGeometry(3, 3)
	var planeMesh = new THREE.Mesh( geometry, material);
	planeMesh.receiveShadow = true;
	planeMesh.depthWrite = false;
	planeMesh.position.y = 0.05
	planeMesh.rotation.x = -Math.PI/2
	arApplet.add(planeMesh);
	
	// add torus knot
	var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
	var material	= new THREE.MeshNormalMaterial();
	// var material	= new THREE.MeshLambertMaterial();
	var mesh = new THREE.Mesh( geometry, material );
	
	// var material	= new THREE.MeshNormalMaterial();
	// var material	= new THREE.MeshLambertMaterial();
	// var mesh	= new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	// mesh.receiveShadow = true;
	mesh.position.y	= 0.7
	arApplet.add( mesh );

	// // point the directionalLight to the marker
	directionalLight.target = mesh

	onRenderFcts.push(function(){
		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.01;
	})

	return arApplet
}


//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

THREEx.ARAppletBuilder.Torus = function () {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// add a torus knot	
	var geometry	= new THREE.CubeGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	arApplet.add(mesh)
	
	var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
	var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	arApplet.add( mesh );
	
	onRenderFcts.push(function(delta){
		mesh.rotation.x += delta * Math.PI
	})	
	
	return arApplet
};


THREEx.ARAppletBuilder.Cone = function () {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []
	
	var geometry	= new THREE.ConeGeometry(0.4, 1, 32 );
	var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	arApplet.add( mesh );
	
	// onRenderFcts.push(function(delta){
	// 	mesh.rotation.x += delta * Math.PI
	// })	

	onRenderFcts.push(function(){
		mesh.rotation.x += 0.04;
	})
	
	return arApplet
};


THREEx.ARAppletBuilder.Cube = function () {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// add a torus knot	
	var geometry	= new THREE.CubeGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.7,
		side: THREE.DoubleSide
	}); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	arApplet.add(mesh)
	
	onRenderFcts.push(function(delta){
		mesh.rotation.x += delta * Math.PI
	})	
	
	return arApplet
};


THREEx.ARAppletBuilder.Sphere= function () {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// add a torus knot	
	var geometry	= new THREE.SphereGeometry(0.5,32,32);
	var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	arApplet.add( mesh );

	onRenderFcts.push(function(delta){
		mesh.rotation.x += delta * Math.PI
	})	
	

	return arApplet
};


THREEx.ARAppletBuilder.Octahedron= function () {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// add a torus knot	
	var geometry	= new THREE.OctahedronGeometry(0.5,0);
	var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	arApplet.add( mesh );


	onRenderFcts.push(function(){
		mesh.rotation.x += 0.04;
	})
	

	return arApplet
};


THREEx.ARAppletBuilder.Icosahedron = function () {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// add a torus knot	
	var geometry	= new THREE.IcosahedronGeometry(0.5,0);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.7,
		side: THREE.DoubleSide
	}); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	arApplet.add( mesh );

	onRenderFcts.push(function(){
		mesh.rotation.x += 0.04;
	})

	return arApplet
};



THREEx.ARAppletBuilder.Ring = function () {
	var arApplet = new THREE.Group()
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// add a torus knot	
	var geometry = new THREE.TorusGeometry(0.3,0.15,16,32);	
	var material	= new THREE.MeshNormalMaterial(); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	arApplet.add( mesh );

	onRenderFcts.push(function(delta){
		mesh.rotation.y += delta * Math.PI * 0.5
		mesh.rotation.x += delta * Math.PI * 0.5
	})

	return arApplet
};



