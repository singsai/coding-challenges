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
		return element
	} else {
		element = parseFloat(element)
		return element
	}	
}

var parseJSON = function(json) {
	var result

	if (json[0] === '[') {
		result = []
	  var element = ''
	  var charsToIgnore = new Set(['[',']',',',' '])
	  
	  for (let i = 0; i < json.length; i++) {
	  	let char = json[i]
	  	if (typeof char === 'string' ) {
	  		if (!charsToIgnore.has(char)) {
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
	} else {
		result = {}
		var element = ''
		var jsonContentInMainObj

		jsonContentInMainObj = json.slice(1, json.length-1)		
		jsonContentInMainObj = jsonContentInMainObj.split(',')

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

  			if (!isNaN(modifiedVal)) {
  				val = maintainPrecision(modifiedVal)
  			}  			

				if (indexOfSecondBracket > -1) {
					var innerKey = modifiedVal.split(':')[0]
					var formattedInnerKey = innerKey.slice(indexOfSecondBracket, innerKey.length)
																					.replace(/["']/g, "").replace(/\s+/g, '')
					var innerVal = modifiedVal.split(':')[1].replace(/["']/g, "").replace(/\s+/g, '')
					var tempObj = {}
					tempObj[formattedInnerKey] = innerVal

					result[modifiedKey] = tempObj
				} else {
					result[modifiedKey] = modifiedVal					
				}
			}			
		}
	}
	return result
}

console.log(
	'STEP 1 is already accounted for in STEP 2.',
	'\nSTEP 2:',
	parseJSON(" [ 10, 20.0, \"hello\", 0.2 ] "),
	'\nSTEP 3:',
	parseJSON("{ \"key\": { \"foo\": \"bar\", \"hello\" : 100 } }"),
	'\nSTEP 4:',
	parseJSON("{ \"foo\": \"bar\", \"hello\" : 100 }")
)