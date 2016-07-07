(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _overunder = require('../../overunder/');

var _overunder2 = _interopRequireDefault(_overunder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resizer1 = _overunder2.default.resize(700, document.getElementById('resizer1'));
var resizer2 = _overunder2.default.resize(500, document.getElementById('resizer2'));

var resizer = _overunder2.default.resize(1000);
var scroller = _overunder2.default.scroll(800);

resizer1.on('under', function (el) {
  el.classList.remove('is-over');
});
resizer1.on('over', function (el) {
  el.classList.add('is-over');
});

resizer2.on('under', function (el) {
  el.classList.remove('is-over');
});
resizer2.on('over', function (el) {
  el.classList.add('is-over');
});

resizer1.init().update();
resizer2.init().update();

var resizeView = document.querySelector('.resizer');

resizer.on('under', function () {
  resizeView.innerHTML = 'Resize: under 1000px';
});
resizer.on('over', function () {
  resizeView.innerHTML = 'Resize: over 1000px';
});

var scrollView = document.querySelector('.scroller');

scroller.on('under', function () {
  scrollView.innerHTML = 'Scroll: under 800px';
});
scroller.on('over', function () {
  scrollView.innerHTML = 'Scroll: over 800px';
});

resizer.init().update();
scroller.init().update();

},{"../../overunder/":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _knot = require('knot.js');

var _knot2 = _interopRequireDefault(_knot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OVER = 'over';
var UNDER = 'under';

/**
 * Compare a variable value i.e. scrollY with
 * the user-passed delta value.
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {integer} compare window.scrollY/outerWidth
 * @param {boolean} update Force an update of this.position
 */
var check = function check(delta, compare, target) {
  var update = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  var triggered = false;

  if (compare >= delta && this.position !== OVER) {
    this.position = OVER;
    this.emit(this.position, target);
    triggered = true;
  } else if (compare < delta && this.position === OVER) {
    this.position = UNDER;
    this.emit(this.position, target);
    triggered = true;
  }

  if (update === true && !triggered) {
    this.position = compare >= delta ? OVER : UNDER;
    this.emit(this.position, target);
  }
};

/**
 * Namespace for scroll/resize handlers
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {boolean} update Force an update of this.position
 */
var watch = {
  scroll: function scroll(delta, target, update) {
    check.call(this, delta, window.scrollY, window, update);
  },
  resize: function resize(delta, target, update) {
    var compare = target.offsetWidth || target.outerWidth;
    check.call(this, delta, compare, target, update);
  }
};

/**
 * Public prototype methods that will be attached
 * to the return value of create()
 */
var proto = {
  update: function update() {
    watch[this.type].call(this, this.delta, this.target, true);
    return this;
  },
  init: function init() {
    this.handler = watch[this.type].bind(this, this.delta, this.target);
    window.addEventListener(this.type, this.handler);
    return this;
  },
  destroy: function destroy() {
    window.removeEventListener(this.type, this.handler);
    this.off(OVER);
    this.off(UNDER);
  }
};

/**
 * Create instance with user-passed
 * values and prototypes
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {string} type Either scroll or resize
 */
var create = function create(delta, type, target) {
  return Object.create((0, _knot2.default)(proto), {
    type: {
      value: type
    },
    delta: {
      value: delta
    },
    position: {
      value: UNDER,
      writable: true
    },
    target: {
      value: target || window
    }
  });
};

/**
 * @param {integer} delta Scroll/resize limit in pixels
 */
exports.default = {
  scroll: function scroll(delta) {
    return create(delta, 'scroll');
  },
  resize: function resize(delta, target) {
    return create(delta, 'resize', target);
  }
};

},{"knot.js":3}],3:[function(require,module,exports){
/*!
 * Knot.js 1.1.1 - A browser-based event emitter, for tying things together.
 * Copyright (c) 2016 Michael Cavalea - https://github.com/callmecavs/knot.js
 * License: MIT
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.Knot=e()}(this,function(){"use strict";var n={};n["extends"]=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n};var e=function(){function e(n,e){return f[n]=f[n]||[],f[n].push(e),this}function t(n,t){return t._once=!0,e(n,t),this}function r(n){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e?f[n].splice(f[n].indexOf(e),1):delete f[n],this}function o(n){for(var e=this,t=arguments.length,o=Array(t>1?t-1:0),i=1;t>i;i++)o[i-1]=arguments[i];var u=f[n]&&f[n].slice();return u&&u.forEach(function(t){t._once&&r(n,t),t.apply(e,o)}),this}var i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],f={};return n["extends"]({},i,{on:e,once:t,off:r,emit:o})};return e});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCIuLi9vdmVydW5kZXIvaW5kZXguanMiLCIuLi9vdmVydW5kZXIvbm9kZV9tb2R1bGVzL2tub3QuanMvZGlzdC9rbm90Lm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLElBQUksV0FBVyxvQkFBVSxNQUFWLENBQWlCLEdBQWpCLEVBQXNCLFNBQVMsY0FBVCxDQUF3QixVQUF4QixDQUF0QixDQUFmO0FBQ0EsSUFBSSxXQUFXLG9CQUFVLE1BQVYsQ0FBaUIsR0FBakIsRUFBc0IsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQXRCLENBQWY7O0FBRUEsSUFBSSxVQUFVLG9CQUFVLE1BQVYsQ0FBaUIsSUFBakIsQ0FBZDtBQUNBLElBQUksV0FBVyxvQkFBVSxNQUFWLENBQWlCLEdBQWpCLENBQWY7O0FBRUEsU0FBUyxFQUFULENBQVksT0FBWixFQUFxQixVQUFDLEVBQUQsRUFBUTtBQUMzQixLQUFHLFNBQUgsQ0FBYSxNQUFiLENBQW9CLFNBQXBCO0FBQ0QsQ0FGRDtBQUdBLFNBQVMsRUFBVCxDQUFZLE1BQVosRUFBb0IsVUFBQyxFQUFELEVBQVE7QUFDMUIsS0FBRyxTQUFILENBQWEsR0FBYixDQUFpQixTQUFqQjtBQUNELENBRkQ7O0FBSUEsU0FBUyxFQUFULENBQVksT0FBWixFQUFxQixVQUFDLEVBQUQsRUFBUTtBQUMzQixLQUFHLFNBQUgsQ0FBYSxNQUFiLENBQW9CLFNBQXBCO0FBQ0QsQ0FGRDtBQUdBLFNBQVMsRUFBVCxDQUFZLE1BQVosRUFBb0IsVUFBQyxFQUFELEVBQVE7QUFDMUIsS0FBRyxTQUFILENBQWEsR0FBYixDQUFpQixTQUFqQjtBQUNELENBRkQ7O0FBSUEsU0FBUyxJQUFULEdBQWdCLE1BQWhCO0FBQ0EsU0FBUyxJQUFULEdBQWdCLE1BQWhCOztBQUVBLElBQUksYUFBYSxTQUFTLGFBQVQsQ0FB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QUssR0FBTCxDQUFTLElBQVQ7QUFDQSxTQUFLLEdBQUwsQ0FBUyxLQUFUO0FBQ0Q7QUFkVyxDQUFkOzs7Ozs7Ozs7QUF3QkEsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsTUFBZCxFQUF5QjtBQUN0QyxTQUFPLE9BQU8sTUFBUCxDQUFjLG9CQUFLLEtBQUwsQ0FBZCxFQUEyQjtBQUNoQyxVQUFNO0FBQ0osYUFBTztBQURILEtBRDBCO0FBSWhDLFdBQU87QUFDTCxhQUFPO0FBREYsS0FKeUI7QUFPaEMsY0FBVTtBQUNSLGFBQU8sS0FEQztBQUVSLGdCQUFVO0FBRkYsS0FQc0I7QUFXaEMsWUFBUTtBQUNOLGFBQU8sVUFBVTtBQURYO0FBWHdCLEdBQTNCLENBQVA7QUFlRCxDQWhCRDs7Ozs7a0JBcUJlO0FBQ2IsUUFEYSxrQkFDTixLQURNLEVBQ0E7QUFDWCxXQUFPLE9BQU8sS0FBUCxFQUFjLFFBQWQsQ0FBUDtBQUNELEdBSFk7QUFJYixRQUphLGtCQUlOLEtBSk0sRUFJQyxNQUpELEVBSVE7QUFDbkIsV0FBTyxPQUFPLEtBQVAsRUFBYyxRQUFkLEVBQXdCLE1BQXhCLENBQVA7QUFDRDtBQU5ZLEM7OztBQ2pHZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IG92ZXJ1bmRlciBmcm9tICcuLi8uLi9vdmVydW5kZXIvJ1xuXG5sZXQgcmVzaXplcjEgPSBvdmVydW5kZXIucmVzaXplKDcwMCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2l6ZXIxJykpXG5sZXQgcmVzaXplcjIgPSBvdmVydW5kZXIucmVzaXplKDUwMCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2l6ZXIyJykpXG5cbmxldCByZXNpemVyID0gb3ZlcnVuZGVyLnJlc2l6ZSgxMDAwKVxubGV0IHNjcm9sbGVyID0gb3ZlcnVuZGVyLnNjcm9sbCg4MDApXG5cbnJlc2l6ZXIxLm9uKCd1bmRlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vdmVyJylcbn0pXG5yZXNpemVyMS5vbignb3ZlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1vdmVyJylcbn0pXG5cbnJlc2l6ZXIyLm9uKCd1bmRlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vdmVyJylcbn0pXG5yZXNpemVyMi5vbignb3ZlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1vdmVyJylcbn0pXG5cbnJlc2l6ZXIxLmluaXQoKS51cGRhdGUoKVxucmVzaXplcjIuaW5pdCgpLnVwZGF0ZSgpXG5cbmxldCByZXNpemVWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc2l6ZXInKVxuXG5yZXNpemVyLm9uKCd1bmRlcicsICgpID0+IHtcbiAgcmVzaXplVmlldy5pbm5lckhUTUwgPSAnUmVzaXplOiB1bmRlciAxMDAwcHgnXG59KVxucmVzaXplci5vbignb3ZlcicsICgpID0+IHtcbiAgcmVzaXplVmlldy5pbm5lckhUTUwgPSAnUmVzaXplOiBvdmVyIDEwMDBweCdcbn0pXG5cbmxldCBzY3JvbGxWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjcm9sbGVyJylcblxuc2Nyb2xsZXIub24oJ3VuZGVyJywgKCkgPT4ge1xuICBzY3JvbGxWaWV3LmlubmVySFRNTCA9ICdTY3JvbGw6IHVuZGVyIDgwMHB4J1xufSlcbnNjcm9sbGVyLm9uKCdvdmVyJywgKCkgPT4ge1xuICBzY3JvbGxWaWV3LmlubmVySFRNTCA9ICdTY3JvbGw6IG92ZXIgODAwcHgnXG59KVxuXG5yZXNpemVyLmluaXQoKS51cGRhdGUoKVxuc2Nyb2xsZXIuaW5pdCgpLnVwZGF0ZSgpXG4iLCJpbXBvcnQga25vdCBmcm9tICdrbm90LmpzJ1xuXG5jb25zdCBPVkVSID0gJ292ZXInIFxuY29uc3QgVU5ERVIgPSAndW5kZXInIFxuXG4vKipcbiAqIENvbXBhcmUgYSB2YXJpYWJsZSB2YWx1ZSBpLmUuIHNjcm9sbFkgd2l0aFxuICogdGhlIHVzZXItcGFzc2VkIGRlbHRhIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVsdGEgU2Nyb2xsL3Jlc2l6ZSBsaW1pdCBpbiBwaXhlbHNcbiAqIEBwYXJhbSB7aW50ZWdlcn0gY29tcGFyZSB3aW5kb3cuc2Nyb2xsWS9vdXRlcldpZHRoXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVwZGF0ZSBGb3JjZSBhbiB1cGRhdGUgb2YgdGhpcy5wb3NpdGlvblxuICovXG5jb25zdCBjaGVjayA9IGZ1bmN0aW9uKGRlbHRhLCBjb21wYXJlLCB0YXJnZXQsIHVwZGF0ZSA9IGZhbHNlKXtcbiAgbGV0IHRyaWdnZXJlZCA9IGZhbHNlXG5cbiAgaWYgKGNvbXBhcmUgPj0gZGVsdGEgJiYgdGhpcy5wb3NpdGlvbiAhPT0gT1ZFUil7XG4gICAgdGhpcy5wb3NpdGlvbiA9IE9WRVJcbiAgICB0aGlzLmVtaXQodGhpcy5wb3NpdGlvbiwgdGFyZ2V0KVxuICAgIHRyaWdnZXJlZCA9IHRydWVcbiAgfSBlbHNlIGlmIChjb21wYXJlIDwgZGVsdGEgJiYgdGhpcy5wb3NpdGlvbiA9PT0gT1ZFUikge1xuICAgIHRoaXMucG9zaXRpb24gPSBVTkRFUlxuICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0YXJnZXQpXG4gICAgdHJpZ2dlcmVkID0gdHJ1ZVxuICB9XG5cbiAgaWYgKHVwZGF0ZSA9PT0gdHJ1ZSAmJiAhdHJpZ2dlcmVkKXtcbiAgICB0aGlzLnBvc2l0aW9uID0gY29tcGFyZSA+PSBkZWx0YSA/IE9WRVIgOiBVTkRFUlxuICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0YXJnZXQpXG4gIH1cbn1cblxuLyoqXG4gKiBOYW1lc3BhY2UgZm9yIHNjcm9sbC9yZXNpemUgaGFuZGxlcnNcbiAqXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGRlbHRhIFNjcm9sbC9yZXNpemUgbGltaXQgaW4gcGl4ZWxzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVwZGF0ZSBGb3JjZSBhbiB1cGRhdGUgb2YgdGhpcy5wb3NpdGlvblxuICovXG5jb25zdCB3YXRjaCA9IHtcbiAgc2Nyb2xsKGRlbHRhLCB0YXJnZXQsIHVwZGF0ZSl7XG4gICAgY2hlY2suY2FsbCh0aGlzLCBkZWx0YSwgd2luZG93LnNjcm9sbFksIHdpbmRvdywgdXBkYXRlKVxuICB9LFxuICByZXNpemUoZGVsdGEsIHRhcmdldCwgdXBkYXRlKXtcbiAgICBsZXQgY29tcGFyZSA9IHRhcmdldC5vZmZzZXRXaWR0aCB8fCB0YXJnZXQub3V0ZXJXaWR0aFxuICAgIGNoZWNrLmNhbGwodGhpcywgZGVsdGEsIGNvbXBhcmUsIHRhcmdldCwgdXBkYXRlKVxuICB9XG59XG5cbi8qKlxuICogUHVibGljIHByb3RvdHlwZSBtZXRob2RzIHRoYXQgd2lsbCBiZSBhdHRhY2hlZFxuICogdG8gdGhlIHJldHVybiB2YWx1ZSBvZiBjcmVhdGUoKVxuICovXG5jb25zdCBwcm90byA9IHtcbiAgdXBkYXRlKCl7XG4gICAgd2F0Y2hbdGhpcy50eXBlXS5jYWxsKHRoaXMsIHRoaXMuZGVsdGEsIHRoaXMudGFyZ2V0LCB0cnVlKVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIGluaXQoKXtcbiAgICB0aGlzLmhhbmRsZXIgPSB3YXRjaFt0aGlzLnR5cGVdLmJpbmQodGhpcywgdGhpcy5kZWx0YSwgdGhpcy50YXJnZXQpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLmhhbmRsZXIpXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgZGVzdHJveSgpe1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy5oYW5kbGVyKVxuICAgIHRoaXMub2ZmKE9WRVIpXG4gICAgdGhpcy5vZmYoVU5ERVIpXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgaW5zdGFuY2Ugd2l0aCB1c2VyLXBhc3NlZFxuICogdmFsdWVzIGFuZCBwcm90b3R5cGVzXG4gKlxuICogQHBhcmFtIHtpbnRlZ2VyfSBkZWx0YSBTY3JvbGwvcmVzaXplIGxpbWl0IGluIHBpeGVsc1xuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgRWl0aGVyIHNjcm9sbCBvciByZXNpemVcbiAqL1xuY29uc3QgY3JlYXRlID0gKGRlbHRhLCB0eXBlLCB0YXJnZXQpID0+IHtcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoa25vdChwcm90byksIHtcbiAgICB0eXBlOiB7XG4gICAgICB2YWx1ZTogdHlwZSBcbiAgICB9LFxuICAgIGRlbHRhOiB7XG4gICAgICB2YWx1ZTogZGVsdGFcbiAgICB9LFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICB2YWx1ZTogVU5ERVIsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgdGFyZ2V0OiB7XG4gICAgICB2YWx1ZTogdGFyZ2V0IHx8IHdpbmRvd1xuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGRlbHRhIFNjcm9sbC9yZXNpemUgbGltaXQgaW4gcGl4ZWxzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2Nyb2xsKGRlbHRhKXtcbiAgICByZXR1cm4gY3JlYXRlKGRlbHRhLCAnc2Nyb2xsJykgIFxuICB9LFxuICByZXNpemUoZGVsdGEsIHRhcmdldCl7XG4gICAgcmV0dXJuIGNyZWF0ZShkZWx0YSwgJ3Jlc2l6ZScsIHRhcmdldCkgIFxuICB9XG59XG4iLCIvKiFcbiAqIEtub3QuanMgMS4xLjEgLSBBIGJyb3dzZXItYmFzZWQgZXZlbnQgZW1pdHRlciwgZm9yIHR5aW5nIHRoaW5ncyB0b2dldGhlci5cbiAqIENvcHlyaWdodCAoYykgMjAxNiBNaWNoYWVsIENhdmFsZWEgLSBodHRwczovL2dpdGh1Yi5jb20vY2FsbG1lY2F2cy9rbm90LmpzXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuIWZ1bmN0aW9uKG4sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6bi5Lbm90PWUoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3ZhciBuPXt9O25bXCJleHRlbmRzXCJdPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKG4pe2Zvcih2YXIgZT0xO2U8YXJndW1lbnRzLmxlbmd0aDtlKyspe3ZhciB0PWFyZ3VtZW50c1tlXTtmb3IodmFyIHIgaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxyKSYmKG5bcl09dFtyXSl9cmV0dXJuIG59O3ZhciBlPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShuLGUpe3JldHVybiBmW25dPWZbbl18fFtdLGZbbl0ucHVzaChlKSx0aGlzfWZ1bmN0aW9uIHQobix0KXtyZXR1cm4gdC5fb25jZT0hMCxlKG4sdCksdGhpc31mdW5jdGlvbiByKG4pe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8hMTphcmd1bWVudHNbMV07cmV0dXJuIGU/ZltuXS5zcGxpY2UoZltuXS5pbmRleE9mKGUpLDEpOmRlbGV0ZSBmW25dLHRoaXN9ZnVuY3Rpb24gbyhuKXtmb3IodmFyIGU9dGhpcyx0PWFyZ3VtZW50cy5sZW5ndGgsbz1BcnJheSh0PjE/dC0xOjApLGk9MTt0Pmk7aSsrKW9baS0xXT1hcmd1bWVudHNbaV07dmFyIHU9ZltuXSYmZltuXS5zbGljZSgpO3JldHVybiB1JiZ1LmZvckVhY2goZnVuY3Rpb24odCl7dC5fb25jZSYmcihuLHQpLHQuYXBwbHkoZSxvKX0pLHRoaXN9dmFyIGk9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdP3t9OmFyZ3VtZW50c1swXSxmPXt9O3JldHVybiBuW1wiZXh0ZW5kc1wiXSh7fSxpLHtvbjplLG9uY2U6dCxvZmY6cixlbWl0Om99KX07cmV0dXJuIGV9KTsiXX0=
