//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ARAppletBuilder.BouncingBall = function () {
	var container = new THREE.Group()
	container.scale.multiplyScalar(0.2)	// TMP:

	var onRenderFcts = container.userData.onRenderFcts = container.userData.onRenderFcts || []
	
	var model = createModel()
	container.add(model)

	// state for updateModelScaleWithVelocity()
	var updateScaleLastPosition = null
	

	var registeredStages = {}
	var currentStage = {
		sequenceIndex : 0,
		state : 'uninitialized',
		initializedAt: null
	}

	var stagesSequence = [
		{
			name: 'gotoTarget',
			delay: 1,
			targetPosition: new THREE.Vector3(  4, 0.5, 0),
		},
		{
			name: 'stayIdle',
			delay: 0.1,
		},
		{
			name: 'gotoTarget',
			delay: 1,
			targetPosition: new THREE.Vector3( -4, 0.5, 0),
		},
		{
			name: 'stayIdle',
			delay: 0.1,
		},
	]
	//////////////////////////////////////////////////////////////////////////////
	//		register gotoTarget stage
	//////////////////////////////////////////////////////////////////////////////

	;(function(){
		var states = {
			startingPosition: new THREE.Vector3()
		}
		var registeredStage = {
			name: 'gotoTarget'
		}

		registeredStages[registeredStage.name] = registeredStage

		registeredStage.init = function(){
			// console.log('init', this.name)
			states.startingPosition.copy(model.position)
		}
		registeredStage.update = function(){
			var stageSequence = stagesSequence[currentStage.sequenceIndex]

			var present = Date.now()/1000
			var progress = (present - currentStage.initializedAt)/stageSequence.delay
			console.assert(progress <= 1)
			
			progress = TWEEN.Easing.Quintic.InOut(progress)
			
			var vector3 = stageSequence.targetPosition.clone().sub(states.startingPosition)
			vector3.multiplyScalar(progress)
			vector3.add(states.startingPosition)
			
			model.position.copy(vector3)
		}
		registeredStage.dispose = function(){
			// console.log('dispose', this.name)
			var stageSequence = stagesSequence[currentStage.sequenceIndex]
			// model.position.copy(stageSequence.targetPosition)
			pushRandomStage()
		}
		
		// for tweening - from tween.js
		var TWEEN = { Easing: {} }
		TWEEN.Easing.Quintic = TWEEN.Easing.Quintic || {}
		TWEEN.Easing.Quintic.InOut = function (k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}
			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}
	})()
	
	//////////////////////////////////////////////////////////////////////////////
	//		register stayIdle stage
	//////////////////////////////////////////////////////////////////////////////

	;(function(){
 		// add brownian movement ? to idle but still
		var states = {}
		var registeredStage = {
			name: 'stayIdle'
		}
		registeredStages[registeredStage.name] = registeredStage
		registeredStage.init = function(){
		}
		registeredStage.update = function(){
		}
		registeredStage.dispose = function(){
		}
	})()

	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////
	function pushRandomStage(){
return
		stagesSequence.push({
			name: 'gotoTarget',
			// for production
			delay: 0.5+THREE.Math.randFloat(0, 0.5),
			targetPosition: new THREE.Vector3(
				THREE.Math.randFloat(-3, + 3),
				0.5+THREE.Math.randFloat(0,3),
				THREE.Math.randFloat(-3, + 3)
			),
			
			// to debug
			// delay: 0.01,
			// targetPosition: new THREE.Vector3(0,0,0),
		})
		stagesSequence.push({
			name: 'stayIdle',
			delay: THREE.Math.randFloat(0.1, 0.2),
		})						
	}

 	//////////////////////////////////////////////////////////////////////////////
	//		implement stage mechanism
	//////////////////////////////////////////////////////////////////////////////
	function stageInit(sequenceIndex){
		var stageSequence = stagesSequence[currentStage.sequenceIndex]
		var registeredStage = registeredStages[stageSequence.name]
		registeredStage.init()

		// sanity check
		console.assert( currentStage.state === 'uninitialized' )
		console.assert( currentStage.initializedAt === null )

		// console.log('init', registeredStage.name)

		currentStage.sequenceIndex = sequenceIndex
		currentStage.state = 'initialized'
		currentStage.initializedAt = Date.now()/1000
	}
	function stageUpdate(){
		console.assert( currentStage.state === 'initialized' )
		var stageSequence = stagesSequence[currentStage.sequenceIndex]
		var registeredStage = registeredStages[stageSequence.name]

		var present = Date.now()/1000
		if( present - currentStage.initializedAt >= stageSequence.delay ){
			gotoNextStage()
			return
		}

		registeredStage.update()
		
	}
	function stageDispose(){
		if( currentStage.state === 'uninitialized' )	return

		var stageSequence = stagesSequence[currentStage.sequenceIndex]
		var registeredStage = registeredStages[stageSequence.name]
		registeredStage.dispose()

		// console.log('dispose', registeredStage.name)
		
		currentStage.state = 'uninitialized'
		currentStage.initializedAt = null
	}
	
	function gotoNextStage(){
		stageDispose()
		
		var nextSequenceIndex = (currentStage.sequenceIndex + 1) % stagesSequence.length

		stageInit(nextSequenceIndex)
	}

	pushRandomStage()
	stageInit(0)


	var clock = new THREE.Clock()
	
	onRenderFcts.push(function(delta){
		stageUpdate()
		updateModelScaleWithVelocity(model)
	})
	return container
	//////////////////////////////////////////////////////////////////////////////
	//		updateModelScaleWithVelocity
	//////////////////////////////////////////////////////////////////////////////
	function updateModelScaleWithVelocity(object3d){
		// based on this GREAT tweet https://twitter.com/_pikopik/status/882346033656844288

		// init updateScaleLastPosition if needed
		if( updateScaleLastPosition === null )	updateScaleLastPosition = object3d.position.clone()
		// look toward last position
		var vector3 = updateScaleLastPosition.clone().sub(object3d.position).negate().add(object3d.position)
		object3d.lookAt(vector3)

		// compute velocity
		var velocity = new THREE.Vector3().copy(object3d.position).sub(updateScaleLastPosition)
		updateScaleLastPosition.copy(object3d.position)

		var deltaTime = clock.getDelta()
		var speed = velocity.length() / deltaTime

		// compute the box depth based on speed
		var depth = Math.pow(1 + speed/60, 3);
		
		// math to keep the same volume of the pseudo-box when the depth changing
        	var widthHeight = Math.sqrt(1 / depth);
        	object3d.scale.set(widthHeight, widthHeight, depth);		
	}
	
	//////////////////////////////////////////////////////////////////////////////
	//		createModel
	//////////////////////////////////////////////////////////////////////////////
	function createModel(){
		var container = new THREE.Group

// 		//////////////////////////////////////////////////////////////////////////////
// 		//		setup lights
// 		//////////////////////////////////////////////////////////////////////////////
// 		var ambient = new THREE.AmbientLight( 0x222222 );
// 		container.add( ambient );
// 		
// 		var directionalLight = new THREE.DirectionalLight( 'white', 0.5);
// 		directionalLight.position.set( 2, 10, 2 ) //.multiplyScalar(2)
// 		directionalLight.shadow.mapSize.set(512,512)
// 		directionalLight.shadow.camera.bottom = -20
// 		directionalLight.shadow.camera.top = 20
// 		directionalLight.shadow.camera.right = 20
// 		directionalLight.shadow.camera.left = -20
// 		directionalLight.castShadow = true;
// window.directionalLight = directionalLight
// 		container.add( directionalLight );
// 		container.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );
// 
// 		_this._onRenderFcts.push(function(){
// 			if( container.parent === null )	return
// 			directionalLight.shadow.camera.scale.copy(container.parent.scale)
// 		})
// 		
// 		// add a transparent ground-plane shadow-receiver
// 		var material = new THREE.ShadowMaterial({
// 			opacity: 0.9
// 		});
// // var material = new THREE.MeshNormalMaterial()
// 		var geometry = new THREE.PlaneGeometry(10, 10)
// 		var planeMesh = new THREE.Mesh( geometry, material);
// 		planeMesh.receiveShadow = true;
// 		planeMesh.depthWrite = false;
// 		planeMesh.rotation.x = -Math.PI/2
// 		container.add(planeMesh);
		
		//////////////////////////////////////////////////////////////////////////////
		//		Code Separator
		//////////////////////////////////////////////////////////////////////////////	

		var geometry = new THREE.SphereGeometry(0.5, 16, 16)
		// var geometry = new THREE.BoxGeometry(1, 1, 1)
		var material = new THREE.MeshLambertMaterial({
			color: 'yellow',
			emissive: 'red',
		})
		var sphere = new THREE.Mesh(geometry, material)
		sphere.position.y = 0.5
		sphere.castShadow = true;
		container.add(sphere)

		//////////////////////////////////////////////////////////////////////////////
		//		Code Separator
		//////////////////////////////////////////////////////////////////////////////
		
		var material = new THREE.MeshBasicMaterial({
			color: 'red',
			transparent: true,
			opacity: 0.15,
			side: THREE.BackSide,
		})
		var nSpheresOutter = 10
		for(var i = 0; i < nSpheresOutter; i++){
			var sphereOutter = new THREE.Mesh(geometry, material)
			sphereOutter.position.copy(sphere.position)
			sphereOutter.scale.multiplyScalar(1.04 + (nSpheresOutter-i) * 0.04)
			sphereOutter.castShadow = true;

			container.add(sphereOutter)
		}
		return container
	}
}
