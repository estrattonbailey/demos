(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Knot.js 1.1.1 - A browser-based event emitter, for tying things together.
 * Copyright (c) 2016 Michael Cavalea - https://github.com/callmecavs/knot.js
 * License: MIT
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.Knot=e()}(this,function(){"use strict";var n={};n["extends"]=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n};var e=function(){function e(n,e){return f[n]=f[n]||[],f[n].push(e),this}function t(n,t){return t._once=!0,e(n,t),this}function r(n){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e?f[n].splice(f[n].indexOf(e),1):delete f[n],this}function o(n){for(var e=this,t=arguments.length,o=Array(t>1?t-1:0),i=1;t>i;i++)o[i-1]=arguments[i];var u=f[n]&&f[n].slice();return u&&u.forEach(function(t){t._once&&r(n,t),t.apply(e,o)}),this}var i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],f={};return n["extends"]({},i,{on:e,once:t,off:r,emit:o})};return e});
},{}],2:[function(require,module,exports){
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

},{"knot.js":1}],3:[function(require,module,exports){
'use strict';

var _overunder = require('overunder');

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

},{"overunder":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva25vdC5qcy9kaXN0L2tub3QubWluLmpzIiwibm9kZV9tb2R1bGVzL292ZXJ1bmRlci9pbmRleC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNMQTs7Ozs7O0FBRUEsSUFBTSxPQUFPLE1BQWI7QUFDQSxJQUFNLFFBQVEsT0FBZDs7Ozs7Ozs7OztBQVVBLElBQU0sUUFBUSxTQUFSLEtBQVEsQ0FBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCLE1BQXpCLEVBQWdEO0FBQUEsTUFBZixNQUFlLHlEQUFOLEtBQU07O0FBQzVELE1BQUksWUFBWSxLQUFoQjs7QUFFQSxNQUFJLFdBQVcsS0FBWCxJQUFvQixLQUFLLFFBQUwsS0FBa0IsSUFBMUMsRUFBK0M7QUFDN0MsU0FBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBSyxRQUFmLEVBQXlCLE1BQXpCO0FBQ0EsZ0JBQVksSUFBWjtBQUNELEdBSkQsTUFJTyxJQUFJLFVBQVUsS0FBVixJQUFtQixLQUFLLFFBQUwsS0FBa0IsSUFBekMsRUFBK0M7QUFDcEQsU0FBSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBSyxRQUFmLEVBQXlCLE1BQXpCO0FBQ0EsZ0JBQVksSUFBWjtBQUNEOztBQUVELE1BQUksV0FBVyxJQUFYLElBQW1CLENBQUMsU0FBeEIsRUFBa0M7QUFDaEMsU0FBSyxRQUFMLEdBQWdCLFdBQVcsS0FBWCxHQUFtQixJQUFuQixHQUEwQixLQUExQztBQUNBLFNBQUssSUFBTCxDQUFVLEtBQUssUUFBZixFQUF5QixNQUF6QjtBQUNEO0FBQ0YsQ0FqQkQ7Ozs7Ozs7O0FBeUJBLElBQU0sUUFBUTtBQUNaLFFBRFksa0JBQ0wsS0FESyxFQUNFLE1BREYs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RCxFQUFRO0FBQzFCLEtBQUcsU0FBSCxDQUFhLEdBQWIsQ0FBaUIsU0FBakI7QUFDRCxDQUZEOztBQUlBLFNBQVMsSUFBVCxHQUFnQixNQUFoQjtBQUNBLFNBQVMsSUFBVCxHQUFnQixNQUFoQjs7QUFFQSxJQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWpCOztBQUVBLFFBQVEsRUFBUixDQUFXLE9BQVgsRUFBb0IsWUFBTTtBQUN4QixhQUFXLFNBQVgsR0FBdUIsc0JBQXZCO0FBQ0QsQ0FGRDtBQUdBLFFBQVEsRUFBUixDQUFXLE1BQVgsRUFBbUIsWUFBTTtBQUN2QixhQUFXLFNBQVgsR0FBdUIscUJBQXZCO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLFdBQXZCLENBQWpCOztBQUVBLFNBQVMsRUFBVCxDQUFZLE9BQVosRUFBcUIsWUFBTTtBQUN6QixhQUFXLFNBQVgsR0FBdUIscUJBQXZCO0FBQ0QsQ0FGRDtBQUdBLFNBQVMsRUFBVCxDQUFZLE1BQVosRUFBb0IsWUFBTTtBQUN4QixhQUFXLFNBQVgsR0FBdUIsb0JBQXZCO0FBQ0QsQ0FGRDs7QUFJQSxRQUFRLElBQVIsR0FBZSxNQUFmO0FBQ0EsU0FBUyxJQUFULEdBQWdCLE1BQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogS25vdC5qcyAxLjEuMSAtIEEgYnJvd3Nlci1iYXNlZCBldmVudCBlbWl0dGVyLCBmb3IgdHlpbmcgdGhpbmdzIHRvZ2V0aGVyLlxuICogQ29weXJpZ2h0IChjKSAyMDE2IE1pY2hhZWwgQ2F2YWxlYSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9jYWxsbWVjYXZzL2tub3QuanNcbiAqIExpY2Vuc2U6IE1JVFxuICovXG4hZnVuY3Rpb24obixlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKTpuLktub3Q9ZSgpfSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49e307bltcImV4dGVuZHNcIl09T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24obil7Zm9yKHZhciBlPTE7ZTxhcmd1bWVudHMubGVuZ3RoO2UrKyl7dmFyIHQ9YXJndW1lbnRzW2VdO2Zvcih2YXIgciBpbiB0KU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LHIpJiYobltyXT10W3JdKX1yZXR1cm4gbn07dmFyIGU9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKG4sZSl7cmV0dXJuIGZbbl09ZltuXXx8W10sZltuXS5wdXNoKGUpLHRoaXN9ZnVuY3Rpb24gdChuLHQpe3JldHVybiB0Ll9vbmNlPSEwLGUobix0KSx0aGlzfWZ1bmN0aW9uIHIobil7dmFyIGU9YXJndW1lbnRzLmxlbmd0aDw9MXx8dm9pZCAwPT09YXJndW1lbnRzWzFdPyExOmFyZ3VtZW50c1sxXTtyZXR1cm4gZT9mW25dLnNwbGljZShmW25dLmluZGV4T2YoZSksMSk6ZGVsZXRlIGZbbl0sdGhpc31mdW5jdGlvbiBvKG4pe2Zvcih2YXIgZT10aGlzLHQ9YXJndW1lbnRzLmxlbmd0aCxvPUFycmF5KHQ+MT90LTE6MCksaT0xO3Q+aTtpKyspb1tpLTFdPWFyZ3VtZW50c1tpXTt2YXIgdT1mW25dJiZmW25dLnNsaWNlKCk7cmV0dXJuIHUmJnUuZm9yRWFjaChmdW5jdGlvbih0KXt0Ll9vbmNlJiZyKG4sdCksdC5hcHBseShlLG8pfSksdGhpc312YXIgaT1hcmd1bWVudHMubGVuZ3RoPD0wfHx2b2lkIDA9PT1hcmd1bWVudHNbMF0/e306YXJndW1lbnRzWzBdLGY9e307cmV0dXJuIG5bXCJleHRlbmRzXCJdKHt9LGkse29uOmUsb25jZTp0LG9mZjpyLGVtaXQ6b30pfTtyZXR1cm4gZX0pOyIsImltcG9ydCBrbm90IGZyb20gJ2tub3QuanMnXG5cbmNvbnN0IE9WRVIgPSAnb3ZlcicgXG5jb25zdCBVTkRFUiA9ICd1bmRlcicgXG5cbi8qKlxuICogQ29tcGFyZSBhIHZhcmlhYmxlIHZhbHVlIGkuZS4gc2Nyb2xsWSB3aXRoXG4gKiB0aGUgdXNlci1wYXNzZWQgZGVsdGEgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtpbnRlZ2VyfSBkZWx0YSBTY3JvbGwvcmVzaXplIGxpbWl0IGluIHBpeGVsc1xuICogQHBhcmFtIHtpbnRlZ2VyfSBjb21wYXJlIHdpbmRvdy5zY3JvbGxZL291dGVyV2lkdGhcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkYXRlIEZvcmNlIGFuIHVwZGF0ZSBvZiB0aGlzLnBvc2l0aW9uXG4gKi9cbmNvbnN0IGNoZWNrID0gZnVuY3Rpb24oZGVsdGEsIGNvbXBhcmUsIHRhcmdldCwgdXBkYXRlID0gZmFsc2Upe1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2VcblxuICBpZiAoY29tcGFyZSA+PSBkZWx0YSAmJiB0aGlzLnBvc2l0aW9uICE9PSBPVkVSKXtcbiAgICB0aGlzLnBvc2l0aW9uID0gT1ZFUlxuICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0YXJnZXQpXG4gICAgdHJpZ2dlcmVkID0gdHJ1ZVxuICB9IGVsc2UgaWYgKGNvbXBhcmUgPCBkZWx0YSAmJiB0aGlzLnBvc2l0aW9uID09PSBPVkVSKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IFVOREVSXG4gICAgdGhpcy5lbWl0KHRoaXMucG9zaXRpb24sIHRhcmdldClcbiAgICB0cmlnZ2VyZWQgPSB0cnVlXG4gIH1cblxuICBpZiAodXBkYXRlID09PSB0cnVlICYmICF0cmlnZ2VyZWQpe1xuICAgIHRoaXMucG9zaXRpb24gPSBjb21wYXJlID49IGRlbHRhID8gT1ZFUiA6IFVOREVSXG4gICAgdGhpcy5lbWl0KHRoaXMucG9zaXRpb24sIHRhcmdldClcbiAgfVxufVxuXG4vKipcbiAqIE5hbWVzcGFjZSBmb3Igc2Nyb2xsL3Jlc2l6ZSBoYW5kbGVyc1xuICpcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVsdGEgU2Nyb2xsL3Jlc2l6ZSBsaW1pdCBpbiBwaXhlbHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdXBkYXRlIEZvcmNlIGFuIHVwZGF0ZSBvZiB0aGlzLnBvc2l0aW9uXG4gKi9cbmNvbnN0IHdhdGNoID0ge1xuICBzY3JvbGwoZGVsdGEsIHRhcmdldCwgdXBkYXRlKXtcbiAgICBjaGVjay5jYWxsKHRoaXMsIGRlbHRhLCB3aW5kb3cuc2Nyb2xsWSwgd2luZG93LCB1cGRhdGUpXG4gIH0sXG4gIHJlc2l6ZShkZWx0YSwgdGFyZ2V0LCB1cGRhdGUpe1xuICAgIGxldCBjb21wYXJlID0gdGFyZ2V0Lm9mZnNldFdpZHRoIHx8IHRhcmdldC5vdXRlcldpZHRoXG4gICAgY2hlY2suY2FsbCh0aGlzLCBkZWx0YSwgY29tcGFyZSwgdGFyZ2V0LCB1cGRhdGUpXG4gIH1cbn1cblxuLyoqXG4gKiBQdWJsaWMgcHJvdG90eXBlIG1ldGhvZHMgdGhhdCB3aWxsIGJlIGF0dGFjaGVkXG4gKiB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIGNyZWF0ZSgpXG4gKi9cbmNvbnN0IHByb3RvID0ge1xuICB1cGRhdGUoKXtcbiAgICB3YXRjaFt0aGlzLnR5cGVdLmNhbGwodGhpcywgdGhpcy5kZWx0YSwgdGhpcy50YXJnZXQsIHRydWUpXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgaW5pdCgpe1xuICAgIHRoaXMuaGFuZGxlciA9IHdhdGNoW3RoaXMudHlwZV0uYmluZCh0aGlzLCB0aGlzLmRlbHRhLCB0aGlzLnRhcmdldClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMuaGFuZGxlcilcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuICBkZXN0cm95KCl7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLmhhbmRsZXIpXG4gICAgdGhpcy5vZmYoT1ZFUilcbiAgICB0aGlzLm9mZihVTkRFUilcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBpbnN0YW5jZSB3aXRoIHVzZXItcGFzc2VkXG4gKiB2YWx1ZXMgYW5kIHByb3RvdHlwZXNcbiAqXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGRlbHRhIFNjcm9sbC9yZXNpemUgbGltaXQgaW4gcGl4ZWxzXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBFaXRoZXIgc2Nyb2xsIG9yIHJlc2l6ZVxuICovXG5jb25zdCBjcmVhdGUgPSAoZGVsdGEsIHR5cGUsIHRhcmdldCkgPT4ge1xuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShrbm90KHByb3RvKSwge1xuICAgIHR5cGU6IHtcbiAgICAgIHZhbHVlOiB0eXBlIFxuICAgIH0sXG4gICAgZGVsdGE6IHtcbiAgICAgIHZhbHVlOiBkZWx0YVxuICAgIH0sXG4gICAgcG9zaXRpb246IHtcbiAgICAgIHZhbHVlOiBVTkRFUixcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSxcbiAgICB0YXJnZXQ6IHtcbiAgICAgIHZhbHVlOiB0YXJnZXQgfHwgd2luZG93XG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVsdGEgU2Nyb2xsL3Jlc2l6ZSBsaW1pdCBpbiBwaXhlbHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBzY3JvbGwoZGVsdGEpe1xuICAgIHJldHVybiBjcmVhdGUoZGVsdGEsICdzY3JvbGwnKSAgXG4gIH0sXG4gIHJlc2l6ZShkZWx0YSwgdGFyZ2V0KXtcbiAgICByZXR1cm4gY3JlYXRlKGRlbHRhLCAncmVzaXplJywgdGFyZ2V0KSAgXG4gIH1cbn1cbiIsImltcG9ydCBvdmVydW5kZXIgZnJvbSAnb3ZlcnVuZGVyJ1xuXG5sZXQgcmVzaXplcjEgPSBvdmVydW5kZXIucmVzaXplKDcwMCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2l6ZXIxJykpXG5sZXQgcmVzaXplcjIgPSBvdmVydW5kZXIucmVzaXplKDUwMCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2l6ZXIyJykpXG5cbmxldCByZXNpemVyID0gb3ZlcnVuZGVyLnJlc2l6ZSgxMDAwKVxubGV0IHNjcm9sbGVyID0gb3ZlcnVuZGVyLnNjcm9sbCg4MDApXG5cbnJlc2l6ZXIxLm9uKCd1bmRlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vdmVyJylcbn0pXG5yZXNpemVyMS5vbignb3ZlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1vdmVyJylcbn0pXG5cbnJlc2l6ZXIyLm9uKCd1bmRlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vdmVyJylcbn0pXG5yZXNpemVyMi5vbignb3ZlcicsIChlbCkgPT4ge1xuICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1vdmVyJylcbn0pXG5cbnJlc2l6ZXIxLmluaXQoKS51cGRhdGUoKVxucmVzaXplcjIuaW5pdCgpLnVwZGF0ZSgpXG5cbmxldCByZXNpemVWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc2l6ZXInKVxuXG5yZXNpemVyLm9uKCd1bmRlcicsICgpID0+IHtcbiAgcmVzaXplVmlldy5pbm5lckhUTUwgPSAnUmVzaXplOiB1bmRlciAxMDAwcHgnXG59KVxucmVzaXplci5vbignb3ZlcicsICgpID0+IHtcbiAgcmVzaXplVmlldy5pbm5lckhUTUwgPSAnUmVzaXplOiBvdmVyIDEwMDBweCdcbn0pXG5cbmxldCBzY3JvbGxWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjcm9sbGVyJylcblxuc2Nyb2xsZXIub24oJ3VuZGVyJywgKCkgPT4ge1xuICBzY3JvbGxWaWV3LmlubmVySFRNTCA9ICdTY3JvbGw6IHVuZGVyIDgwMHB4J1xufSlcbnNjcm9sbGVyLm9uKCdvdmVyJywgKCkgPT4ge1xuICBzY3JvbGxWaWV3LmlubmVySFRNTCA9ICdTY3JvbGw6IG92ZXIgODAwcHgnXG59KVxuXG5yZXNpemVyLmluaXQoKS51cGRhdGUoKVxuc2Nyb2xsZXIuaW5pdCgpLnVwZGF0ZSgpXG4iXX0=
