var THREEx = THREEx || {}

// https://github.com/Jam3/three-bmfont-text/issues/18#issuecomment-313918739
// https://codepen.io/mattdesl/pen/eRQvgX/s

THREEx.BmfontText = function(fontURL, textureURL, onReady){
	this.object3d = new THREE.Group()
	this._texture = null
	this._font = null
	this.fontLoaded = false
}

THREEx.BmfontText.baseURL = '../'

/**
 * Load a font and its texture
 * 
 * @param {String} fontURL    - url of the font
 * @param {String} textureURL - url of the texture
 * @param {Function} onLoaded   - callback to call when data is loaded
 * @return {THREEx.BmfontText} for api chainability
 */
THREEx.BmfontText.prototype.loadFont = function (fontURL, textureURL, onLoaded) {
	var _this = this
	var loader = new THREE.TextureLoader();
	loader.crossOrigin = 'Anonymous';
	loader.load( textureURL, function(texture) { 
		texture.anisotropy = 64
		_this._texture = texture
		// load-bmfont is included by wzrd.in
		// however we can also use fetch() API and convert-bmfont CLI tool to use a simpler format
		THREEx.BmfontTextImport.loadBmfont(fontURL, function(error, font){
			if (error) return onError(error);
			_this._font = font
			_this.fontLoaded = true
			
			onLoaded && onLoaded()
		});
	}, onError)
	return this

	function onError (err) {
		alert(err ? err.message : 'Error loading texture/font!');
	}	
};


//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////


/**
 * create text mesh
 * @param {Object} geometryParameters - parameters of threeBmfontText
 * @return {THREE.Object3D} - the created mesh
 */
THREEx.BmfontText.prototype.createTextMesh = function (geometryParameters) {
	// default parameters
	geometryParameters.font = geometryParameters.font || this._font
	geometryParameters.flipY = geometryParameters.flipY || this._texture.flipY

	// build the text geometry
	var geometry = THREEx.BmfontTextImport.threeBmfontText(geometryParameters);

	// build the material
	var material = new THREE.ShaderMaterial({
		transparent: true,
		side: THREE.DoubleSide,
		uniforms: {
			texture: { type: 't', value: this._texture },
			color: { type: 'c', value: new THREE.Color('orange') }
		},
		extensions: {
			derivatives: true
		},
		vertexShader: `
			varying vec2 vUv;
			void main () {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			varying vec2 vUv;
			uniform sampler2D texture;
			uniform vec3 color;
			
			float aastep (float value) {
				float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
				return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);
			}
			
			void main () {
				float d = texture2D(texture, vUv).a;
				float alpha = aastep(d);
				gl_FragColor = vec4(color, alpha);
				// gl_FragColor = vec4(0,0,0,1);
			}
		`,
	});

	// build actual mesh
	var textMesh = new THREE.Mesh(geometry, material);
	geometry.computeBoundingBox()
	var boundingBoxSize = geometry.boundingBox.getSize()
	textMesh.position.x = -boundingBoxSize.x/2
	textMesh.position.z = -boundingBoxSize.y/2
	
	// build container
	var container = new THREE.Group()
	container.add(textMesh)
	container.rotateX(-Math.PI/2)
	container.scale.set(1,-1,1).multiplyScalar(1/boundingBoxSize.y);	
	
	// return container
	return container
};
