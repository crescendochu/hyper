function UIAutoHide(){
	var _this = this

	this.enabled = true
	// this.enabled = false
	
	// init a update loop
	this._onUpdateFcts = []
	this.update = function(delta){
		_this._onUpdateFcts.forEach(function(onUpdateFct){
			onUpdateFct(delta)
		})
	}
	
	this._fadingDirection = null

	_this._actionDetected()

	// bind mouse events
	document.body.addEventListener('mousemove', function(){ _this._actionDetected() })
	document.body.addEventListener('mouseup', function(){ _this._actionDetected() })
	document.body.addEventListener('mousedown', function(){ _this._actionDetected() })
	// bind touch events
	document.body.addEventListener('touchmove', function(){ _this._actionDetected() })
	document.body.addEventListener('touchstart', function(){ _this._actionDetected() })
	document.body.addEventListener('touchend', function(){ _this._actionDetected() })
}

UIAutoHide.prototype._actionDetected = (function(){
	var timerId = null
	
	
	return function(){
		var _this = this

		clearTimeout(timerId)
		timerId = null

		if( _this.enabled === false )	return

		var currentOpacity = this.getOpacity()
		if( currentOpacity < 1 && _this._fadingDirection !== 'in' ){
			this.startFading('in', 0.3)
			return
		}

		timerId = setTimeout(function(){
			_this.startFading('out', 1)
		}, 2 * 1000)
	}	
})()	

UIAutoHide.prototype.startFading = function (fadingDirection, delaySeconds) {
	var _this = this
	// console.log('startFading', fadingDirection, '- seconds', delaySeconds)
	// sanity check
	console.assert(fadingDirection === 'out' || fadingDirection === 'in')
	// handle default arguments
	delaySeconds !== undefined ? delaySeconds : 0.3
	
	this._fadingDirection = fadingDirection

	var currentOpacity = this.getOpacity()

	// if fading would result in current state, do nothing
	if( fadingDirection === 'out' && currentOpacity !== 1 )	return
	if( fadingDirection === 'in' && currentOpacity !== 0 )	return
	if(_this._onUpdateFcts.length !== 0 )return

	this._onUpdateFcts.push(onUpdate)
	onUpdate(1/60)
	return
	
	function onUpdate(delta){
		// update current opacity
		currentOpacity += delta * 1/delaySeconds * (_this._fadingDirection === 'out' ? -1 : 1)
// console.log(currentOpacity, _this._fadingDirection)
		// handle the end of the fading
		if( (_this._fadingDirection === 'out' && currentOpacity < 0) || (_this._fadingDirection === 'in' && currentOpacity > 1) ){
			
			// set currentOpacity to the exact end-value
			currentOpacity = _this._fadingDirection === 'out' ? 0 : 1

			_this._fadingDirection = null

			// remove onUpdate from update loop
			_this._onUpdateFcts.splice(_this._onUpdateFcts.indexOf(onUpdate), 1)
		}
		
		// actually set opacity
		_this.setOpacity(currentOpacity)
	}
};


//////////////////////////////////////////////////////////////////////////////
//		get/set UI opacity
//////////////////////////////////////////////////////////////////////////////

UIAutoHide.prototype.getOpacity = function () {
	var valueStr = document.querySelector('#optionsMenu').style.opacity
	var opacity = valueStr === '' ? 1 : parseInt(valueStr)
	return opacity
}

UIAutoHide.prototype.setOpacity = function (opacity) {
	// console.log('setOpacity', opacity)
	var cssSelectors = [
		'#areaMenu',
		'#optionsMenu',
		'#objectList',
		'#creatorsList',
	]
	cssSelectors.forEach(function(cssSelector){
		var domElement = document.querySelector(cssSelector)
		domElement.style.opacity = opacity
		domElement.style.visibility = (opacity === 0 ? 'hidden' : 'visible')
	})
};
