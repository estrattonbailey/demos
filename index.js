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
    var compare = target.scrollY || target.scrollYOffset;
    check.call(this, delta, compare, window, update);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMva25vdC5qcy9kaXN0L2tub3QubWluLmpzIiwibm9kZV9tb2R1bGVzL292ZXJ1bmRlci9pbmRleC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNMQTs7Ozs7O0FBRUEsSUFBTSxPQUFPLE1BQWI7QUFDQSxJQUFNLFFBQVEsT0FBZDs7Ozs7Ozs7OztBQVVBLElBQU0sUUFBUSxTQUFSLEtBQVEsQ0FBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCLE1BQXpCLEVBQWdEO0FBQUEsTUFBZixNQUFlLHlEQUFOLEtBQU07O0FBQzVELE1BQUksWUFBWSxLQUFoQjs7QUFFQSxNQUFJLFdBQVcsS0FBWCxJQUFvQixLQUFLLFFBQUwsS0FBa0IsSUFBMUMsRUFBK0M7QUFDN0MsU0FBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBSyxRQUFmLEVBQXlCLE1BQXpCO0FBQ0EsZ0JBQVksSUFBWjtBQUNELEdBSkQsTUFJTyxJQUFJLFVBQVUsS0FBVixJQUFtQixLQUFLLFFBQUwsS0FBa0IsSUFBekMsRUFBK0M7QUFDcEQsU0FBSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsU0FBSyxJQUFMLENBQVUsS0FBSyxRQUFmLEVBQXlCLE1BQXpCO0FBQ0EsZ0JBQVksSUFBWjtBQUNEOztBQUVELE1BQUksV0FBVyxJQUFYLElBQW1CLENBQUMsU0FBeEIsRUFBa0M7QUFDaEMsU0FBSyxRQUFMLEdBQWdCLFdBQVcsS0FBWCxHQUFtQixJQUFuQixHQUEwQixLQUExQztBQUNBLFNBQUssSUFBTCxDQUFVLEtBQUssUUFBZixFQUF5QixNQUF6QjtBQUNEO0FBQ0YsQ0FqQkQ7Ozs7Ozs7O0FBeUJBLElBQU0sUUFBUTtBQUNaLFFBRFksa0JBQ0wsS0FESyxFQUNFLE1BREYs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R0EsU0FBUyxFQUFULENBQVksTUFBWixFQUFvQixVQUFDLEVBQUQsRUFBUTtBQUMxQixLQUFHLFNBQUgsQ0FBYSxHQUFiLENBQWlCLFNBQWpCO0FBQ0QsQ0FGRDs7QUFJQSxTQUFTLElBQVQsR0FBZ0IsTUFBaEI7QUFDQSxTQUFTLElBQVQsR0FBZ0IsTUFBaEI7O0FBRUEsSUFBSSxhQUFhLFNBQVMsYUFBVCxDQUF1QixVQUF2QixDQUFqQjs7QUFFQSxRQUFRLEVBQVIsQ0FBVyxPQUFYLEVBQW9CLFlBQU07QUFDeEIsYUFBVyxTQUFYLEdBQXVCLHNCQUF2QjtBQUNELENBRkQ7QUFHQSxRQUFRLEVBQVIsQ0FBVyxNQUFYLEVBQW1CLFlBQU07QUFDdkIsYUFBVyxTQUFYLEdBQXVCLHFCQUF2QjtBQUNELENBRkQ7O0FBSUEsSUFBSSxhQUFhLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFqQjs7QUFFQSxTQUFTLEVBQVQsQ0FBWSxPQUFaLEVBQXFCLFlBQU07QUFDekIsYUFBVyxTQUFYLEdBQXVCLHFCQUF2QjtBQUNELENBRkQ7QUFHQSxTQUFTLEVBQVQsQ0FBWSxNQUFaLEVBQW9CLFlBQU07QUFDeEIsYUFBVyxTQUFYLEdBQXVCLG9CQUF2QjtBQUNELENBRkQ7O0FBSUEsUUFBUSxJQUFSLEdBQWUsTUFBZjtBQUNBLFNBQVMsSUFBVCxHQUFnQixNQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIEtub3QuanMgMS4xLjEgLSBBIGJyb3dzZXItYmFzZWQgZXZlbnQgZW1pdHRlciwgZm9yIHR5aW5nIHRoaW5ncyB0b2dldGhlci5cbiAqIENvcHlyaWdodCAoYykgMjAxNiBNaWNoYWVsIENhdmFsZWEgLSBodHRwczovL2dpdGh1Yi5jb20vY2FsbG1lY2F2cy9rbm90LmpzXG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuIWZ1bmN0aW9uKG4sZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6bi5Lbm90PWUoKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3ZhciBuPXt9O25bXCJleHRlbmRzXCJdPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKG4pe2Zvcih2YXIgZT0xO2U8YXJndW1lbnRzLmxlbmd0aDtlKyspe3ZhciB0PWFyZ3VtZW50c1tlXTtmb3IodmFyIHIgaW4gdClPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxyKSYmKG5bcl09dFtyXSl9cmV0dXJuIG59O3ZhciBlPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShuLGUpe3JldHVybiBmW25dPWZbbl18fFtdLGZbbl0ucHVzaChlKSx0aGlzfWZ1bmN0aW9uIHQobix0KXtyZXR1cm4gdC5fb25jZT0hMCxlKG4sdCksdGhpc31mdW5jdGlvbiByKG4pe3ZhciBlPWFyZ3VtZW50cy5sZW5ndGg8PTF8fHZvaWQgMD09PWFyZ3VtZW50c1sxXT8hMTphcmd1bWVudHNbMV07cmV0dXJuIGU/ZltuXS5zcGxpY2UoZltuXS5pbmRleE9mKGUpLDEpOmRlbGV0ZSBmW25dLHRoaXN9ZnVuY3Rpb24gbyhuKXtmb3IodmFyIGU9dGhpcyx0PWFyZ3VtZW50cy5sZW5ndGgsbz1BcnJheSh0PjE/dC0xOjApLGk9MTt0Pmk7aSsrKW9baS0xXT1hcmd1bWVudHNbaV07dmFyIHU9ZltuXSYmZltuXS5zbGljZSgpO3JldHVybiB1JiZ1LmZvckVhY2goZnVuY3Rpb24odCl7dC5fb25jZSYmcihuLHQpLHQuYXBwbHkoZSxvKX0pLHRoaXN9dmFyIGk9YXJndW1lbnRzLmxlbmd0aDw9MHx8dm9pZCAwPT09YXJndW1lbnRzWzBdP3t9OmFyZ3VtZW50c1swXSxmPXt9O3JldHVybiBuW1wiZXh0ZW5kc1wiXSh7fSxpLHtvbjplLG9uY2U6dCxvZmY6cixlbWl0Om99KX07cmV0dXJuIGV9KTsiLCJpbXBvcnQga25vdCBmcm9tICdrbm90LmpzJ1xuXG5jb25zdCBPVkVSID0gJ292ZXInIFxuY29uc3QgVU5ERVIgPSAndW5kZXInIFxuXG4vKipcbiAqIENvbXBhcmUgYSB2YXJpYWJsZSB2YWx1ZSBpLmUuIHNjcm9sbFkgd2l0aFxuICogdGhlIHVzZXItcGFzc2VkIGRlbHRhIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVsdGEgU2Nyb2xsL3Jlc2l6ZSBsaW1pdCBpbiBwaXhlbHNcbiAqIEBwYXJhbSB7aW50ZWdlcn0gY29tcGFyZSB3aW5kb3cuc2Nyb2xsWS9vdXRlcldpZHRoXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVwZGF0ZSBGb3JjZSBhbiB1cGRhdGUgb2YgdGhpcy5wb3NpdGlvblxuICovXG5jb25zdCBjaGVjayA9IGZ1bmN0aW9uKGRlbHRhLCBjb21wYXJlLCB0YXJnZXQsIHVwZGF0ZSA9IGZhbHNlKXtcbiAgbGV0IHRyaWdnZXJlZCA9IGZhbHNlXG5cbiAgaWYgKGNvbXBhcmUgPj0gZGVsdGEgJiYgdGhpcy5wb3NpdGlvbiAhPT0gT1ZFUil7XG4gICAgdGhpcy5wb3NpdGlvbiA9IE9WRVJcbiAgICB0aGlzLmVtaXQodGhpcy5wb3NpdGlvbiwgdGFyZ2V0KVxuICAgIHRyaWdnZXJlZCA9IHRydWVcbiAgfSBlbHNlIGlmIChjb21wYXJlIDwgZGVsdGEgJiYgdGhpcy5wb3NpdGlvbiA9PT0gT1ZFUikge1xuICAgIHRoaXMucG9zaXRpb24gPSBVTkRFUlxuICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0YXJnZXQpXG4gICAgdHJpZ2dlcmVkID0gdHJ1ZVxuICB9XG5cbiAgaWYgKHVwZGF0ZSA9PT0gdHJ1ZSAmJiAhdHJpZ2dlcmVkKXtcbiAgICB0aGlzLnBvc2l0aW9uID0gY29tcGFyZSA+PSBkZWx0YSA/IE9WRVIgOiBVTkRFUlxuICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0YXJnZXQpXG4gIH1cbn1cblxuLyoqXG4gKiBOYW1lc3BhY2UgZm9yIHNjcm9sbC9yZXNpemUgaGFuZGxlcnNcbiAqXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGRlbHRhIFNjcm9sbC9yZXNpemUgbGltaXQgaW4gcGl4ZWxzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVwZGF0ZSBGb3JjZSBhbiB1cGRhdGUgb2YgdGhpcy5wb3NpdGlvblxuICovXG5jb25zdCB3YXRjaCA9IHtcbiAgc2Nyb2xsKGRlbHRhLCB0YXJnZXQsIHVwZGF0ZSl7XG4gICAgbGV0IGNvbXBhcmUgPSB0YXJnZXQuc2Nyb2xsWSB8fCB0YXJnZXQuc2Nyb2xsWU9mZnNldFxuICAgIGNoZWNrLmNhbGwodGhpcywgZGVsdGEsIGNvbXBhcmUsIHdpbmRvdywgdXBkYXRlKVxuICB9LFxuICByZXNpemUoZGVsdGEsIHRhcmdldCwgdXBkYXRlKXtcbiAgICBsZXQgY29tcGFyZSA9IHRhcmdldC5vZmZzZXRXaWR0aCB8fCB0YXJnZXQub3V0ZXJXaWR0aFxuICAgIGNoZWNrLmNhbGwodGhpcywgZGVsdGEsIGNvbXBhcmUsIHRhcmdldCwgdXBkYXRlKVxuICB9XG59XG5cbi8qKlxuICogUHVibGljIHByb3RvdHlwZSBtZXRob2RzIHRoYXQgd2lsbCBiZSBhdHRhY2hlZFxuICogdG8gdGhlIHJldHVybiB2YWx1ZSBvZiBjcmVhdGUoKVxuICovXG5jb25zdCBwcm90byA9IHtcbiAgdXBkYXRlKCl7XG4gICAgd2F0Y2hbdGhpcy50eXBlXS5jYWxsKHRoaXMsIHRoaXMuZGVsdGEsIHRoaXMudGFyZ2V0LCB0cnVlKVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIGluaXQoKXtcbiAgICB0aGlzLmhhbmRsZXIgPSB3YXRjaFt0aGlzLnR5cGVdLmJpbmQodGhpcywgdGhpcy5kZWx0YSwgdGhpcy50YXJnZXQpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLmhhbmRsZXIpXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgZGVzdHJveSgpe1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy5oYW5kbGVyKVxuICAgIHRoaXMub2ZmKE9WRVIpXG4gICAgdGhpcy5vZmYoVU5ERVIpXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgaW5zdGFuY2Ugd2l0aCB1c2VyLXBhc3NlZFxuICogdmFsdWVzIGFuZCBwcm90b3R5cGVzXG4gKlxuICogQHBhcmFtIHtpbnRlZ2VyfSBkZWx0YSBTY3JvbGwvcmVzaXplIGxpbWl0IGluIHBpeGVsc1xuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgRWl0aGVyIHNjcm9sbCBvciByZXNpemVcbiAqL1xuY29uc3QgY3JlYXRlID0gKGRlbHRhLCB0eXBlLCB0YXJnZXQpID0+IHtcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUoa25vdChwcm90byksIHtcbiAgICB0eXBlOiB7XG4gICAgICB2YWx1ZTogdHlwZSBcbiAgICB9LFxuICAgIGRlbHRhOiB7XG4gICAgICB2YWx1ZTogZGVsdGFcbiAgICB9LFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICB2YWx1ZTogVU5ERVIsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgdGFyZ2V0OiB7XG4gICAgICB2YWx1ZTogdGFyZ2V0IHx8IHdpbmRvd1xuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGRlbHRhIFNjcm9sbC9yZXNpemUgbGltaXQgaW4gcGl4ZWxzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2Nyb2xsKGRlbHRhKXtcbiAgICByZXR1cm4gY3JlYXRlKGRlbHRhLCAnc2Nyb2xsJykgIFxuICB9LFxuICByZXNpemUoZGVsdGEsIHRhcmdldCl7XG4gICAgcmV0dXJuIGNyZWF0ZShkZWx0YSwgJ3Jlc2l6ZScsIHRhcmdldCkgIFxuICB9XG59XG4iLCJpbXBvcnQgb3ZlcnVuZGVyIGZyb20gJ292ZXJ1bmRlcidcblxubGV0IHJlc2l6ZXIxID0gb3ZlcnVuZGVyLnJlc2l6ZSg3MDAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNpemVyMScpKVxubGV0IHJlc2l6ZXIyID0gb3ZlcnVuZGVyLnJlc2l6ZSg1MDAsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNpemVyMicpKVxuXG5sZXQgcmVzaXplciA9IG92ZXJ1bmRlci5yZXNpemUoMTAwMClcbmxldCBzY3JvbGxlciA9IG92ZXJ1bmRlci5zY3JvbGwoODAwKVxuXG5yZXNpemVyMS5vbigndW5kZXInLCAoZWwpID0+IHtcbiAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3ZlcicpXG59KVxucmVzaXplcjEub24oJ292ZXInLCAoZWwpID0+IHtcbiAgZWwuY2xhc3NMaXN0LmFkZCgnaXMtb3ZlcicpXG59KVxuXG5yZXNpemVyMi5vbigndW5kZXInLCAoZWwpID0+IHtcbiAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3ZlcicpXG59KVxucmVzaXplcjIub24oJ292ZXInLCAoZWwpID0+IHtcbiAgZWwuY2xhc3NMaXN0LmFkZCgnaXMtb3ZlcicpXG59KVxuXG5yZXNpemVyMS5pbml0KCkudXBkYXRlKClcbnJlc2l6ZXIyLmluaXQoKS51cGRhdGUoKVxuXG5sZXQgcmVzaXplVmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXNpemVyJylcblxucmVzaXplci5vbigndW5kZXInLCAoKSA9PiB7XG4gIHJlc2l6ZVZpZXcuaW5uZXJIVE1MID0gJ1Jlc2l6ZTogdW5kZXIgMTAwMHB4J1xufSlcbnJlc2l6ZXIub24oJ292ZXInLCAoKSA9PiB7XG4gIHJlc2l6ZVZpZXcuaW5uZXJIVE1MID0gJ1Jlc2l6ZTogb3ZlciAxMDAwcHgnXG59KVxuXG5sZXQgc2Nyb2xsVmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGxlcicpXG5cbnNjcm9sbGVyLm9uKCd1bmRlcicsICgpID0+IHtcbiAgc2Nyb2xsVmlldy5pbm5lckhUTUwgPSAnU2Nyb2xsOiB1bmRlciA4MDBweCdcbn0pXG5zY3JvbGxlci5vbignb3ZlcicsICgpID0+IHtcbiAgc2Nyb2xsVmlldy5pbm5lckhUTUwgPSAnU2Nyb2xsOiBvdmVyIDgwMHB4J1xufSlcblxucmVzaXplci5pbml0KCkudXBkYXRlKClcbnNjcm9sbGVyLmluaXQoKS51cGRhdGUoKVxuIl19
