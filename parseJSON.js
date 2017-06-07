// This function make sure 20.0 or 20.00 doesn't become 20 after parseFloat
var maintainPrecision = function(element) {
	var dotIndex = element.indexOf('.')
	var zeroCount = 0
	var dotToEndOfString = element.slice(dotIndex, element.length)
	
	for (let k = 0; k < dotToEndOfString.length; k++) {
		if (dotToEndOfString[k]==='0') {
			zeroCount++
		}
	}
	if (dotIndex > -1 && zeroCount > 0) {
		element = parseFloat(element).toFixed(zeroCount)			
	} else {		
		element = parseFloat(element)		
	}	
	return element
}

var parseJSON = function(json) {
	var result

	// json is an object
	if (json[0] === '{') {
		result = {}
		var element = ''
		var jsonContentInMainObj

		jsonContentInMainObj = json.slice(1, json.length-1).split(',')		

		for (let el = 0; el < jsonContentInMainObj.length; el++) {
			var currentElement = jsonContentInMainObj[el]

			for (let k = 0; k < currentElement.length; k++) {
				var key, val
				var indexOfColon = currentElement.indexOf(':')

				key = currentElement.slice(0, indexOfColon)
				val = currentElement.slice(indexOfColon+1, currentElement.length)

				var indexOfSecondBracket = val.indexOf('{')

				var modifiedKey, modifiedVal

				modifiedKey = key.replace(/["']/g, "").replace(/\s+/g, '')
				modifiedVal = val.replace(/["']/g, "").replace(/\s+/g, '').replace('}','')

  			// Account for nested objects
				if (indexOfSecondBracket > -1) {
					var innerKey = modifiedVal.split(':')[0]
					var formattedInnerKey = innerKey.slice(indexOfSecondBracket, innerKey.length)
																					.replace(/["']/g, "").replace(/\s+/g, '')
					var innerVal = modifiedVal.split(':')[1].replace(/["']/g, "").replace(/\s+/g, '')
					var innerObj = {}
					innerObj[formattedInnerKey] = innerVal

					result[modifiedKey] = innerObj
					
					// there is no nested object
				} else {
					result[modifiedKey] = modifiedVal					
				}
			}			
		}
	// json is an array
	} else { 
		result = []
	  var element = ''
	  var ignoredCharacters = new Set(['[', ']', ',', ' '])

	  for (let i = 0; i < json.length; i++) {
	  	let char = json[i]
	  	if (typeof char === 'string' ) {
	  		if (!ignoredCharacters.has(char)) {
	  			element+=char
	  		} else {
	  			if (element !== '') {
		  			if (!isNaN(element)) {
		  				result.push(maintainPrecision(element))
		  			} else {
		  				result.push(element.replace('"', '').replace('"', ''))	
		  			}  					  				
	  				element = ''
	  			}
	  			continue
	  		}
	  	}
	  }		
	}
	return result
}

console.log(
	'First Step :',
	parseJSON(" [ 10 , 20.0, 0.2 ] "),
	'\nSecond Step:',
	parseJSON(" [ 10, 20.0, \"hello\", 0.2 ] "),
	'\nThird Step: ',
	parseJSON("{ \"key\": { \"foo\": \"bar\", \"hello\" : 100 } }"),
	'\nFourth Step:',
	parseJSON("{ \"foo\": \"bar\", \"hello\" : 100 }")
)