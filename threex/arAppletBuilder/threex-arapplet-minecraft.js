//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.ARAppletBuilder.Minecraft = function (skinUrl, headAnimName, bodyAnimName) {
	// default parameters
	headAnimName = headAnimName !== undefined ? headAnimName : 'yes'
	bodyAnimName = bodyAnimName !== undefined ? bodyAnimName : 'hiwave'
	skinUrl = skinUrl !== undefined ? skinUrl : THREEx.MinecraftChar.baseUrl + "images/jetienne.png"


	var arApplet = new THREE.Group
	// support a renderLoop in this object3d userdata
	var onRenderFcts = arApplet.userData.onRenderFcts = arApplet.userData.onRenderFcts || []

	var character	= new THREEx.MinecraftChar()
	arApplet.add(character.root)
	
	character.loadSkin(skinUrl)


	var headAnims	= new THREEx.MinecraftCharHeadAnimations(character);
	headAnims.start(headAnimName);
	onRenderFcts.push(function(delta){
		headAnims.update(delta)	
	})


	// init bodyAnims
	var bodyAnims	= new THREEx.MinecraftCharBodyAnimations(character);
	bodyAnims.start(bodyAnimName);
	onRenderFcts.push(function(delta){
		bodyAnims.update(delta)	
	})	
	
	var shadowMesh = createShadowMesh()
	shadowMesh.position.y = 0.05	// z-fighting
	// character.root.add(shadowMesh)

	return arApplet
	
	function createShadowMesh(){
		// create texture
		var canvas = document.createElement( 'canvas' );
		canvas.width = 128;
		canvas.height = 128;
		var texture = new THREE.Texture( canvas );
		texture.needsUpdate = true
		// draw on texture
		var context = canvas.getContext( '2d' );
		var gradient = context.createRadialGradient(
			canvas.width / 2,
			canvas.height / 2,
			0,
			canvas.width / 2,
			canvas.height / 2,
			canvas.width / 2
		);
		gradient.addColorStop( 0.2, 'rgba(0,0,0,1)' );
		gradient.addColorStop( 0.4, 'rgba(0,0,0,0.8)' );
		gradient.addColorStop( 0.6, 'rgba(0,0,0,0.5)' );
		gradient.addColorStop( 1, 'rgba(30,30,30,0)' );
		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		// build mesh
		var geometry = new THREE.PlaneBufferGeometry( 1, 1, 3, 3 );
		geometry.scale(0.8,0.8,0.8)
		var material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
		});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.rotation.x = - Math.PI / 2;

		return mesh
	}
}
