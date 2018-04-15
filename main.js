/*jslint browser: true, devel: false*/

$.fn.xpathEvaluate = function(xpathExpression) {
  $this = this.first();
  // Evaluate xpath and retrieve matching nodes
  xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  result = [];
  while (elem = xpathResult.iterateNext()) {
    result.push(elem);
  }
  $result = jQuery([]).pushStack(result);
  return $result;
}

var rowselect = class {
  constructor() {
    this.i = 1;
    this.max = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr').size();
    this.updateEl();
    this.down();
    // insert input element to copy to clipboard from
    $().add('<input type="text" value="" id="toCopy">').appendTo($(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]'));
    // insert table header "//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[1]"
    $().add('<th>MS Money</th>').appendTo($(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[1]'));
    // add buttons to rows
    $().add('\
      <td class="GridField" style="background-color: #66A182;">\
        <div class="a_btn a_btn-one">\
          <span id="tRow-1" class="tRow">Add</span>\
        </div>\
      </td>\
    ').appendTo($(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[2]'));

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
    var thisEl = this.current_el.get(0);
    var copyText = document.getElementById("toCopy");
    var toCopyValue;
    var theseFields;

    theseFields = thisEl.getElementsByTagName("td");
    toCopyValue = "FromTable|" + theseFields[0].innerText + "|" + theseFields[1].innerText + "|" + theseFields[2].innerText + "|" + theseFields[3].innerText;
    copyText.value = toCopyValue;
    copyText.select();
    document.execCommand("Copy");

    return;
  }
  updateEl() {
    this.prev_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + (
    this.i - 1) + ']');
    this.current_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + this.i.toString() + ']');
    this.next_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + (
    this.i + 1).toString() + ']');
  }
};

var injectCss = function() {
  $("<style>").prop("type", "text/css").html("\
    .a_btn {\
      line-height: 20px;\
      height: 20px;\
      text-align: center;\
      width: 50px;\
      cursor: pointer;\
    }\
    \
    .a_btn-one {\
      color: #FFF;\
      transition: all 0.3s;\
      position: relative;\
    }\
    \
    .a_btn-one span {\
      transition: all 0.3s;\
    }\
    \
    .a_btn-one::before {\
      content: '';\
      position: absolute;\
      bottom: 0;\
      left: 0;\
      width: 100%;\
      height: 100%;\
      z-index: 1;\
      opacity: 0;\
      transition: all 0.3s;\
      border-top-width: 1px;\
      border-bottom-width: 1px;\
      border-top-style: solid;\
      border-bottom-style: solid;\
      border-top-color: rgba(255, 255, 255, 0.5);\
      border-bottom-color: rgba(255, 255, 255, 0.5);\
      transform: scale(0.1, 1);\
    }\
    \
    .a_btn-one:hover span {\
      letter-spacing: 2px;\
    }\
    \
    .a_btn-one:hover::before {\
      opacity: 1;\
      transform: scale(1, 1);\
    }\
    \
    .a_btn-one::after {\
      content: '';\
      position: absolute;\
      bottom: 0;\
      left: 0;\
      width: 100%;\
      height: 100%;\
      z-index: 1;\
      transition: all 0.3s;\
      background-color: rgba(255, 255, 255, 0.1);\
    }\
    \
    .a_btn-one:hover::after {\
      opacity: 0;\
      transform: scale(0.1, 1);\
    }\
    ").appendTo("head");
}

var addClickListeners = function() {
  var btns = document.getElementsByClassName('a_btn');
  btns['0'].addEventListener("click", copyToClipboard, true);
}

var copyToClipboard = function() {
  var elID = this.firstElementChild.getAttribute("id");
  var idArr = elID.split('-')
  var thisID = idArr[idArr.length - 1]

  alert(thisID);
};

// on DOM load
$(function() {
  "use strict";

  var rowSelect = new rowselect();
  injectCss();
  addClickListeners();

  window.addEventListener("keydown", function(event) {
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
