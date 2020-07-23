/**
 * 
 */
function getVal(str) {
	var aOperators = [], aOperands = [], aString = str.split("");

//	if (aString[aString.length-1]!==" ")		{aString.push(")");aString.push(" ");}
	
	console.log(aString);
	var tempStr;

	function readString() {
		var tempStr = "", tempChar = "";
		while (aString.length > 0) {
			tempChar = aString.shift();
			if ((tempChar === " ") || (aString.length === 0)) {
				return tempStr;
			}
			tempStr += tempChar;
		}
		return ")";
	}
	function compute(op){
		if (op===undefined){var op = aOperators.pop();} // get new operator
		var v = aOperands.pop(); // get first operand
		switch (op) {
		case "+":
			v = aOperands.pop() - (-v);
			break;
		case "-":
			v = aOperands.pop() - v;
			break;
		case "*":
			v = aOperands.pop() * v;
			break;
		case "/":
			v = aOperands.pop() / v;
			break;
		case "sqrt":
			v = Math.sqrt(v);
			break;
		}
		aOperands.push(v);
		console.log(aOperands);
	}
	while (aString.length > 0) {
		// read string
		tempStr = readString();

		switch (tempStr) {
		case "(":
		case "":
			break;
		case "+":
		case "-":
		case "*":
		case "/":
		case "sqrt":
			aOperators.push(tempStr); // push new operator
			break;
		case ")":
			compute();
			break;
		default:
			aOperands.push(parseFloat(tempStr));
			break;
		}
	}
	compute();
	return aOperands.pop();
}