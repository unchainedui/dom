const rxQuery = /^\s*([>+~])?\s*([*\w-]+)?(?:\[([\w-=[\]]+)\])?(?:#([\w-]+))?(?:\.([\w.-]+))?\s*/;
const rxClassOnly = /^\.([-\w]+)$/;
const rxIdOnly = /^#([-\w]+)$/;

function parseAttributes(string) {
  if (!string) {
    return;
  }

  return string.split('][').reduce((res, string) => {
    const parts = string.split('=');
    res[parts[0]] = parts[1] || '';
    return res;
  }, {});
}

function parseClasses(string) {
  return string ? string.split('.') : undefined;
}

export function get(selector, root = document) {
  const id = selector.match(rxIdOnly);
  if (id) {
    return document.getElementById(id[1]);
  }

  const className = selector.match(rxClassOnly);
  if (className) {
    return root.getElementsByClassName(className[1]);
  }

  return root.querySelectorAll(selector);
}

export function query(selector) {
  let f;
  const out = [];
  if (typeof selector === 'string') {
    while (selector) {
      f = selector.match(rxQuery);
      if (f[0] === '') {
        break;
      }

      out.push({
        rel: f[1],
        tag: (f[2] || '').toUpperCase(),
        attributes: parseAttributes(f[3]),
        id: f[4],
        classes: parseClasses(f[5])
      });
      selector = selector.substring(f[0].length);
    }
  }
  return out;
}

export function createNs(namespaceURI, selector) {
  const s = query(selector)[0];
  const tag = s.tag;
  if (!tag) {
    return null;
  }

  const el = document.createElementNs(namespaceURI, tag);
  const id = s.id;
  if (id) {
    el.id = id;
  }

  const classes = s.classes;
  if (classes) {
    el.className = classes.join(' ');
  }

  return el;
}

export function create(selector, content) {
  const s = query(selector)[0];
  const tag = s.tag;
  if (!tag) {
    return null;
  }

  const el = document.createElement(tag);
  const id = s.id;
  if (id) {
    el.id = id;
  }

  const classes = s.classes;
  if (classes) {
    el.className = classes.join(' ');
  }

  const attrs = s.attributes;
  if (attrs) {
    for (const name in attrs) {
      el.setAttribute(name, attrs[name]);
    }
  }

  if (content) {
    if (content instanceof Node) {
      el.appendChild(content);
    } else {
      el.innerHTML = content;
    }
  }

  return el;
}

export function empty(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  return el;
}

export function closest(el, selector) {
  while (!el.matches(selector) && (el = el.parentElement));
  return el;
}

export function attr(el, name, value) {
  if (value === undefined) {
    return el.getAttribute(name);
  }

  el.setAttribute(name, value);
}

export function append(parent, el) {
  parent.appendChild(el);
  return parent;
}

export function prepend(parent, el) {
  parent.insertBefore(el, parent.firstChild);
  return parent;
}

export function appendTo(el, parent) {
  parent.appendChild(el);
  return el;
}

export function prependTo(el, parent) {
  parent.insertBefore(el, parent.firstChild);
  return el;
}

export function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export function on(el, event, selector, handler, options) {
  if (typeof selector !== 'string') {
    handler = selector;
    selector = undefined;
  }

  if (!selector) {
    el.addEventListener(event, handler, options);
    return handler;
  }

  return on(el, event, e => {
    const target = closest(e.target, selector);
    if (target) {
      handler.call(target, e);
    }
  }, options);
}

export function off(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
  return handler;
}

export function once(el, event, handler, options) {
  const _handler = (...args) => {
    handler(...args);
    off(el, event, handler);
  }

  el.addEventListener(event, handler, options);
  return _handler;
}

export const ALL_EVENTS = '__on';
export function onEvents(ctx, events) {
  if (!ctx[ALL_EVENTS]) {
    ctx[ALL_EVENTS] = {}
  }

  for (const event in events) {
    ctx[ALL_EVENTS][event] = on(ctx.el, event, events[event]);
  }
}

export function offEvents(ctx) {
  const events = ctx[ALL_EVENTS];
  for (const event in events) {
    off(ctx.el, event, events[event]);
  }
  delete ctx[ALL_EVENTS];
}

export function addClass(el, ...cls) {
  return el.classList.add(...cls);
}

export function removeClass(el, ...cls) {
  return el.classList.remove(...cls);
}

export function toggleClass(el, cls, force) {
  return el.classList.toggle(cls, force);
}

export function addDelayRemoveClass(el, cls, delay, cb) {
  addClass(el, cls);
  return setTimeout(() => {
    removeClass(el, cls);
    cb && cb();
  }, delay);
}

export function replaceClass(el, rx, newClass) {
  const newClasses = [];
  attr(el, 'class').split(' ').forEach(function(cls) {
    const c = rx.test(cls) ? newClass : cls;

    if (newClasses.indexOf(c) === -1) {
      newClasses.push(c);
    }
  });

  attr(el, 'class', newClasses.join(' '));
  return newClasses.length;
}

export function insertBefore(el, node) {
  return node.parentNode.insertBefore(el, node);
}

export function insertAfter(el, node) {
  return node.parentNode.insertBefore(el, node.nextSibling);
}

export function remove(el) {
  return el.parentNode.removeChild(el);
}
