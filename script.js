var initailState;

// Data //
var model = {
	firstName : "Raed",
	lastName : "Khalaf",
	age : 19,
	// this model has two data sections
	// the first is the actual data
	// the second is the viewed data
	viewed_model : {
		viewed_firstName : "{{firstName}}",
		viewed_lastName : "{{lastName}}",
		viewed_age : "{{age}}"
	}
};

onload = function(){
	setInterpolations(); // read the interpolation once the page loaded
	var event = new Event("onTurnDone");
};


/*
* the method that starts the change detection system
*/
function changeDetectionSystem(interpolatedElements){
	// operate the detection system over all the interpolated elements 
	for (var i = 0; i < interpolatedElements.length; i++) {
		operateChangeSystem(interpolatedElements[i]);
	};
}

/*
* return the interpolation of an element as an array
*/
function getInterpolations(element){
	return Array.from(element.outerHTML.match(/\{\{\w{0,}\}\}/g));
}

/*
* operate the change detection system on each element that has the
*
*/
function operateChangeSystem(element){
	// get the interpolations occured in this element
	var interpolations = getInterpolations(element);
	var changed = false;
	// pass through all the interpolations and check if there is 
	// any change occures
	for (var i = 0; i < interpolations.length; i++) {
		if(checkChanges(extractVariable(interpolations[i]))){
			changed = true;
			break;
		}
	};

	if(changed)// if any change happend
		updateElement(element,interpolations);// update this element
}

/*
* update this element according to the model object
*/
function updateElement(element, interpolations){
	for (var i = 0; i < interpolations.length; i++) {
		var variable = extractVariable(interpolations[i]);
		element.outerHTML = element.outerHTML.replace(interpolations[i],this.model[variable]);
	};
}

/*
* returns the variable name mentioned in the interpolation
*/
function extractVariable(interpolation){
	return interpolation.substring(2,interpolation.length-2);
}

/*
* check if there is any changes between the viewed data and the actual data
*/
function checkChanges(property){
	return (model[property] != model.viewed_model["viewed_"+property]);
}

/*
* read all the interpolation inside the document
* and remember them
*/
function setInterpolations(){
	/*
	* save the root element which is the body
	* to pass the through the DOM tree to remember which 
	* element contains interpolation
	*/
	var rootElement = document.body;

	var interpolatedElements = []; // this array to hold the interpolated Elements 
	var replacedElements = []; // when relacing the elements we want to remember the previouse elements
	
	/*
	* takes:
	* the root element which is the body
	* takes
	*/
	getInterpolateElements(rootElement, interpolatedElements);

	document.addEventListener("onTurnDone", changeDetectionSystem(interpolatedElements));
	//document.dispatchEvent(event);
	console.log(interpolatedElements);
}

/*
* itterate recursivly on the DOM tree and return array that holds
* the elements that contains interpolation
*/
function getInterpolateElements(element, map){
	// itterate the current element children and send them as an argument to this function
	// in order to pass the DOM tree from the bottom up
	for(var i = 0; i < element.children.length ; i++){
		getInterpolateElements(element.children[i],map);
	}

	// see if this element has interpolation brackets
	var matches = element.outerHTML.match(/\{\{\w{0,}\}\}/g);
	var contains = false;
	if(matches){ // if it does have interpolation brackets
		var matchesLength = Array.from(matches).length; // get the number of inpterpolation in this element
		element.setAttribute('numberOfInterpolation', matchesLength);	// set this number as an attribute to this element
		
		/*
		* if the number of interpolation in the children is the same number in the parent 
		* then there is no interpolation in this element
		* otherwise 
		* this element does have interpolation
		* so we need to pass to the children and get the number of interpolation in them
		*/
		var totalChildrenMatches = 0;	
		for(var i = 0 ; i < element.children.length ; i++){
			if(element.children[i].hasAttribute("numberOfInterpolation")){
				totalChildrenMatches += parseInt(element.children[i].getAttribute("numberOfInterpolation"));
			}
		}
		/*
		* check if the number of interpolation is the same in the children
		*/
		if(totalChildrenMatches != matchesLength){
			contains = true;
		}
	}

	/*
	* if this element contains interpolation 
	* then we need to remember it
	*/
	if(contains){
		map.push(element);
	}
}