/**
 * 
 */

node = function(str){
	var oThis = this;
	this.val = str;

	this.ancestor = null; // ancestor

	this.children = []; // left child

	return oThis;
}

node.prototype.isFull = function(){
	if (this === null)
		return null;
	switch (this.val) {
		case "+":
		case "-":
		case "*":
		case "/":
		case "^":
			return (this.children.length === 2);
		case "sqrt":
		case "sin":
		case "cos":
		case "tan":
		case "log":
		case "(":
			return (this.children.length === 1);
	}
	return true;
}

node.prototype.getDepth = function(){
	if (this.children.length === 0)
		return 1;
	var d = 1;
	for ( var child in this.children) {
		d = Math.max(d, this.children[child].getDepth());
	}
	return d + 1;
}
node.prototype.getWidth = function(){
	if (this.children.length === 0)
		return 1;
	var childCount = this.children.length;
	var w = childCount - 1;
	for (var i = 0; i < childCount; i++) {
		w += this.children[i].getWidth();
	}
	return w;
}

node.prototype.setAncestor = function(node){
	this.ancestor = node;
}

node.prototype.addChild = function(node){
	this.children.push(node);
	node.setAncestor(this);
}

node.prototype.insertChild = function(node){
	if (this.isFull()) {

		var lastChild = this.children.pop();

		this.addChild(node);
		node.addChild(lastChild);
	} else {
		this.addChild(node);
	}
}
/*
 * order of piority: number: top Infinity + , - : 0 - less piority * , / : 1
 * sqrt,sin, max, min : 2
 */
node.prototype.order = function(){
	var value = this.val;
	if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
		return Infinity;
	switch (value) {
		case "$":
			return 0;
		case "+":
		case "-":
			return 0.5;
		case "*":
			return 1;
		case "/":
			return 1.1;
		case "sqrt":
		case "sin":
		case "cos":
		case "tan":
		case "log":
		case "^":
			return 2;
		case "pi":
			return Infinity;
		default:
			return null;
	}
}
node.prototype.isLess = function(node){// true if this < node (piority)
	return (node.order() > this.order());
}

node.prototype.getOpenBracket = function(node,bType){
	if (node === null)
		return null;
	var current = this;
	if (bType === undefined) {
		bType = "(";
	}

	while (current !== null) {
		if (current.val === bType) {
			break;
		}
		if (current.ancestor === null) {
			break;
		}
		current = current.ancestor;
	}
	if (current === null)
		return null;
	if (current.val === bType)
		return current.children[0];
}

node.prototype.compute = function(){
	var value = 0;
	if (this.order() === Infinity)
		return (this.val === "pi") ? (Math.PI) : Number(this.val);

	switch (this.val) {
		case "-":
			value = this.children[0].compute() - (this.children[1].compute());
			break;
		case "+":
			value = this.children[0].compute() + this.children[1].compute();
			break;
		case "*":
			value = this.children[0].compute() * this.children[1].compute();
			break;
		case "/":
			value = this.children[0].compute() / this.children[1].compute();
			break;
		case "^":
			value = Math.pow(this.children[0].compute(), this.children[1].compute());
			break;
		case "sqrt":
		case "sin":
		case "cos":
		case "tan":
		case "log":
			value = Math[this.val](this.children[0].compute());
			break;
		case "(":
		case "$":
			value = this.children[0].compute();
			break;
		case "pi":
			value = Math.PI;
			break;
	}

	// this.val = value;
	// this.children[0].length = 0;
	return value;
}
function buildTreeRecursive(arr){
	if (arr.length === 0)
		return null;
	var tree = new node("$"), next = null, current = tree;
	var temp = "";

	function getNextNode(){
		var subArr = [];
		subArr.push(temp);
		var b = 1; // bracket count
		while (b > 0) {
			temp = arr.shift();
			subArr.push(temp);
			if (temp == "(") {
				b++;
			}
			if (temp == ")") {
				b--
			}
		}
		return subArr;
	}

	while (arr.length !== 0) {
		temp = arr.push();
		switch (temp) {
			case "*":

		}
	}
}
function buildTree(arr){
	var n = arr.length;
	if (n <= 0)
		return null;

	var i = 0, next = null, tree = new node("0"), current = tree;
	var bracketCount = (arr[0] === "(") ? 1 : 0;
	while (i < n) {
		next = new node(arr[i]);

		if (arr[i] === ")") {
			bracketCount--;
			current = current.getOpenBracket().ancestor;
		} else {
			if (!current.isFull()) {
				if ((arr[i] === "-") && (arr[i - 1] === "(")) {
					current.addChild(new node("0"));
					current.insertChild(next);
				} else
					current.addChild(next);
			} else {
				switch (next.val) {
					case "+":
					case "-":
					case "*":
					case "/":
					case "^":
					case "sqrt":
					case "sin":
					case "cos":
					case "tan":
					case "log":
						while (current.ancestor !== null) {
							current = current.ancestor;

							if (current.isLess(next)) {
								current.insertChild(next);
								break;
							}
						}

						if ((current.ancestor === null) && (next.ancestor !== current)) {
							tree = next;
							next.insertChild(current);
						}
						break;
					case "(":
						bracketCount++;
						break;
				}
			}
			current = next;
		}
		i++;
	}
	return tree;
}

node.prototype.toString = function(){
	var result = "";
	if (this === null)
		return "";
	switch (this.val) {
		case "+":
		case "-":
		case "*":
		case "/":
		case "^":
			result = this.children[0].toString() + this.val + this.children[1].toString();
			break;
		case "sqrt":
		case "sin":
		case "cos":
		case "tan":
		case "log":
			if (this.children[0].val === "(") {
				result = this.val + this.children[0].toString();
			} else {
				result = this.val + "(" + this.children[0].toString() + ")";
			}
			break;
		case "(":
			result = "(" + this.children[0].toString() + ")";
			break;
		case "$":
			result = this.children[0].toString();
			break;
		case "pi":
			result = "pi";
			break;
		default:
			result = this.val;
	}
	return result;
}
node.prototype.consoleLog = function(){
	if (this.children.length === 0) {
		return "";
	}
	var d = this.getDepth();
	var s = Math.pow(2, d - 1);

	var str = "";

	for (var i = 1; i < s; i++) {
		str += " ";
	}
	str += this.val + "\r\n";
}

node.prototype.printTree = function(hideBracket){
	var tree = this;
	if (hideBracket === undefined) {
		hideBracket = true;
	}
	if ((tree.val === "(") && (hideBracket)) {
		tree = tree.children[0];
	}
	var eTree = $("<span/>", {
		"class" : "tree",
	});
	var eNode = $("<span/>", {
		"class" : "node",
	}).appendTo(eTree);
	var eVal = $("<div/>", {
		"class" : "nodeVal",
		"html" : tree.val
	}).appendTo(eNode);

	var childCount = tree.children.length;
	var child = null;
	for (var i = 0; i < childCount; i++) {
		child = tree.children[i].printTree(hideBracket);
		child.appendTo(eTree);
	}
	return eTree;
}

function alignTree(element){
	var left = Infinity;
	var right = 0;
	var children = $(element).children(".tree");
	if (children.length === 0) {
		var obj = {};
		obj.left = $(element).offset().left;
		obj.right = $(element).width() + obj.left;
		$(element).children(".node").css("border", "none");
		return obj;
	}

	if (children.length === 1) {
		var obj = {};
		$.each(children, function(){
			var obj = alignTree(this);
			left = Math.min(obj.left, left);
			right = Math.max(obj.right, right);
		})
		$(element).children(".node").css("border", "none");
	} else {
		$.each(children, function(){
			var obj = alignTree(this);
			left = Math.min(obj.left + $(this).children().first().width() / 2, left);
			right = Math.max(obj.right - $(this).children().first().width() / 2, right);
		})
	}
	$(element).children(".node").offset({
		"left" : left + 10
	}).width(right - left - 10);
	return {
		left : left,
		right : right
	};
}
