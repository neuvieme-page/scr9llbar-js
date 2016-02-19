var Scr9llBar = function(_options) {

  'use strict';

  var target = null,
    bar = null,
    wrapper = null,
    el = null,
    lastPageY = 0,
    posRight = 0,
    clientHeight = 0,
    ownHeight = 0,
    value = 0,
    scrollRatio = 0,

    w = window,
    d = document,

    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) { return setTimeout(callback, 1000 / 60); },

    prefix = (function() {
      var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
    })();


  var resize = function() {

    posRight = el.clientWidth - bar.clientWidth;
    clientHeight = el.clientHeight;
    ownHeight = wrapper.offsetHeight;
    scrollRatio = ownHeight / clientHeight;
    var p = (Math.abs(value) / clientHeight) * ownHeight;

    bar.style.cssText = 'height:' + (scrollRatio) * 100 + '%;' + prefix.css + 'transform: translateY(' + p + 'px); right:-' + (posRight) + 'px;';

  };

  var onScroll = function(e) {

    var wdist = e.deltaY * 0.75;
    //wdist = Math.max(-16, Math.min(wdist, 16));

    requestAnimationFrame(function() {
      moveBar();
      value -= wdist / scrollRatio;
      value = Math.max(0, value);
      value = Math.min(value, (clientHeight - ownHeight));
      el.style.cssText = prefix.css + "transform: translateY(" + (-value) + "px)";

    });
  };

  var moveBar = function(e) {

    var totalHeight = clientHeight,
      _this = this;

    scrollRatio = ownHeight / totalHeight;

    requestAnimationFrame(function() {

      if (scrollRatio >= 1) {

        bar.classList.add('scrollbar-hidden');

      } else {

        bar.classList.remove('scrollbar-hidden');
        var p = (Math.abs(value) / totalHeight) * ownHeight;

        bar.style.cssText = 'height:' + (scrollRatio) * 100 + '%;' + prefix.css + 'transform: translateY(' + p + 'px); right:-' + (posRight) + 'px;';

      }

    });

  };

  var starDrag = function(e) {

    lastPageY = e.pageY;
    bar.classList.add('scrollbar-grabbed');
    el.classList.add('scrollbar-grabbed');
    d.addEventListener('mousemove', drag.bind(this), false);
    d.addEventListener('mouseup', stop.bind(this), false);

  };


  var drag = function(e) {

    var delta = e.pageY - lastPageY,
      _this = this;
    lastPageY = e.pageY;
    if (el.classList.contains('scrollbar-grabbed')) {

      requestAnimationFrame(function() {
        moveBar();
        value += delta / scrollRatio;
        value = Math.max(0, value);
        value = Math.min(value, (clientHeight - ownHeight));
        el.style.cssText = prefix.css + "transform: translateY(" + (-value) + "px)";

      });
    } else {
      d.removeEventListener('mousemove', drag.bind(this), false);
    }

  };



  var stop = function() {
    var _this = this;
    requestAnimationFrame(function() {
      d.removeEventListener('mousemove', drag.bind(_this), false);
      d.removeEventListener('mouseup', stop.bind(_this), false);
      el.classList.remove('scrollbar-grabbed');
    });
  };


  var init = function(_el) {

    target = _el;
    bar = '<div class="scrollbar-scroll">';

    wrapper = d.createElement('div');
    wrapper.setAttribute('class', 'scrollbar-wrapper');

    el = d.createElement('div');
    el.setAttribute('class', 'scrollbar-content');

    wrapper.appendChild(el);

    while (target.firstChild) {
      el.appendChild(target.firstChild);
    }

    target.appendChild(wrapper);

    target.insertAdjacentHTML('beforeend', bar);
    bar = target.lastChild;

    value = 0;
    lastPageY = 0;
    posRight = target.clientWidth - bar.clientWidth;
    clientHeight = el.clientHeight;
    ownHeight = wrapper.offsetHeight;

    el.addEventListener("mousewheel", onScroll.bind(this));
    bar.addEventListener('mousedown', starDrag.bind(this));

    window.addEventListener('resize', resize.call(this));

    target.classList.add('scrollbar-container');

  };

  init(_options.wrapper);


};
