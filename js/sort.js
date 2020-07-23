/**
 * 
 */
sort = function(arr) {
	var oThis = this;
	this.array = arr;
	return oThis;
}

sort.prototype.display = function(oConfig) {
	if (oConfig === undefined) {
		var oConfig = {};
	}
	var mode = (oConfig.hasOwnProperty("mode")) ? oConfig
			.hasOwnProperty("mode") : "visual";
	var divID = (oConfig.hasOwnProperty("divID")) ? oConfig.divID : "";
	var targetID = (oConfig.hasOwnProperty("targetID")) ? oConfig.targetID
			: "display";
	var newDiv = $("<div/>", {
		"id" : divID
	}).appendTo($("#" + targetID));
	for (var i = 0; i < this.array.length; i++) {
		$("<span/>", {
			"id" : divID + "" + i,
			"class" : "arr",
		}).css("height", (this.array[i] * 3) + "px").appendTo(newDiv);
	}
}

sort.prototype.large = function(a, b) {
	return (this.array[a] > this.array[b]);
}

sort.prototype.exchange = function(i, j) {
	var aux = this.array[i];
	this.array[i] = this.array[j];
	this.array[j] = aux;
}
sort.prototype.insertion = function() {
	var n = this.array.length, min = 0, exchanges = 0;

	for (var i = 1; i < n; i++) {
		min = i;
		for (var j = i; (j > 0) && (this.large(j - 1, j)); j--) {
			this.exchange(j, j - 1);
			exchanges++
		}
		this.display();
	}
	console.log(exchanges);
}

sort.prototype.shell = function() {
	var n = this.array.length, h = 1, scale = 2, exchange = 0;

	while (h < n / scale) {
		h = h * scale + 1;
	}
	while (h >= 1) {
		for (var i = h; i < n; i++) {
			for (var j = i; (j >= h) && (this.large(j - h, j)); j -= h) {
				this.exchange(j, j - h);
				exchange++;
			}
			this.display();
		}
		h = (h - 1) / scale;
	}
	console.log("exchanges: " + exchange);
}

sort.prototype.merge = function() {
	var exchanges = 0, obj = this;
	var start = Date.now();
	function mergeParts(lo, mid, hi) {
		for (var i = mid; i <= hi; i++) {
			// for (var j=i;(j>lo)&&(obj.large(j-1,j));j--){
			// obj.exchange(j,j-1);
			// exchanges++;
			// }
			var j = i - 1;
			while ((j >= lo) && (obj.large(j, i))) {
				j--;
			}
			if (j < i - 1) {
				var temp = obj.array.splice(i, 1)[0];// splice array[i]
				obj.array.splice(j + 1, 0, temp); // put it to array[j]
				exchanges++;
			}
		}
		// obj.display();
	}
	function sort(lo, hi) {

		if (hi <= lo)
			return;

		var mid = Math.floor((lo + hi) / 2);
		sort(lo, mid);
		sort(mid + 1, hi);
		mergeParts(lo, mid, hi);
	}

	sort(0, obj.array.length - 1);
	var end = Date.now();
}

sort.prototype.quick = function() {
	var obj = this,exchanges=0;
	function partition(lo, hi) {
		var pos = lo;
		for (var i = lo+1;i<=hi;i++){
			if (obj.large(pos,i)){
				obj.array.splice(pos,0,obj.array.splice(i,1)[0]);
				exchanges+=i-pos;
				pos++;
			}
		}
		return pos;
	}
	
	function sort(lo,hi){
		if (hi<=lo) return;
		var j=partition(lo,hi);
		sort(lo,j-1);
		sort(j+1,hi);
	
		obj.display();
	}
	
	sort(0,obj.array.length);
	console.log(exchanges);
}