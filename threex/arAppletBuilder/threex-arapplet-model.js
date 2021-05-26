//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ARAppletBuilder.GltfModel = function (modelUrl, onLoaded) {
	var arApplet = new THREE.Group()
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// see about the three.js example - it is more complete with the special gltf folder structur
	var loader = new THREE.GLTF2Loader()
	loader.setCrossOrigin('anonymous')
	loader.load( modelUrl, function(gltf) {
		var model = gltf.scene
		arApplet.add( model )
		
		if ( gltf.animations && gltf.animations.length ) {
			var mixer = new THREE.AnimationMixer( model )
			for ( var i = 0; i < gltf.animations.length; i ++ ){
				var animation = gltf.animations[ i ];
				mixer.clipAction( animation ).play()
			}

			onRenderFcts.push(function(delta){
				mixer.update(delta)
			})
		}
		
		onLoaded && onLoaded()
	})
	return arApplet
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ARAppletBuilder.OBJMTLModel = function (modelOBJUrl, modelMTLUrl, onLoaded) {
	var arApplet = new THREE.Group()
	
	// to enable loading DDS
	// THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() )

	// parse urls
	var matches = modelOBJUrl.match(/(.*\/)([^/]*)$/)
	var objPath = matches[1]
	var objBasename = matches[2]

	var matches = modelMTLUrl.match(/(.*\/)([^/]*)$/)
	var mtlPath = matches[1]
	var mtlBasename = matches[2]

	// load mtl
	var mtlLoader = new THREE.MTLLoader()
	mtlLoader.setPath( mtlPath )
	mtlLoader.load( mtlBasename, function( materials ) {

		materials.preload()

		// load obj
		var objLoader = new THREE.OBJLoader()
		objLoader.setMaterials( materials )
		objLoader.setPath( objPath )
		objLoader.load( objBasename, function ( model ) {
			arApplet.add( model )
			onLoaded && onLoaded()
		}, onProgress, onError)
	})
	// return 
	return arApplet
	
	var onProgress = function ( request ) {
		if ( request.lengthComputable ) {
			var percentComplete = request.loaded / request.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' )
		}
	}
	var onError = function ( request ) { }
}
