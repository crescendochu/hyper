var AppUI = function(app){
	this._app = app
	var _this = this
	var app = this._app

	

	document.querySelector('#buttonResetAR').addEventListener('click', function(){
		app.resetFullScene()
	})


	document.querySelector('#showAll').addEventListener('click', function(){
		app.showAll()
	})


	if( this._app.trackingBackend !== 'tango' ){
		this._initMarkerUI()
	}
	

	if( this._app.trackingBackend === 'tango' ){
		document.querySelector('#buttonFullscreen').style.display = 'none'
		document.querySelector('#checkboxMarkerHelpers').style.display = 'none'
		document.querySelector('#buttonResetMultiMarker').style.display = 'none'
		document.querySelector('#buttonLearnMultiMarker').style.display = 'none'
	}

	//////////////////////////////////////////////////////////////////////////////
	//		init creatorMenu
	//////////////////////////////////////////////////////////////////////////////
	
	this._initCreatorMenu()

	//////////////////////////////////////////////////////////////////////////////
	//		init all menus collapsed or not
	//////////////////////////////////////////////////////////////////////////////
	// always start with #optionsMenu collapsed
	document.querySelector('#optionsMenu').classList.add('collapsed')
	document.querySelector('#areaMenu').classList.add('collapsed')

	var menuNames = [
		'areaMenu',
		'optionsMenu',
		'creatorsList',
		'objectList',
	]
	// bind click event on all menus to toggle collapsed
	menuNames.forEach(function(menuName){
		document.querySelector('#'+menuName+' .title').addEventListener('click', function optionsMenuToggle(){
			document.querySelector('#'+menuName).classList.toggle('collapsed')
		})
	})

	//////////////////////////////////////////////////////////////////////////////
	//		Fullscreen
	//////////////////////////////////////////////////////////////////////////////
	document.querySelector('#buttonFullscreen').addEventListener('click', toggleFullScreen)
	// https://stackoverflow.com/questions/21280966/toggle-fullscreen-exit
	function toggleFullScreen() {
		if (!document.fullscreenElement 
			&& !document.mozFullScreenElement 
			&& !document.webkitFullscreenElement && !document.msFullscreenElement 
		) {  // current working methods
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	}
	
	//////////////////////////////////////////////////////////////////////////////
	//		checkboxEnableTorch
	//////////////////////////////////////////////////////////////////////////////
	// handle checkboxEnableTorch
	document.querySelector('#checkboxEnableTorch input').addEventListener('change', function(){
		arToolkitSource.toggleMobileTorch()
	})
	setInterval(function(){
		var hasMobileTorch = arToolkitSource.hasMobileTorch()
		var display = hasMobileTorch === true ? 'inherit' : 'none'
		document.querySelector('#checkboxEnableTorch').style.display = display
	}, 500)
}

//////////////////////////////////////////////////////////////////////////////
//		update
//////////////////////////////////////////////////////////////////////////////
AppUI.prototype.update = function () {
	// honor appletBuilder.downloadsCount
	var appletBuilder = this._app._arAppletBuilder
	if( appletBuilder.downloadsCount > 0 ){
		document.querySelector('.spinnerLoading').style.display = 'block'
	}else{
		document.querySelector('.spinnerLoading').style.display = 'none'
	}

	// honor contentLocalStorage.isSaved()0
	var contentLocalStorage = this._app._contentLocalStorage
	if( contentLocalStorage.isSaved() === true ){
		document.querySelector('.spinnerSaving').style.display = 'none'
	}else{
		document.querySelector('.spinnerSaving').style.display = 'block'
	}
}

//////////////////////////////////////////////////////////////////////////////
//		init
//////////////////////////////////////////////////////////////////////////////

/**
 * init creator menu
 */
AppUI.prototype._initCreatorMenu = function () {
	var _this = this
	var creatorMenuData = {
	        title : 'Create ',
		location: 'bottom',
	        subMenus : {
			'Basic Geometries' : {			
				cube	: THREEx.ARAppletBuilder.nameToLabel['cube'],
				sphere	: THREEx.ARAppletBuilder.nameToLabel['sphere'],
				cone	: THREEx.ARAppletBuilder.nameToLabel['cone'],
				octahedron	: THREEx.ARAppletBuilder.nameToLabel['octahedron'],
				icosahedron	: THREEx.ARAppletBuilder.nameToLabel['icosahedron'],
				ring	: THREEx.ARAppletBuilder.nameToLabel['ring'],
				torusKnot: THREEx.ARAppletBuilder.nameToLabel['torusKnot'],
			},
			'Multimedia' : {
				text_arjs_moto	: THREEx.ARAppletBuilder.nameToLabel['text_arjs_moto'],
				image_arjs_logo	: THREEx.ARAppletBuilder.nameToLabel['image_arjs_logo'],
				video_sintel	: THREEx.ARAppletBuilder.nameToLabel['video_sintel'],
			},
		}
	}

	var domElement = buildTwoLevelMenu(creatorMenuData, function onSelect(actionName){
		_this._app.createApplet(actionName)
	})
	domElement.style.position = 'fixed'
	domElement.style.bottom = '0%'
	domElement.style.right = '11em'
	document.body.appendChild(domElement)	
	
	domElement.id = 'creatorsList'
}

/**
 * init marker UI
 */
AppUI.prototype._initMarkerUI = function () {
	var _this = this
	document.querySelector('#checkboxMarkerHelpers input').addEventListener('change', function(){
		var domElement = document.querySelector('#checkboxMarkerHelpers input')
		var newVisible = domElement.checked === true ? true : false
		window.arAnchor.markersArea.setSubMarkersVisibility(newVisible)
	})


	document.querySelector('#buttonResetMultiMarker').addEventListener('click', function(){
		THREEx.ArMultiMarkerUtils.storeDefaultMultiMarkerFile(_this._app.trackingBackend)
		location.reload()
	})

	// honor #selecttrackingBackend select
	document.querySelector('#selectTrackingBackend select').addEventListener('change', function(){
		var trackingBackend = this.options[this.selectedIndex].value
		THREEx.ArMultiMarkerUtils.storeDefaultMultiMarkerFile(trackingBackend)
		location.reload()
	})
	document.querySelector('#selectTrackingBackend select').value = this._app.trackingBackend


	document.querySelector('#buttonLearnMultiMarker').addEventListener('click', function(){
		var learnerURL = THREEx.ArToolkitContext.baseURL + 'examples/multi-markers/examples/learner.html'
		THREEx.ArMultiMarkerUtils.navigateToLearnerPage(learnerURL, _this._app.trackingBackend)
	})	
};
