/**
 * 
 */
bNode = function(key) {
	var o = this;
	this.val = key;

	this.left = null;
	this.right = null;
	
	this.size = 1;

	return o;
}
function search(bNode, key) {
	if (bNode == null) {
		return false;
	}

	var x = bNode;

	while (x != null) {
		if (x.val < key) {
			x = x.right;
		} else if (x.val > key) {
			x = x.left;
		} else if (x.val === key) {
			return true;
		}
	}
	return false;
}

bNode.prototype.addChild = function(node) {
	if ((this.val > node.val) && (this.left == null)) {
		this.left = node;
		return true;
	}
	if ((this.val < node.val) && (this.right == null)) {
		this.right = node;
		return true;
	}
	return false;
}

bNode.prototype.balanceInsert = function(key){
	var tree = this;

	var x = tree, y = null;
	var path=[];
	
	if (tree.val<key){
		var leftSize = (tree.left===null)?0:tree.left.size;
		var rightSize = (tree.left===null)?0:tree.right.size;
	}

	if (search(tree, key) === false) {
		while (x != null) {
			y = x;
			path.push(x);
			if (x.val < key) {
				x = x.right;
			} else if (x.val > key) {
				x = x.left;
			}
		}
		x = new bNode(key);
		y.addChild(x);
		for (var z in path){
			path[z].size+=1;
		}
	}
	return tree;
}
bNode.prototype.insertKey = function(key) {
	var tree = this;

	var x = tree, y = null;
	var path=[];

	if (search(tree, key) === false) {
		while (x != null) {
			y = x;
			path.push(x);
			if (x.val < key) {
				x = x.right;
			} else if (x.val > key) {
				x = x.left;
			}
		}
		x = new bNode(key);
		y.addChild(x);
		for (var z in path){
			path[z].size+=1;
		}
	}
	return tree;
}
function buildBST(arr) {
	if (arr.length === 0) {
		return null;
	}

	var tree = new bNode(arr.shift());
	while (arr.length > 0) {
		tree.insertKey(arr.shift());
		console.log(tree);
	}
	return tree;
}

printTree = function(tree) {
	var eTree = $("<span/>", {
		"class" : "tree",
	});
	var eNode = $("<span/>", {
		"class" : "node",
	}).appendTo(eTree);
	var eVal = $("<div/>", {
		"class" : "nodeVal",
		"html":(tree===null)?"null":tree.val+":"+tree.size
	}).appendTo(eNode);
	

	if (tree != null) {
		printTree(tree.left).appendTo(eTree);
		printTree(tree.right).appendTo(eTree);
	}
	return eTree;
}