var App = function(arWorldRoot, trackingBackend){
	var _this = this
	this.applets = {}
	this.selectedApplet = null
	this.arWorldRoot = arWorldRoot
	this.trackingBackend = trackingBackend


	// init a update loop
	this._onUpdateFcts = []
	this.update = function(delta){
		_this._onUpdateFcts.forEach(function(onUpdateFct){
			onUpdateFct(delta)
		})
	}

	// honor all applet.userData.onRenderFcts
	_this._onUpdateFcts.push(function(delta){
		Object.keys(_this.applets).forEach(function(objectID){
			
			var applet = _this.applets[objectID]
			if( applet.userData.onRenderFcts === undefined )	return
			applet.userData.onRenderFcts.forEach(function(onRenderFct){
				onRenderFct(delta)
			})
		})
	})

	// create demo scenes
	if( _this.trackingBackend === 'artoolkit' ||  _this.trackingBackend === 'aruco' ){
		_this._arAppletBuilder= new THREEx.ARAppletBuilder(camera, arToolkitSource.domElement)
	}else{
		_this._arAppletBuilder= new THREEx.ARAppletBuilder(camera)
	}


	this._appGesture = new AppGesture(this)

	this._appShare = new AppShare(this)

	this._appUI = new AppUI(this)
	this._onUpdateFcts.push(function(delta){
		_this._appUI.update(delta)
	})


	// init autohide
	this.uiAutoHide = new UIAutoHide()
	this._onUpdateFcts.push(function(delta){
		_this.uiAutoHide.update(delta)
	})

	this._contentLocalStorage = new ContentLocalStorage()
	
	
	//////////////////////////////////////////////////////////////////////////////
	//		init applets if needed
	//////////////////////////////////////////////////////////////////////////////
	if( location.hash.substring(1) ){
		var data = JSON.parse(decodeURIComponent(location.hash.substring(1)))
		this.appletsFromJSON( data.contentData )
		history.pushState("", null, location.pathname + location.search);
	}else if( this._contentLocalStorage.hasContent() === true ){
		var storedContent = this._contentLocalStorage.getContent()
		this.appletsFromJSON( storedContent )
	}else{
		this.resetFullScene()
	}

}

App.prototype.getContentURL = function () {
	var urlOptions = {
		contentData: this.appletsToJSON()
	}
	var contentURL = location.protocol + '//' + location.host + location.pathname
	contentURL += '#' + encodeURIComponent(JSON.stringify(urlOptions))
	return contentURL
};

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

App.prototype.selectApplet = function (arScene) {
	console.assert(arScene)
	this.selectedApplet = arScene		

	// remove any domElement with selected class
	;[].slice.call(document.querySelectorAll('#objectList ul li.selected')).forEach(function(domElement){
		domElement.classList.remove('selected')
	})

	// add selected class tot the domElement
	if( this.selectedApplet !== null ){
		var selector = '#objectList ul li[data-ar-scene-id="'+this.selectedApplet.id+'"]'
		var domElement = document.querySelector(selector)
		domElement.classList.add('selected')		
	}
}

App.prototype.deleteApplet = function (arScene) {
	console.assert(arScene instanceof THREE.Object3D)
	// remove it from (applets)
	delete this.applets[arScene.id]
	
	// remove the element from #objectList
	var domElement = document.querySelector('#objectList ul li[data-ar-scene-id="'+arScene.id+'"]')
	domElement.parentNode.removeChild(domElement)

	// remove it from the scene
	var markerRoot = arScene.parent
	markerRoot.parent.remove( markerRoot )
}


App.prototype.createApplet = function (sceneType) {
	var _this = this
	var demoRoot = new THREE.Group
	this.arWorldRoot.add(demoRoot)
	
	if( this.trackingBackend === 'arjs' ){
		var averageMatrix = THREEx.ArMultiMarkerControls.computeCenter(multiMarkerFile)
		averageMatrix.decompose(demoRoot.position, demoRoot.quaternion, demoRoot.scale)		
	}

	// create the new selectedApplet
	var applet = this._arAppletBuilder.createApplet(sceneType)	
	demoRoot.add( applet )
	applet.visible = false

	this.applets[applet.id] = applet
	
	// update the UI
	var sceneLabel = UIbuildSceneLabel(sceneType)
	UIcreateSceneElement(sceneLabel, applet)

	// update urlOptions.sceneName
	this.onAppletsUpdate()

	// actually select this scene
	this.selectApplet(applet)
	
	return
	
	function onSelect(){
		// get the applet
		var liElement = this
		var object3dId = liElement.dataset.arSceneId
		var arScene = _this.applets[object3dId];
		
		_this.selectApplet(arScene)
		
		_this.putBlipOn(arScene)
	}
	function onDelete(event){
		// debugger
		event.stopPropagation()

		_this.deleteApplet(applet)
			
		// update urlOptions.sceneName
		_this.onAppletsUpdate()
		
		// delete one scene
		var lastDomElement = [].slice.call(document.querySelectorAll('#objectList ul li')).pop()
		if( lastDomElement ){
			var tmpScene = _this.applets[parseInt(lastDomElement.dataset.arSceneId)]
			if( tmpScene === undefined )	debugger
			_this.selectApplet(tmpScene)				
		}else{
			_this.selectedApplet = null
		}
	}
	function onConfig(event){
		event.stopPropagation()
		// sanity check
		console.assert(applet.userData.openSettingsDialog !== undefined)
		// call the applet function
		applet.userData.openSettingsDialog(function onCompleted(){
			
		})
	}
	function UIcreateSceneElement(sceneLabel){
		// create deleteElement
		var deleteElement = document.createElement('i')
		deleteElement.innerHTML = 'delete'
		deleteElement.classList.add('material-icons')
		deleteElement.classList.add('buttonDelete')
		deleteElement.addEventListener('click', onDelete)
		
		// create nameElement
		var nameElement = document.createElement('span')
		nameElement.classList.add('name')
		nameElement.innerHTML = sceneLabel

		// create settingsElement
		var settingsElement = document.createElement('i')
		settingsElement.innerHTML = 'mode'
		settingsElement.classList.add('material-icons')
		settingsElement.classList.add('buttonSettings')
		settingsElement.addEventListener('click', onConfig)
		
		// create liElement
		var liElement = document.createElement('li')
		document.querySelector('#objectList ul').appendChild(liElement)
		liElement.appendChild(deleteElement)
		liElement.appendChild(nameElement)
		if( applet.userData.openSettingsDialog !== undefined ){
			liElement.appendChild(settingsElement)
		}
		liElement.classList.add('selected')
		liElement.dataset.arSceneId = applet.id
		liElement.addEventListener('click', onSelect)
	}
	function UIbuildSceneLabel(sceneType){
		var label = THREEx.ARAppletBuilder.nameToLabel[sceneType]
		
		// add a number at the end of the label if needed
		var allLabels = [].slice.call(document.querySelectorAll('#objectList ul li .name')).map(function(domElement){
			return domElement.innerHTML
		})
		for(var index = 1; true; index++){
			if( allLabels.indexOf(label) === -1 )	break;
			label = label.replace(/ \d+$/, '')
			label += ' '+index
		}

		// return the resulting label
		return label
	}	
};




App.prototype.onAppletsUpdate = function(){
	// make selectedApplet visible
	if( this.selectedApplet !== null ){
		this.selectedApplet.visible = true
	}
	
	var content = this.appletsToJSON()
	
	// update this._contentLocalStorage
	this._contentLocalStorage.onContentChange(content)
}

App.prototype.resetFullScene = function () {
	var _this = this
	// delete all applets
	Object.keys(this.applets).forEach(function(arSceneId){
		var arScene = _this.applets[arSceneId]
		_this.deleteApplet(arScene)
	})
	
	_this.createApplet('torus')
	
	_this.onAppletsUpdate()
};


//////////////////////////////////////////////////////////////////////////////
//		json stuff
//////////////////////////////////////////////////////////////////////////////

App.prototype.appletsToJSON = function(){
	var _this = this
	var jsonData = {
		applets: []
	}

	scene.updateMatrix(true)
	scene.updateMatrixWorld(true)

	Object.keys(this.applets).forEach(function(arSceneId){
		var applet = _this.applets[arSceneId]
		applet.updateMatrix()
		var parentObject3D = applet.parent
		jsonData.applets.push({
			type: applet.userData.sceneType,
			poseMatrix: parentObject3D.matrix.toArray()
		})
	})
	
	return jsonData
}

App.prototype.appletsFromJSON = function(jsonData){
	var _this = this
	jsonData.applets.forEach(function(item){
		_this.createApplet(item.type)
		_this.selectedApplet.visible = true
		var parentObject3D = _this.selectedApplet.parent
		
		var poseMatrix = new THREE.Matrix4().fromArray(item.poseMatrix)
		parentObject3D.matrix.copy(poseMatrix)
		
		parentObject3D.matrix.decompose(parentObject3D.position, parentObject3D.quaternion, parentObject3D.scale)
	})
}
//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
App.prototype.putBlipOn = function (object3d) {
	// display the blip
	var geometry = new THREE.SphereGeometry(0.1)
	var material = new THREE.MeshBasicMaterial({
		wireframe : true
	})
	var blipMesh = new THREE.Mesh(geometry, material)
	object3d.parent.add(blipMesh)
	// auto remove the blip 
	setTimeout(function(){
		blipMesh.parent.remove(blipMesh)
	}, 1000)	
};

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
App.prototype.initUI = function () {
	var _this = this

	this._appGesture.init()
};
