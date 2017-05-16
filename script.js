var initailState;
onload = function(){
	setInterpolations(); // read the interpolation once the page loaded
};

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

	zone.run(()=>{
		console.log(interpolatedElements);
	});
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