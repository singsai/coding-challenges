var maintainPrecision = function(element) {
	var dotIndex = element.indexOf('.')
	var zeroCount = 0
	var dotToEndOfString = element.slice(dotIndex, element.length)
	
	for (var k = 0; k < dotToEndOfString.length; k++) {
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

	if (json[0] === '{') {
		result = {}
		var element = '', colons = []
		var modifiedJson, modifiedJsonArray

		modifiedJson = json.slice(1, json.length-1)		
		modifiedJson = modifiedJson.split(',')

		for (var el = 0; el < modifiedJson.length; el++) {
			for (var k = 0; k < modifiedJson[el].length; k++) {
				// console.log('modifiedJson[el]: ', modifiedJson[el][k])
				var key, val
				var indexOfColon = modifiedJson[el].indexOf(':')

				key = modifiedJson[el].slice(0, indexOfColon)
				val = modifiedJson[el].slice(indexOfColon+1, modifiedJson[el].length)

				var indexOfSecondBracket = val.indexOf('{')

				key = key.replace(/["']/g, "").replace(/\s+/g, '')
				val = val.replace(/["']/g, "").replace(/\s+/g, '').replace('}','')

  			if (!isNaN(val)) {
  				val = maintainPrecision(val)
  			}  			

				if (indexOfSecondBracket > -1) {
					var innerKey = val.split(':')[0]
					var formattedInnerKey = innerKey.slice(indexOfSecondBracket, innerKey.length).replace(/["']/g, "").replace(/\s+/g, '')
					var innerVal = val.split(':')[1].replace(/["']/g, "").replace(/\s+/g, '')
					var tempObj = {}
					tempObj[formattedInnerKey] = innerVal

					result[key] = tempObj
				} else {
					result[key] = val					
				}
			}			
		}
	} else {
		result = []
	  var element = ''
	  for (var i = 0; i < json.length; i++) {
	  	let char = json[i]
	  	if (typeof char === 'string' ) {
	  		if (char !== '[' && 
	  				char !== ']' && 
	  				char !== ',' && 
	  				char !== ' ' ) 
	  		{
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
	'STEP 1 is already accounted for in STEP 2.',
	'\nSTEP 2:',
	parseJSON(" [ 10, 20.0, \"hello\", 0.2 ] "),
	'\nSTEP 3:',
	parseJSON("{ \"key\": { \"foo\": \"bar\", \"hello\" : 100 } }"),
	'\nSTEP 4:',
	parseJSON("{ \"foo\": \"bar\", \"hello\" : 100 }")
)