var AppShare = function(app){
	this._app = app
	var _this = this

	// loop until gapi.client is setup, then load urlshortener
	var timerId = setInterval(function(){
		if( window.gapi === undefined || gapi.client === undefined )	return
		clearInterval(timerId)
		timerId = null
		// setup apikey + load urlshortener
		gapi.client.setApiKey('AIzaSyDehQAfFZ9COHDLsvg8tIv7m4I4ySIc0e4');
		gapi.client.load('urlshortener', 'v1', function() { 
			console.log('urlshortener loaded')
		})
	}, 1000/10)		


	//////////////////////////////////////////////////////////////////////////////
	//		init ui
	//////////////////////////////////////////////////////////////////////////////
	document.querySelector('#exportURLToClipboard').addEventListener('click', function(){
		_this._buildShareURL(function(shareURL){
			console.log('shareURL', shareURL)
			var win = window.open(shareURL, '_blank');
			if (win) win.focus()
			// // FIXME this requires a trusted-event. but the url shortening make it async
			// // - how to fix that. do a popup with only the url, and another step to copy
			var inputElement = document.createElement('input')
			inputElement.style.zIndex = 99
			document.body.appendChild(inputElement)
			inputElement.value = shareURL
			inputElement.focus();
			inputElement.select();
    			document.execCommand('copy');
		})
	})
	// document.querySelector('#exportURLToTwitter').addEventListener('click', function(){
	// 	_this._buildShareURL(function(shareURL){
	// 		var twitterIntentURL = 'https://twitter.com/intent/tweet'
	// 			+'?text='+ encodeURIComponent('Just created this AR with webar-playground - ')
	// 			+'&url=' + encodeURIComponent(shareURL)
	// 		var win = window.open(twitterIntentURL, '_blank');
	// 		if (win) win.focus()
	// 	})
	// })
	// document.querySelector('#exportURLToFacebook').addEventListener('click', function(){
	// 	_this._buildShareURL(function(shareURL){
	// 		var facebookIntentURL = 'https://www.facebook.com/sharer.php'
	// 			+'?u='+ encodeURIComponent(shareURL)
	// 		var win = window.open(facebookIntentURL, '_blank');
	// 		if (win) win.focus()
	// 	})
	// })
};

AppShare.prototype._buildShareURL = function (callback) {
	var contentURL = this._app.getContentURL()
	var augmentedWebsiteBaseURL = 'https://webxr.io/augmented-website/'
	var shareURL = augmentedWebsiteBaseURL + '?' + contentURL
	console.log('contentURL', contentURL)
	console.log('shareURL', shareURL)
	// this._minifyURL(shareURL, function onComplete(shortURL){
	// 	console.log('short shareURL', shortURL)
	// 	callback(shortURL)
	// })
    // var win = window.open(contentURL, '_blank');
	// 		if (win) win.focus()
    var inputElement = document.createElement('input')
			inputElement.style.zIndex = 99
            inputElement.style.width = 10
			document.body.appendChild(inputElement)
			inputElement.value = contentURL
			inputElement.focus();
			inputElement.select();
    			document.execCommand('copy');	
};

// AppShare.prototype._minifyURL = function (longURL, onComplete) {
// 	if( gapi.client === undefined || gapi.client.urlshortener === undefined ){
// 		console.error('goo.gl server not yet initialized, bailing out')			
// 		return
// 	}

// 	var request = gapi.client.urlshortener.url.insert({
// 		'resource': {
// 			'longUrl': longURL
// 		}
// 	});
// 	request.execute(function(response) {
// 		var shortURL = response.id
// 		if (response.id != null) {
// 			onComplete(shortURL)
// 		}else{
// 			onComplete(longURL)
// 			console.error("Error: creating short url", response.error);
// 		}
// 	});	
// };
