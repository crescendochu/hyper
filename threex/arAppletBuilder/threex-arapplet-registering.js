
//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ARAppletBuilder.register('holeTorus', 'holeTorus', function(appletBuilder){
	var applet = new THREEx.HoleInTheWall.HoleTorus()
	return applet
})
THREEx.ARAppletBuilder.register('holePortalStreet', 'holePortalStreet', function(appletBuilder){
	var imageURL = THREEx.ARAppletBuilder.baseURL + '../../threex/hole-in-the-wall/images/32211336474_380b67d014_k.jpg'
	var applet = new THREEx.HoleInTheWall.HolePortal(imageURL)
	return applet
})
THREEx.ARAppletBuilder.register('holePortalAqueduc', 'holePortalAqueduc', function(appletBuilder){
	var imageURL = THREEx.ARAppletBuilder.baseURL + '../../threex/hole-in-the-wall/images/360_aqueduc.png'
	var applet = new THREEx.HoleInTheWall.HolePortal(imageURL)
	return applet
})
THREEx.ARAppletBuilder.register('holePortalTopaz', 'holePortalTopaz', function(appletBuilder){
	var imageURL = THREEx.ARAppletBuilder.baseURL + '../../threex/hole-in-the-wall/images/360_topaz.png'
	var applet = new THREEx.HoleInTheWall.HolePortal(imageURL)
	return applet
})

THREEx.ARAppletBuilder.register('holePool', 'holePool', function(appletBuilder){
	var applet = new THREEx.HoleInTheWall.HolePool()
	return applet
})

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

THREEx.ARAppletBuilder.register('torusKnot', 'Torus Knot', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.ShaddowTorusKnot()
	return applet
})
THREEx.ARAppletBuilder.register('torus', 'Torus', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.Torus()
	return applet
})

THREEx.ARAppletBuilder.register('cone', 'Cone', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.Cone()
	return applet
})

THREEx.ARAppletBuilder.register('cube', 'Cube', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.Cube()
	return applet
})

THREEx.ARAppletBuilder.register('sphere', 'Sphere', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.Sphere()
	return applet
})


THREEx.ARAppletBuilder.register('octahedron', 'Octahedron', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.Octahedron()
	return applet
})


THREEx.ARAppletBuilder.register('icosahedron', 'Icosahedron', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.Icosahedron()
	return applet
})


THREEx.ARAppletBuilder.register('ring', 'Ring', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.Ring()
	return applet
})


THREEx.ARAppletBuilder.register('glassTorus', 'Glass Donut', function(appletBuilder){
	var applet = new THREEx.RefractioModels.GlassTorus(appletBuilder.videoElement)
	return applet
})
THREEx.ARAppletBuilder.register('bouncingBall', 'bouncingBall', function(appletBuilder){
	var applet = new THREEx.ARAppletBuilder.BouncingBall()
	return applet
})
THREEx.ARAppletBuilder.register('holographicMessage', 'Hologram', function(appletBuilder){
	var arApplet = new THREE.Group
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	// sanity check
	var videoURL = THREEx.ARAppletBuilder.baseURL + '../../threex/holographic-message/examples/videos/AndraConnect business\ card.mp4'
	// var videoURL = THREEx.ARAppletBuilder.baseURL + '../../threex/holographic-message/examples/videos/output.webm'
	var holograhicMessage = new THREEx.HolographicMessage(videoURL, appletBuilder.camera)
	onRenderFcts.push(function(delta){
		holograhicMessage.update(delta)
	})
	
	arApplet.add(holograhicMessage.object3d)
	return arApplet
})

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

THREEx.ARAppletBuilder.register('minecraft', 'Minecraft', function(appletBuilder){
	var skinURL = THREEx.MinecraftChar.baseUrl + 'images/jetienne.png'
	var arApplet = new THREEx.ARAppletBuilder.Minecraft(skinURL)
	return arApplet
})
THREEx.ARAppletBuilder.register('minecraftBatman', 'Minecraft Batman', function(appletBuilder){
	var skinURL = THREEx.MinecraftChar.baseUrl + 'images/batman.png'
	var arApplet = new THREEx.ARAppletBuilder.Minecraft(skinURL)
	return arApplet
})
THREEx.ARAppletBuilder.register('minecraftSuperman', 'Minecraft Superman', function(appletBuilder){
	var skinURL = THREEx.MinecraftChar.baseUrl + 'images/Superman.png'
	var arApplet = new THREEx.ARAppletBuilder.Minecraft(skinURL)
	return arApplet
})
THREEx.ARAppletBuilder.register('minecraftMario', 'Minecraft Mario', function(appletBuilder){
	var skinURL = THREEx.MinecraftChar.baseUrl + 'images/Mario.png'
	var arApplet = new THREEx.ARAppletBuilder.Minecraft(skinURL)
	return arApplet
})

//////////////////////////////////////////////////////////////////////////////
//		gltf applet
//////////////////////////////////////////////////////////////////////////////

THREEx.ARAppletBuilder.register('busterDrone', 'Buster Drone', function(appletBuilder){
	// update downloadsCount
	appletBuilder.downloadsCount++
	// start loading model
	var modelURL = THREEx.ARAppletBuilder.baseURL + 'models/gltf/busterDrone/busterDrone.gltf'
	var arApplet = new THREEx.ARAppletBuilder.GltfModel(modelURL, function onLoaded(){
		// update downloadsCount
		appletBuilder.downloadsCount--
		// set position
		arApplet.position.y = 1
		// remove the ground
		var groundMesh = arApplet.getObjectByName('node_Env_-15352')
		groundMesh.visible = false			
	})			
	return arApplet
})

THREEx.ARAppletBuilder.register('centurion', 'Centurion', function(appletBuilder){
	// update downloadsCount
	appletBuilder.downloadsCount++
	// start loading model

	var modelURL = THREEx.ARAppletBuilder.baseURL + 'models/gltf/centurion/centurion.gltf'

// // cross origin experiment
// var modelURL = 'https://threejs.org/examples/models/gltf/BoomBox/glTF/BoomBox.gltf'
// // modelURL = 'https://crossorigin.me/' + modelURL
// modelURL = 'https://cors-anywhere.herokuapp.com/' + modelURL

	var arApplet = new THREEx.ARAppletBuilder.GltfModel(modelURL, function onLoaded(){
		// update downloadsCount
		appletBuilder.downloadsCount--
		// set position
		arApplet.position.y = 1
		// remove the ground
		var groundMesh = arApplet.getObjectByName('mesh_BotExport_12184BotExport3')
		groundMesh.visible = false			
	})		
	return arApplet
})

THREEx.ARAppletBuilder.register('damagedHelmet', 'Dammaged Helmet', function(appletBuilder){
	// update downloadsCount
	appletBuilder.downloadsCount++
	// start loading model
	var modelURL = THREEx.ARAppletBuilder.baseURL + 'models/gltf/damagedHelmet/damagedHelmet.gltf'
	var arApplet = new THREEx.ARAppletBuilder.GltfModel(modelURL, function onLoaded(){
		// update downloadsCount
		appletBuilder.downloadsCount--
		// set position
		arApplet.position.y = 1		
	})		
	return arApplet
})

THREEx.ARAppletBuilder.register('steampunkExplorer', 'Steampunk Explorer', function(appletBuilder){
	// update downloadsCount
	appletBuilder.downloadsCount++
	// start loading model
	var modelURL = THREEx.ARAppletBuilder.baseURL + 'models/gltf/steampunkExplorer/steampunkExplorer.gltf'
	var arApplet = new THREEx.ARAppletBuilder.GltfModel(modelURL, function onLoaded(){
		// update downloadsCount
		appletBuilder.downloadsCount--
		// set position
		arApplet.position.y = 2
	})		
	return arApplet
})


THREEx.ARAppletBuilder.register('blocks_camera', 'Camera', function(appletBuilder){
	// update downloadsCount
	appletBuilder.downloadsCount++
	// start loading model
	var modelOBJURL = THREEx.ARAppletBuilder.baseURL + 'models/obj/camera/model.obj'
	var modelMTLURL = THREEx.ARAppletBuilder.baseURL + 'models/obj/camera/materials.mtl'
	var arApplet = new THREEx.ARAppletBuilder.OBJMTLModel(modelOBJURL, modelMTLURL, function onLoaded(){
		// update downloadsCount
		appletBuilder.downloadsCount--
		// set position
		arApplet.position.y = 0.3		
	})		
	return arApplet
})


THREEx.ARAppletBuilder.register('blocks_sword_kirby', 'Sword Kirby', function(appletBuilder){
	// update downloadsCount
	appletBuilder.downloadsCount++
	// start loading model
	var modelOBJURL = THREEx.ARAppletBuilder.baseURL + 'models/obj/sword-kirby/model.obj'
	var modelMTLURL = THREEx.ARAppletBuilder.baseURL + 'models/obj/sword-kirby/materials.mtl'
	var arApplet = new THREEx.ARAppletBuilder.OBJMTLModel(modelOBJURL, modelMTLURL, function onLoaded(){
		// update downloadsCount
		appletBuilder.downloadsCount--
		// set position
		arApplet.position.y = 1		
	})		
	return arApplet
})

THREEx.ARAppletBuilder.register('image_arjs_logo', 'Image', function(appletBuilder){
	// update downloadsCount
	appletBuilder.downloadsCount++
	// start loading model
	var url = THREEx.ARAppletBuilder.baseURL + '../../vendor/ar.js/data/logo/pikachu.png'
	var arApplet = new THREEx.ARAppletBuilder.SimpleImage(url, function onLoaded(){
		// update downloadsCount
		appletBuilder.downloadsCount--
	})		
	return arApplet
})


THREEx.ARAppletBuilder.register('video_sintel', 'Video', function(appletBuilder){
	// start loading model
	var url = THREEx.ARAppletBuilder.baseURL + 'videos/pikachu.mp4'
	var applet = new THREEx.ARAppletBuilder.SimpleVideo(url)		
	return applet
})



THREEx.ARAppletBuilder.register('text_arjs_moto', 'Text', function(appletBuilder){
	var applet = new THREE.Group
	var currentText = 'Hope you are having fun!:)'
	
	//////////////////////////////////////////////////////////////////////////////
	//		openSettingsDialog
	//////////////////////////////////////////////////////////////////////////////
	applet.userData.openSettingsDialog = function(onCompleted){
		// create dialogElement	
		var dialogElement = document.createElement('dialog')
		dialogElement.innerHTML = `
			<form method="dialog">
				<section>
					<label>Text:</label>
					<input type='text'/>
				</section>
				<menu>
					<button type="reset">Cancel</button>
					<button type="submit">Confirm</button>
				</menu>
			</form>
		`
		document.body.appendChild(dialogElement)

		// register it with dialog-polyfill - just in case
		dialogPolyfill.registerDialog(dialogElement)

		// set currentText in dialog
		dialogElement.querySelector('[type=text]').value = currentText

		// Form cancel button closes the dialog box
		dialogElement.querySelector('[type=reset]').addEventListener('click', function() {
			dialogElement.close()
		})

		// Form submit button
		dialogElement.querySelector('[type=submit]').addEventListener('click', function() {
			// get currentText from dialogElement
			currentText = dialogElement.querySelector('[type=text]').value

			// remove all children
			while( applet.children.length > 0 ){
				applet.remove(applet.children[0])
			}

			// create new mesh
			var textMesh = bmFontText.createTextMesh({
				text : currentText,
				width: 300,
			})
			applet.add(textMesh)
		})

		// bind dialogElement close event
		dialogElement.addEventListener('close', function() {
			// remove dialogElement from body
			document.body.removeChild(dialogElement)

			// honor onCompleted
			onCompleted && onCompleted()
		});

		// show modal
		dialogElement.showModal()
	}

	//////////////////////////////////////////////////////////////////////////////
	//		load font + create mesh
	//////////////////////////////////////////////////////////////////////////////

// FIXME this load the font every time
	var bmFontText = new THREEx.BmfontText()	
	var textureURL = THREEx.BmfontText.baseURL + 'fonts/DejaVu-sdf.png'
	var fontURL = THREEx.BmfontText.baseURL + 'fonts/DejaVu-sdf.fnt'
	bmFontText.loadFont(fontURL, textureURL, function onReady(){
		var textMesh = bmFontText.createTextMesh({
			text : currentText,
			width: 300,
		})
		applet.add(textMesh)
	})

	return applet
})
