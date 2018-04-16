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
    this.index = 1;
    this.max = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr').size();
    this.updateEl();
    this.down();
    // insert input element to copy to clipboard from
    $().add('<input type="text" value="" id="toCopy">').appendTo($(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]'));
    // insert table header "//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[1]"
    $().add('<th>MS Money</th>').appendTo($(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[1]'));
    // add buttons to rows
    for (var i = 2; i <= this.max; i++) {
      $().add('\
        <td class="GridField" style="background-color: #66A182;">\
          <div class="a_btn a_btn-one">\
            <span id="tRow-' + (
      i - 1).toString() + '" class="tRow">Add</span>\
          </div>\
        </td>\
      ').appendTo($(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + i.toString() + ']'));
    }
    this.addClickListeners();
  }
  down() {
    if (this.index < this.max) {
      this.index += 1;
      this.current_el.css('border', '');
      this.next_el.css('border', 'medium dashed blue');
      this.updateEl();
    }

    return;
  }
  up() {
    if (this.index > 1) {
      this.index -= 1;
      this.current_el.css('border', '');
      this.prev_el.css('border', 'medium dashed blue');
      this.updateEl();
    }

    return;
  }
  right() {
    var thisEl = this.current_el.get(0);
    copyRowData(thisEl)

    return;
  }
  updateEl() {
    this.prev_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + (
    this.index - 1) + ']');
    this.current_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + this.index.toString() + ']');
    this.next_el = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + (
    this.index + 1).toString() + ']');
  }
  addClickListeners() {
    var btns = document.getElementsByClassName('a_btn');
    var i = 0
    for (i = 0; i <= btns.length - 1; i++) {
      btns[i].addEventListener("click", this.addBtnClick, false);
    }
  }
  addBtnClick(event) {
    var elID = this.firstElementChild.getAttribute("id");
    var idArr = elID.split('-')
    var thisID = idArr[idArr.length - 1]

    var elToCopy = $(document).xpathEvaluate('//*[@id="body_rightcolumn"]/div[6]/table/tbody/tr[' + (
    Number(thisID) + 1) + ']');
    copyRowData(elToCopy.get(0));
  }
};

var copyRowData = function(thisEl) {
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

var injectCss = function() {
  // adapted from https://codepen.io/rauldronca/pen/mEXomp
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

// on DOM load
$(function() {
  "use strict";

  injectCss();
  var rowSelect = new rowselect();

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
