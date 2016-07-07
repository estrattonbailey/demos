(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.Knot=e()}(this,function(){"use strict";var n={};n.extends=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n};var e=function(){function e(n,e){return f[n]=f[n]||[],f[n].push(e),this}function t(n,t){return t._once=!0,e(n,t),this}function r(n){var e=!(arguments.length<=1||void 0===arguments[1])&&arguments[1];return e?f[n].splice(f[n].indexOf(e),1):delete f[n],this}function o(n){for(var e=this,t=arguments.length,o=Array(t>1?t-1:0),i=1;t>i;i++)o[i-1]=arguments[i];var u=f[n]&&f[n].slice();return u&&u.forEach(function(t){t._once&&r(n,t),t.apply(e,o)}),this}var i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],f={};return n.extends({},i,{on:e,once:t,off:r,emit:o})};return e});
},{}],2:[function(require,module,exports){
"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(exports,"__esModule",{value:!0});var _knot=require("knot.js"),_knot2=_interopRequireDefault(_knot),OVER="over",UNDER="under",check=function(t,e,i){var o=!(arguments.length<=3||void 0===arguments[3])&&arguments[3],n=!1;e>=t&&this.position!==OVER?(this.position=OVER,this.emit(this.position,i),n=!0):e<t&&this.position===OVER&&(this.position=UNDER,this.emit(this.position,i),n=!0),o!==!0||n||(this.position=e>=t?OVER:UNDER,this.emit(this.position,i))},watch={scroll:function(t,e,i){var o=e.scrollY||e.pageYOffset;check.call(this,t,o,window,i)},resize:function(t,e,i){var o=e.offsetWidth||e.outerWidth;check.call(this,t,o,e,i)}},proto={update:function(){return watch[this.type].call(this,this.delta,this.target,!0),this},init:function(){return this.handler=watch[this.type].bind(this,this.delta,this.target),window.addEventListener(this.type,this.handler),this},destroy:function(){window.removeEventListener(this.type,this.handler),this.off(OVER),this.off(UNDER)}},create=function(t,e,i){return Object.create((0,_knot2.default)(proto),{type:{value:e},delta:{value:t},position:{value:UNDER,writable:!0},target:{value:i||window}})};exports.default={scroll:function(t){return create(t,"scroll")},resize:function(t,e){return create(t,"resize",e)}};
},{"knot.js":1}],3:[function(require,module,exports){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var _overunder=require("overunder"),_overunder2=_interopRequireDefault(_overunder),resizer1=_overunder2.default.resize(700,document.getElementById("resizer1")),resizer2=_overunder2.default.resize(500,document.getElementById("resizer2")),resizer=_overunder2.default.resize(1e3),scroller=_overunder2.default.scroll(800);resizer1.on("under",function(e){e.classList.remove("is-over")}),resizer1.on("over",function(e){e.classList.add("is-over")}),resizer2.on("under",function(e){e.classList.remove("is-over")}),resizer2.on("over",function(e){e.classList.add("is-over")}),resizer1.init().update(),resizer2.init().update();var resizeView=document.querySelector(".resizer");resizer.on("under",function(){resizeView.innerHTML="Resize: under 1000px"}),resizer.on("over",function(){resizeView.innerHTML="Resize: over 1000px"});var scrollView=document.querySelector(".scroller");scroller.on("under",function(){scrollView.innerHTML="Scroll: under 800px"}),scroller.on("over",function(){scrollView.innerHTML="Scroll: over 800px"}),resizer.init().update(),scroller.init().update();
},{"overunder":2}]},{},[3])


//# sourceMappingURL=index.js.map