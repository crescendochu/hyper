var THREEx = THREEx || {}

THREEx.ARAppletBuilder = function(camera, videoElement){
	this.camera = camera
	this.videoElement = videoElement
	
	this.downloadsCount = 0

	THREEx.MinecraftChar.baseUrl = THREEx.ARAppletBuilder.baseURL + '../threex.minecraft/'	
	THREEx.BmfontText.baseURL = THREEx.ARAppletBuilder.baseURL + '../threex-bmfonttext/'	
}

THREEx.ARAppletBuilder.baseURL = '../'
THREEx.ARAppletBuilder.nameToLabel = {}
THREEx.ARAppletBuilder.nameToBuilderFct = {};

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ARAppletBuilder.register = function(appletName, appletLabel, builderFct){
	console.assert(THREEx.ARAppletBuilder.nameToLabel[appletName] === undefined )
	console.assert(THREEx.ARAppletBuilder.nameToBuilderFct[appletName] === undefined )

	THREEx.ARAppletBuilder.nameToLabel[appletName] = appletLabel
	THREEx.ARAppletBuilder.nameToBuilderFct[appletName] = builderFct
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////


THREEx.ARAppletBuilder.prototype.createApplet = function (appletName) {
	var arApplet = null

	if( THREEx.ARAppletBuilder.nameToBuilderFct[appletName] !== undefined ){
		var builderFct = THREEx.ARAppletBuilder.nameToBuilderFct[appletName] 
		arApplet = builderFct(this)
	}else{
		console.assert(false)
	}
	arApplet.userData.sceneType = appletName
	return arApplet
}
