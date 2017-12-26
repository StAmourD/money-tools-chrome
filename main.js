/*jslint browser: true, devel: false*/

$.fn.xpathEvaluate = function (xpathExpression) {	
   $this = this.first();
   // Evaluate xpath and retrieve matching nodes
   xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
   result = [];
   while (elem = xpathResult.iterateNext()) {
	  result.push(elem);
   }
   $result = jQuery([]).pushStack( result );
   return $result;
}

var rowselect = class {
	constructor() {
		this.i = 1;
		this.max = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr').size();
		this.updateEl();
		this.down();
		// insert input element to copy to clipboard from
		$().add('<input type="text" value="Hey World!" id="toCopy">').appendTo( $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]') );
	}
	down() {
		if (this.i < this.max) {
			this.i += 1;
			this.current_el.css('border', '');
			this.next_el.css('border', 'medium dashed blue');
			this.updateEl();
		}
		
		return;
	}
	up() {
		if (this.i > 1) {
			this.i -= 1;
			this.current_el.css('border', '');
			this.prev_el.css('border', 'medium dashed blue');
			this.updateEl();
		}
		
		return;
	}
	right() {
		var thisEl = this.current_el.get( 0 );
		var copyText = document.getElementById("toCopy");
		var toCopyValue;
		var theseFields;

		theseFields = thisEl.getElementsByTagName("td");
		toCopyValue = "FromTable|" + theseFields[0].innerText + "|"
			+ theseFields[1].innerText + "|"
			+ theseFields[2].innerText + "|"
			+ theseFields[3].innerText;
		copyText.value = toCopyValue;
		copyText.select();
		document.execCommand("Copy");
		
		return;
	}
	updateEl(){
		this.prev_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + (this.i - 1 ) + ']');
		this.current_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + this.i.toString() + ']');
		this.next_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + (this.i + 1 ).toString() + ']');
	}
};

// on DOM load
$(function () {
    "use strict";
	
	var rowSelect = new rowselect();
	
	window.addEventListener("keydown", function (event) {
	  if (event.defaultPrevented) {
		return; // Do nothing if the event was already processed
	  }
	  if (event.altKey) {		  
		  switch (event.key) {
			case "ArrowDown":
			  rowSelect.down();
			  event.preventDefault();
			  break;
			case "ArrowUp":
			  rowSelect.up();
			  event.preventDefault();
			  break;
			case "ArrowRight":
			  rowSelect.right();
			  event.preventDefault();
			  break; 
		  }
	  }

	}, true);
});
