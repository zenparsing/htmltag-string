'use strict';

var DOM_PROPS = {
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};

var HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;',
  '`': '&#x60;'
};

function toAttributes(props) {
  var attr = {};
  Object.keys(props).forEach(function(key) {
    var name = typeof DOM_PROPS[key] === 'string' ? DOM_PROPS[key] : key;
    attr[name] = props[key];
  });
  return attr;
}

function escMap(m) {
  return HTML_ESCAPES[m];
}

function esc(s) {
  s = '' + (s || '');
  return /[&<>"'`]/.test(s) ? s.replace(/[&<>"'`]/g, escMap) : s;
}

function convert(x) {
  if (Array.isArray(x)) {
    return x.map(convert).join('');
  } else if (x && typeof x.__html === 'string') {
    return x;
  } else {
    return esc(x);
  }
}

function HtmlString(html) { this.__html = String(html); }
HtmlString.prototype.toString = function() { return this.__html; };

function htmlStringElement(tag, props, children) {
  if (typeof tag === 'function') {
    return new HtmlString(tag(props, children));
  }
  var attributes = toAttributes(props);
  var pairs = Object.keys(attributes).map(function(k) {
    return esc(k) + '="' + esc(attributes[k]) + '"';
  });
  var open = tag;
  if (pairs.length > 0) {
    open += ' ' + pairs.join(' ');
  }
  var inner = children.map(convert).join('');
  return new HtmlString('<' + open + '>' + inner + '</' + tag + '>');
}

module.exports = require('../quasi-html')(htmlStringElement);
