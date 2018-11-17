# Unchained UI

## DOM

[![NPM Version](https://img.shields.io/npm/v/uc-dom.svg?style=flat-square)](https://www.npmjs.com/package/uc-dom)
[![NPM Downloads](https://img.shields.io/npm/dt/uc-dom.svg?style=flat-square)](https://www.npmjs.com/package/uc-dom)

The only DOM abstraction you will need

### Usage

Just import methods you need

```js
import { get } from 'uc-dom'
```

### Methods

#### ready(fn)

Runs the `fn` when DOM is ready

#### get(selector, root)

returns:

* `Element` if selector is an id
* `HTMLCollection` if selector is a class
* `NodeList` for everything else

Parameters:

* `selector` — css selector
* `root` — default is _document_. root element to look in

#### closest(el, selector)

 Returns the closest ancestor of the current element (or the current element itself) which matches the selector

#### create(selector, content)

Creates and return an element from `selector`. If `content` is present, it will be added as innerHTML.

#### createNs(namespaceURI, selector)

Creates an element with the specified namespace URI and qualified selector.

#### attr(el, name, value)

Sets the value of an attribute on the specified element. If value is `undefined` returns the value of the attribute.

#### append(parent, el) / prepend(parent, el)

appends or prepends the `el` to the `parent`

#### appendTo(el, parent) / prependTo(el, parent)

appends or prepends the `el` to the `parent`

#### insertBefore(el, node)

Inserts a `node` before the `el` as a child of its parent node

#### insertAfter(el, node)

Inserts a `node` after the `el` as a child of its parent node

#### empty(el)

Removes all the child elements from the `el` element

#### remove(el)

Removes `el` from the DOM

#### on(el, event, selector, handler, options)

Sets up a `handler` function to be called whenever the specified event is delivered to the `el`. If `selector` is present will call the function if event target matches the `selector`

Returns a `handler` function

#### once(el, event, handler, options)

Sets up a `handler` function to be called whenever the specified event is delivered to the `el`. The `handler` function will be called only once.

Returns a `handler` function

#### off(el, event, handler, options)

Removes previously registered an `event` listener from the `el`. Returns a `handler` function.

#### onEvents(ctx, events)

Addes all event handlers from `events` object to `ctx.el`.

#### offEvents(ctx)

Removes all event handlers for `ctx.el` added with `onEvents` method.

#### addClass(el, string[, string])

Adds classes to the `el`.

#### removeClass(el, string[, string])

Removes classes from the `el`.

#### toggleClass(el, cls, force)

Toggle `cls` value. When the `force` is present, if is is evaluates to true, adds specified class value, and if it evaluates to false, removes it.

#### replaceClass(el, rx, newClass)

Replace all classes that match the `rx` regexp with `newClass`. Returns the number of new classes.

#### addDelayRemoveClass(el, cls, delay[, cb])

Adds `cls`, waits `delay` ms and then `removes` it. Returns timeoutID, it can be passed to clearTimeout() to cancel the timeout. The optional `cb` function will be called after class is removed.

### UI component methods

```js
import compose from 'uc-compose';
import domMethods from 'uc-dom/methods';

const MyUIComponent = function() {}

MyUIComponent.prototype = compose(
  domMethods,
  {
    componentMethod: function() {
      // add class active to this.el
      this.addClass('active');
    }
  }
)

```

This mixin adds following methods to your class (all the methods use `this.el`):

* addClass
* removeClass
* toggleClass
* replaceClass
* appendTo
* prependTo
* insertBefore
* insertAfter
* find
* attr

License MIT

© velocityzen

