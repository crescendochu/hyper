function ContentLocalStorage(){
	this._key = 'webar-playground-content'
	this._minDelay = 0.25*1000
	this._timerID = null
	this._lastContent = null
}

ContentLocalStorage.prototype.getContent = function(){
	var contentString = localStorage.getItem(this._key)
	if( contentString === null )	return null
	var content = JSON.parse(contentString)
	return content
}
ContentLocalStorage.prototype.hasContent = function(){
	return this.getContent() !== null
}

ContentLocalStorage.prototype.clearStorage = function(){
	localStorage.removeItem(this._key)
}

ContentLocalStorage.prototype.isSaved = function(){
	return this._timerId === null ? true : false
}

ContentLocalStorage.prototype.onContentChange = function(newContent){
	var _this = this
	// update _lastContent
	this._lastContent = newContent
	// update hash IIF not been modified for 0.25 second
	clearTimeout(this._timerId)
	this._timerId = setTimeout(function(){
		// actually update the hash
		localStorage.setItem(_this._key, JSON.stringify(_this._lastContent))

		_this._timerId = null
		_this._lastContent = null			
	}, this._minDelay)
}
