/*eslint-disable strict */
import * as dom from './index';

const html = [
  'addClass',
  'removeClass',
  'toggleClass',
  'replaceClass',
  'appendTo',
  'prependTo',
  'insertBefore',
  'insertAfter'
].reduce((obj, method) => {
  obj[method] = function(...args) {
    dom[method].apply(null, [ this.el ].concat(args));
    return this;
  }
  return obj;
}, {});

html.attr = function(name, value) {
  if (value === undefined) {
    return this.el.getAttribute(name);
  }

  this.el.setAttribute(name, value);
  return this
}

html.find = function(selector) {
  return dom.get(selector, this.el);
}

export default html;
