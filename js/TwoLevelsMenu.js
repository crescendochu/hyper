function buildTwoLevelMenu(parameters, onSelect){
	// create container element
	var container = document.createElement('div')
	container.classList.add('menuList')
	container.classList.add('location_'+parameters.location)

	// create root menu
	var rootListElement = initRootMenu()
	container.appendChild(rootListElement)
	
	// create all subMenu
	var subListElements = {}
	Object.keys(parameters.subMenus).forEach(function(subMenuName){
		var subListElement = initSubMenu(subMenuName)
		subListElement.style.display = 'none'
		container.appendChild(subListElement)
		
		subListElements[subMenuName] = subListElement
	})

	// create titleElement
	var titleElement = document.createElement('div')
	titleElement.innerHTML = parameters.title
	titleElement.classList.add('title')
	if( parameters.location === 'bottom' ){
		container.appendChild(titleElement)		
	}else{
		container.insertBefore(titleElement, container.firstChild);				
	}

	// return container element
	return container
	
	function showMenu(subMenuName){
		Array.from(container.querySelectorAll('ul')).forEach(function(domElement){
			domElement.style.display = 'none'
		})
		if( subMenuName !== 'rootMenu' ){
			subListElements[subMenuName].style.display = ''
		}else{
			rootListElement.style.display = ''
		}
	}

	function initRootMenu(){
		var listElement = document.createElement('ul')
		listElement.classList.add('container')
			
		Object.keys(parameters.subMenus).forEach(function(subMenuName){
			// var subMenu = parameters.subMenus[subMenuName]
			var lineElement = document.createElement('li')
			lineElement.innerHTML = subMenuName
			listElement.appendChild(lineElement)
			
			lineElement.addEventListener('click', function(){
				showMenu(subMenuName)
			})
		})
		return listElement
	}
	function initSubMenu(menuLabel){
		var listElement = document.createElement('ul')
		listElement.classList.add('container')
			
		var subMenu = parameters.subMenus[menuLabel]
		Object.keys(subMenu).forEach(function(actionName){
			var lineElement = document.createElement('li')
			lineElement.innerHTML = subMenu[actionName]
			listElement.appendChild(lineElement)
			lineElement.addEventListener('click', function(){
				onSelect(actionName)
			})
		})


		var lineElement = document.createElement('li')
		lineElement.innerHTML = 'Back'
		lineElement.addEventListener('click', function(){
			showMenu('rootMenu')
		})
		if( parameters.location === 'top' ){
			listElement.insertBefore(lineElement, listElement.firstChild);				
		}else{
			listElement.appendChild(lineElement)		
		}


		return listElement
	}
}
