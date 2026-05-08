/**
 * Chainable DOM manipulation utilities used across the Vanilla JS runtime.
 *
 * @module dom-query
 */

/**
 * Wrap a DOM element, NodeList, or selector in a DomQuery collection.
 * Usage: $$('selector'), $$(element), $$$(nodeList)
 */
const elementDataStore = new WeakMap();
const defaultDisplayCache = new Map();

function isHtmlString(value) {
  return typeof value === 'string' && value.trim().startsWith('<') && value.trim().endsWith('>');
}

function parseHTMLString(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return Array.from(template.content.childNodes);
}

function getElementDataStore(element) {
  let store = elementDataStore.get(element);
  if (!store) {
    store = {};
    elementDataStore.set(element, store);
  }
  return store;
}

function getDefaultDisplay(tagName) {
  const normalizedTagName = tagName.toLowerCase();
  if (defaultDisplayCache.has(normalizedTagName)) {
    return defaultDisplayCache.get(normalizedTagName);
  }

  const element = document.createElement(normalizedTagName);
  document.body.appendChild(element);
  let display = getComputedStyle(element).display;
  element.remove();

  if (display === 'none') {
    display = 'block';
  }

  defaultDisplayCache.set(normalizedTagName, display);
  return display;
}

function normalizeEvent(event, delegateTarget) {
  if (!event.originalEvent) {
    event.originalEvent = event;
  }

  if (!event.isDefaultPrevented) {
    event.isDefaultPrevented = () => event.defaultPrevented;
  }

  if (delegateTarget && !event.delegateTarget) {
    event.delegateTarget = delegateTarget;
  }

  return event;
}

function getEventNames(events) {
  if (!events) {
    return [];
  }
  return events.split(/\s+/).filter(Boolean);
}

function normalizeEventDetail(detail) {
  return detail === undefined ? [] : [].concat(detail);
}

function getBootstrap() {
  return globalThis.window?.bootstrap;
}

function sanitizeBootstrapOptions(options) {
  if (!options || typeof options !== 'object') {
    return undefined;
  }

  const sanitized = {};
  let hasEntries = false;

  Object.entries(options).forEach(([key, value]) => {
    const normalizedValue = value instanceof DomQuery ? value.get(0) : value;
    if (normalizedValue === null || normalizedValue === undefined) {
      return;
    }

    sanitized[key] = normalizedValue;
    hasEntries = true;
  });

  return hasEntries ? sanitized : undefined;
}

function normalizeClassNames(classes) {
  return classes
    .flatMap((className) => typeof className === 'string' ? className.split(/\s+/) : className)
    .filter(Boolean);
}

function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

const unitlessStyleProperties = new Set([
  'animationIterationCount',
  'columnCount',
  'fillOpacity',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'widows',
  'zIndex',
  'zoom',
]);

function formatStyleValue(property, value) {
  if (typeof value !== 'number' || value === 0 || unitlessStyleProperties.has(property)) {
    return value;
  }

  return `${value}px`;
}

function isWindowObject(value) {
  return value instanceof Window;
}

function isDocumentObject(value) {
  return value === document;
}

function getScrollContainer(target) {
  if (isDocumentObject(target) || isWindowObject(target)) {
    return target.document?.scrollingElement || document.scrollingElement || document.documentElement;
  }

  return target;
}

function normalizeQueryRoots(context) {
  if (context instanceof DomQuery) {
    return context.elements;
  }

  if (context instanceof Element || context instanceof DocumentFragment || context === document) {
    return [context];
  }

  if (context instanceof NodeList || Array.isArray(context)) {
    return Array.from(context);
  }

  return [document];
}

function isSimpleIdSelector(selector) {
  return /^#[^\s>+~.[\]:,]+$/.test(selector);
}

function queryBySimpleId(root, selector) {
  const id = selector.slice(1);
  const ownerDocument = root === document ? document : root.ownerDocument || document;
  const candidate = ownerDocument.getElementById(id);

  if (candidate && root === document) {
    return [candidate];
  }

  if (candidate && root.contains(candidate)) {
    return [candidate];
  }

  if (root === document) {
    return [];
  }

  return Array.from(root.querySelectorAll('*')).filter((element) => element.id === id);
}

function querySelectorAllCompat(root, selector) {
  if (isSimpleIdSelector(selector)) {
    return queryBySimpleId(root, selector);
  }

  return Array.from(root.querySelectorAll(selector));
}

export class DomQuery {
  constructor(selector, context) {
    if (typeof selector === 'string' && isHtmlString(selector)) {
      this.elements = parseHTMLString(selector);
    } else if (typeof selector === 'string') {
      this.elements = normalizeQueryRoots(context).flatMap((root) => querySelectorAllCompat(root, selector));
    } else if (selector instanceof Element || selector instanceof DocumentFragment || selector instanceof Window || selector === document) {
      this.elements = [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      this.elements = Array.from(selector);
    } else if (selector instanceof DomQuery) {
      this.elements = [...selector.elements];
    } else {
      this.elements = [];
    }
    this.refreshCollection();
  }

  refreshCollection() {
    const previousLength = this.length || 0;
    for (let index = 0; index < previousLength; index++) {
      delete this[index];
    }

    this.length = this.elements.length;
    this.elements.forEach((element, index) => {
      this[index] = element;
    });

    return this;
  }

  /** Get raw element at index. Negative indices supported. */
  get(index = 0) {
    if (index < 0) index = this.length + index;
    return this.elements[index] || null;
  }

  first() {
    return this.eq(0);
  }

  last() {
    return this.eq(-1);
  }

  // --- Iteration ---
  each(callback) {
    this.elements.forEach((el, i) => callback.call(el, i, el));
    return this;
  }

  map(callback) {
    return this.elements.map((el, i) => callback.call(el, i, el));
  }

  filter(callback) {
    const filtered = typeof callback === 'function'
      ? this.elements.filter((el, i) => callback.call(el, i, el))
      : this.elements.filter(el => el.matches(callback));
    const dq = new DomQuery(filtered);
    return dq;
  }

  // --- Classes ---
  addClass(...classes) {
    const classNames = normalizeClassNames(classes);
    this.elements.forEach(el => el.classList.add(...classNames));
    return this;
  }

  removeClass(...classes) {
    const classNames = normalizeClassNames(classes);
    this.elements.forEach((el) => {
      if (!classNames.length) {
        el.className = '';
        return;
      }

      el.classList.remove(...classNames);
    });
    return this;
  }

  hasClass(className) {
    return this.elements.some((el) => el?.classList?.contains(className));
  }

  toggleClass(className, force) {
    this.elements.forEach(el => {
      if (force === undefined) el.classList.toggle(className);
      else el.classList.toggle(className, force);
    });
    return this;
  }

  // --- CSS ---
  css(prop, val) {
    if (typeof prop === 'string') {
      if (val === undefined) {
        // Getter: return computed style of first element
        const el = this.get(0);
        if (!el) {
          return undefined;
        }

        const computedStyle = getComputedStyle(el);
        return computedStyle.getPropertyValue(prop) || computedStyle[prop];
      }
      // Setter
      this.elements.forEach(el => el.style[prop] = formatStyleValue(prop, val));
      return this;
    }
    // Object setter
    if (typeof prop === 'object') {
      this.elements.forEach(el => {
        Object.entries(prop).forEach(([key, value]) => {
          el.style[key] = formatStyleValue(key, value);
        });
      });
      return this;
    }
    return this;
  }

  // --- Attributes ---
  attr(name, value) {
    if (typeof name === 'object' && name !== null) {
      this.elements.forEach((el) => {
        Object.entries(name).forEach(([key, val]) => {
          if (val === false || val === null || val === undefined) {
            el.removeAttribute(key);
            return;
          }
          el.setAttribute(key, val);
        });
      });
      return this;
    }

    if (value === undefined) {
      const el = this.get(0);
      return el ? el.getAttribute(name) : undefined;
    }
    this.elements.forEach((el) => {
      if (value === false || value === null || value === undefined) {
        el.removeAttribute(name);
        return;
      }
      el.setAttribute(name, value);
    });
    return this;
  }

  removeAttr(name) {
    this.elements.forEach(el => el.removeAttribute(name));
    return this;
  }

  prop(name, value) {
    if (typeof name === 'object' && name !== null) {
      this.elements.forEach((el) => {
        Object.entries(name).forEach(([key, val]) => {
          el[key] = val;
        });
      });
      return this;
    }

    if (value === undefined) {
      const el = this.get(0);
      return el ? el[name] : undefined;
    }
    this.elements.forEach(el => { el[name] = value; });
    return this;
  }

  data(key, value) {
    if (typeof key === 'object' && key !== null) {
      this.elements.forEach((el) => {
        Object.assign(getElementDataStore(el), key);
      });
      return this;
    }

    if (value === undefined) {
      const el = this.get(0);
      if (!el) return undefined;
      const store = getElementDataStore(el);

      if (key === undefined) {
        return {
          ...el.dataset,
          ...store,
        };
      }

      if (Object.prototype.hasOwnProperty.call(store, key)) {
        return store[key];
      }

      return el.dataset[key];
    }

    this.elements.forEach((el) => {
      getElementDataStore(el)[key] = value;
    });

    return this;
  }

  removeData(key) {
    this.elements.forEach((el) => {
      if (key === undefined) {
        elementDataStore.delete(el);
        return;
      }

      delete getElementDataStore(el)[key];
      delete el.dataset[key];
    });
    return this;
  }

  // --- Content ---
  html(content) {
    if (content === undefined) {
      const el = this.get(0);
      return el ? el.innerHTML : '';
    }

    const appendHtmlContent = (parent, value) => {
      if (value instanceof DomQuery) {
        value.elements.forEach((child) => {
          parent.appendChild(child);
        });
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => appendHtmlContent(parent, item));
        return;
      }

      if (value instanceof Node) {
        parent.appendChild(value);
        return;
      }

      parent.insertAdjacentHTML('beforeend', String(value));
    };

    this.elements.forEach((el) => {
      el.innerHTML = '';
      appendHtmlContent(el, content);
    });
    return this;
  }

  text(content) {
    if (content === undefined) {
      const el = this.get(0);
      return el ? el.textContent : '';
    }
    this.elements.forEach(el => { el.textContent = content; });
    return this;
  }

  val(value) {
    if (value === undefined) {
      const el = this.get(0);
      return el ? el.value : undefined;
    }
    this.elements.forEach(el => { el.value = value; });
    return this;
  }

  // --- DOM Traversal ---
  find(selector) {
    const results = [];
    this.elements.forEach(el => {
      results.push(...querySelectorAllCompat(el, selector));
    });
    return new DomQuery(results);
  }

  closest(selector) {
    const results = [];
    this.elements.forEach(el => {
      const closest = el.closest(selector);
      if (closest) results.push(closest);
    });
    return new DomQuery(results);
  }

  parent(selector) {
    const results = [];
    this.elements.forEach(el => {
      const p = el.parentElement;
      if (p && (!selector || p.matches(selector))) results.push(p);
    });
    return new DomQuery(results);
  }

  parents(selector) {
    const results = [];
    this.elements.forEach(el => {
      let p = el.parentElement;
      while (p) {
        if (!selector || p.matches(selector)) results.push(p);
        p = p.parentElement;
      }
    });
    return new DomQuery([...new Set(results)]);
  }

  parentsUntil(selector) {
    const results = [];
    this.elements.forEach(el => {
      let p = el.parentElement;
      while (p) {
        if (selector && p.matches(selector)) break;
        results.push(p);
        p = p.parentElement;
      }
    });
    return new DomQuery([...new Set(results)]);
  }

  children(selector) {
    const results = [];
    this.elements.forEach(el => {
      const kids = Array.from(el.children);
      if (selector) {
        results.push(...kids.filter(c => c.matches(selector)));
      } else {
        results.push(...kids);
      }
    });
    return new DomQuery(results);
  }

  siblings(selector) {
    const results = [];
    this.elements.forEach(el => {
      const parent = el.parentElement;
      if (!parent) return;
      Array.from(parent.children).forEach(sib => {
        if (sib !== el && (!selector || sib.matches(selector))) results.push(sib);
      });
    });
    return new DomQuery(results);
  }

  prev() {
    const results = [];
    this.elements.forEach(el => {
      if (el.previousElementSibling) results.push(el.previousElementSibling);
    });
    return new DomQuery(results);
  }

  next() {
    const results = [];
    this.elements.forEach(el => {
      if (el.nextElementSibling) results.push(el.nextElementSibling);
    });
    return new DomQuery(results);
  }

  is(selector) {
    if (typeof selector === 'string') {
      return this.elements.some(el => el.matches(selector));
    }
    if (typeof selector === 'function') {
      return this.elements.some(selector);
    }
    return false;
  }

  not(selector) {
    const filtered = typeof selector === 'string'
      ? this.elements.filter(el => !el.matches(selector))
      : this.elements.filter((el, i) => !selector.call(el, i, el));
    return new DomQuery(filtered);
  }

  eq(index) {
    return new DomQuery(this.get(index) || []);
  }

  // --- DOM Manipulation ---
  append(child) {
    if (typeof child === 'string') {
      this.elements.forEach(el => el.insertAdjacentHTML('beforeend', child));
    } else if (child instanceof DomQuery) {
      this.elements.forEach(parent => {
        child.elements.forEach(c => parent.appendChild(c));
      });
    } else if (child instanceof Element) {
      this.elements.forEach(el => el.appendChild(child));
    }
    return this;
  }

  appendTo(target) {
    $$(target).append(this);
    return this;
  }

  prepend(child) {
    if (typeof child === 'string') {
      this.elements.forEach(el => el.insertAdjacentHTML('afterbegin', child));
    } else if (child instanceof DomQuery) {
      this.elements.forEach(parent => {
        child.elements.forEach(c => parent.prepend(c));
      });
    } else if (child instanceof Element) {
      this.elements.forEach(el => el.prepend(child));
    }
    return this;
  }

  prependTo(target) {
    $$(target).prepend(this);
    return this;
  }

  tooltip(option) {
    const bootstrap = getBootstrap();
    if (!bootstrap || !bootstrap.Tooltip) {
      return this;
    }

    this.elements.forEach((element) => {
      const instance = bootstrap.Tooltip.getOrCreateInstance(
        element,
        sanitizeBootstrapOptions(option),
      );

      if (typeof option === 'string' && typeof instance[option] === 'function') {
        instance[option]();
      }
    });

    return this;
  }

  modal(option) {
    const bootstrap = getBootstrap();
    if (!bootstrap || !bootstrap.Modal) {
      return this;
    }

    this.elements.forEach((element) => {
      const instance = bootstrap.Modal.getOrCreateInstance(
        element,
        sanitizeBootstrapOptions(option),
      );

      if (typeof option === 'string' && typeof instance[option] === 'function') {
        instance[option]();
      }
    });

    return this;
  }

  before(content) {
    if (typeof content === 'string') {
      this.elements.forEach(el => el.insertAdjacentHTML('beforebegin', content));
    } else if (content instanceof DomQuery) {
      this.elements.forEach((el, targetIndex) => {
        if (!el.parentNode) {
          return;
        }
        content.elements.forEach((node) => {
          const insertNode = targetIndex === 0 ? node : node.cloneNode(true);
          el.parentNode.insertBefore(insertNode, el);
        });
      });
    } else if (content instanceof Element) {
      this.elements.forEach(el => el.parentNode.insertBefore(content, el));
    }
    return this;
  }

  after(content) {
    if (typeof content === 'string') {
      this.elements.forEach(el => el.insertAdjacentHTML('afterend', content));
    } else if (content instanceof DomQuery) {
      this.elements.forEach((el, targetIndex) => {
        if (!el.parentNode) {
          return;
        }
        const referenceNode = el.nextSibling;
        content.elements.forEach((node) => {
          const insertNode = targetIndex === 0 ? node : node.cloneNode(true);
          el.parentNode.insertBefore(insertNode, referenceNode);
        });
      });
    } else if (content instanceof Element) {
      this.elements.forEach(el => el.parentNode.insertBefore(content, el.nextSibling));
    }
    return this;
  }

  insertAfter(target) {
    const anchor = target instanceof DomQuery ? target.get(-1) : target;
    if (!anchor || !anchor.parentNode) {
      return this;
    }

    this.elements.forEach((element) => {
      anchor.parentNode.insertBefore(element, anchor.nextSibling);
    });

    return this;
  }

  insertBefore(target) {
    const anchor = target instanceof DomQuery ? target.get(0) : target;
    if (!anchor || !anchor.parentNode) {
      return this;
    }

    this.elements.forEach((element) => {
      anchor.parentNode.insertBefore(element, anchor);
    });

    return this;
  }

  replaceWith(content) {
    this.elements.forEach(el => {
      if (typeof content === 'string') {
        el.outerHTML = content;
      } else if (content instanceof DomQuery) {
        const replacement = content.get(0);
        if (replacement) {
          el.parentNode.replaceChild(replacement, el);
        }
      } else if (content instanceof Element) {
        el.parentNode.replaceChild(content, el);
      }
    });
    return this;
  }

  remove() {
    this.elements.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    this.elements = [];
    return this.refreshCollection();
  }

  detach() {
    this.elements.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    return this;
  }

  empty() {
    this.elements.forEach(el => { el.innerHTML = ''; });
    return this;
  }

  clone(deep = true) {
    const cloned = this.elements.map(el => el.cloneNode(deep));
    return new DomQuery(cloned);
  }

  wrap(wrapper) {
    const wrapperHTML = typeof wrapper === 'string' ? wrapper : wrapper.outerHTML;
    this.elements.forEach(el => {
      const wrap = el.ownerDocument.createElement('div');
      wrap.innerHTML = wrapperHTML;
      const wrapperEl = wrap.firstChild;
      el.parentNode.insertBefore(wrapperEl, el);
      wrapperEl.appendChild(el);
    });
    return this;
  }

  unwrap() {
    this.elements.forEach(el => {
      const parent = el.parentNode;
      if (parent && parent !== document.body) {
        while (parent.firstChild) {
          parent.parentNode.insertBefore(parent.firstChild, parent);
        }
        parent.remove();
      }
    });
    return this;
  }

  // --- Events ---
  on(event, selectorOrHandler, handler) {
    const eventNames = getEventNames(event);

    if (typeof selectorOrHandler === 'function') {
      // Direct binding: $(el).on('click', handler)
      const h = selectorOrHandler;
      this.elements.forEach((el) => {
        const wrapped = (nativeEvent) => {
          const event = normalizeEvent(nativeEvent, el);
          const detail = normalizeEventDetail(event.detail);
          h.call(el, event, ...detail);
        };
        eventNames.forEach((eventName) => el.addEventListener(eventName, wrapped));
        if (!el._domQueryHandlers) el._domQueryHandlers = [];
        eventNames.forEach((eventName) => {
          el._domQueryHandlers.push({ event: eventName, handler: h, wrapper: wrapped });
        });
      });
    } else if (typeof selectorOrHandler === 'string' && typeof handler === 'function') {
      // Delegated binding: $(el).on('click', 'selector', handler)
      const selector = selectorOrHandler;
      const h = (nativeEvent) => {
        const e = normalizeEvent(nativeEvent);
        const target = e.target instanceof Element ? e.target.closest(selector) : null;
        if (target && this.elements.some(el => el.contains(target))) {
          const event = normalizeEvent(e, target);
          const detail = normalizeEventDetail(event.detail);
          handler.call(target, event, ...detail);
        }
      };
      this.elements.forEach(el => {
        eventNames.forEach((eventName) => el.addEventListener(eventName, h));
        // Store reference for off()
        if (!el._domQueryHandlers) el._domQueryHandlers = [];
        eventNames.forEach((eventName) => {
          el._domQueryHandlers.push({ event: eventName, selector, handler, wrapper: h });
        });
      });
    }
    return this;
  }

  off(event, handler) {
    const eventNames = getEventNames(event);

    this.elements.forEach(el => {
      if (!eventNames.length && el._domQueryHandlers) {
        el._domQueryHandlers.forEach((registered) => {
          el.removeEventListener(registered.event, registered.wrapper);
        });
        el._domQueryHandlers = [];
        return;
      }

      if (handler) {
        if (el._domQueryHandlers) {
          el._domQueryHandlers
            .filter((registered) => eventNames.includes(registered.event) && registered.handler === handler)
            .forEach((registered) => el.removeEventListener(registered.event, registered.wrapper));
          el._domQueryHandlers = el._domQueryHandlers.filter((registered) => !(eventNames.includes(registered.event) && registered.handler === handler));
        } else {
          eventNames.forEach((eventName) => el.removeEventListener(eventName, handler));
        }
      } else if (el._domQueryHandlers) {
        // Remove all delegated handlers for this event
        el._domQueryHandlers
          .filter(h => eventNames.includes(h.event))
          .forEach(h => el.removeEventListener(h.event, h.wrapper));
        el._domQueryHandlers = el._domQueryHandlers.filter(h => !eventNames.includes(h.event));
      } else {
        // Remove all handlers (clone and replace)
        const clone = el.cloneNode(true);
        if (!el.parentNode) {
          return;
        }
        el.parentNode.replaceChild(clone, el);
        // Update internal reference
        const idx = this.elements.indexOf(el);
        this.elements[idx] = clone;
      }
    });
    return this.refreshCollection();
  }

  one(event, handler) {
    const eventNames = getEventNames(event);
    const wrapper = (e) => {
      const event = normalizeEvent(e, e.currentTarget);
      const detail = normalizeEventDetail(event.detail);
      handler.call(e.currentTarget, event, ...detail);
      eventNames.forEach((eventName) => e.currentTarget.removeEventListener(eventName, wrapper));
    };
    this.elements.forEach((el) => {
      eventNames.forEach((eventName) => el.addEventListener(eventName, wrapper));
    });
    return this;
  }

  trigger(event, detail) {
    const eventNames = typeof event === 'string' ? getEventNames(event) : [event];

    this.elements.forEach((el) => {
      eventNames.forEach((eventName) => {
        if (typeof eventName === 'string') {
          if (detail === undefined && eventName === 'focus' && typeof el.focus === 'function') {
            el.focus();
            return;
          }

          if (detail === undefined && eventName === 'blur' && typeof el.blur === 'function') {
            el.blur();
            return;
          }

          if (detail === undefined && eventName === 'click' && typeof el.click === 'function') {
            el.click();
            return;
          }

          const evt = detail === undefined
            ? new Event(eventName, { bubbles: true, cancelable: true })
            : new CustomEvent(eventName, { bubbles: true, cancelable: true, detail });

          el.dispatchEvent(normalizeEvent(evt, el));
          return;
        }

        el.dispatchEvent(normalizeEvent(eventName, el));
      });
    });
    return this;
  }

  // --- Visibility ---
  show() {
    this.elements.forEach(el => {
      const store = getElementDataStore(el);
      el.style.display = store.previousDisplay ?? '';
      if (getComputedStyle(el).display === 'none') {
        el.style.display = getDefaultDisplay(el.tagName);
      }
    });
    return this;
  }

  hide() {
    this.elements.forEach(el => {
      const store = getElementDataStore(el);
      if (el.style.display !== 'none') {
        store.previousDisplay = el.style.display;
      }
      el.style.display = 'none';
    });
    return this;
  }

  toggle(show) {
    this.elements.forEach(el => {
      if (show === undefined) {
        el.style.display = el.style.display === 'none' ? '' : 'none';
      } else {
        el.style.display = show ? '' : 'none';
      }
    });
    return this;
  }

  // --- Dimensions ---
  width(value) {
    if (value === undefined) {
      const el = this.get(0);
      if (isWindowObject(el)) {
        return el.innerWidth;
      }
      if (isDocumentObject(el)) {
        return document.documentElement.clientWidth || 0;
      }
      return el ? el.offsetWidth : 0;
    }
    this.elements.forEach(el => { el.style.width = typeof value === 'number' ? value + 'px' : value; });
    return this;
  }

  height(value) {
    if (value === undefined) {
      const el = this.get(0);
      if (isWindowObject(el)) {
        return el.innerHeight;
      }
      if (isDocumentObject(el)) {
        return document.documentElement.clientHeight || 0;
      }
      return el ? el.offsetHeight : 0;
    }
    this.elements.forEach(el => { el.style.height = typeof value === 'number' ? value + 'px' : value; });
    return this;
  }

  innerWidth() {
    const el = this.get(0);
    if (isWindowObject(el)) {
      return el.innerWidth;
    }
    if (isDocumentObject(el)) {
      return document.documentElement.clientWidth || 0;
    }
    return el ? el.clientWidth : 0;
  }

  innerHeight() {
    const el = this.get(0);
    if (isWindowObject(el)) {
      return el.innerHeight;
    }
    if (isDocumentObject(el)) {
      return document.documentElement.clientHeight || 0;
    }
    return el ? el.clientHeight : 0;
  }

  outerWidth(includeMargin) {
    const el = this.get(0);
    if (!el) return 0;
    if (isWindowObject(el)) {
      return el.innerWidth;
    }
    if (isDocumentObject(el)) {
      return document.documentElement.clientWidth || 0;
    }
    let w = el.offsetWidth;
    if (includeMargin) {
      const style = getComputedStyle(el);
      w += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
    return w;
  }

  outerHeight(includeMargin) {
    const el = this.get(0);
    if (!el) return 0;
    if (isWindowObject(el)) {
      return el.innerHeight;
    }
    if (isDocumentObject(el)) {
      return document.documentElement.clientHeight || 0;
    }
    let h = el.offsetHeight;
    if (includeMargin) {
      const style = getComputedStyle(el);
      h += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }
    return h;
  }

  offset() {
    const el = this.get(0);
    if (!el) return { top: 0, left: 0 };
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.pageYOffset, left: rect.left + window.pageXOffset };
  }

  position() {
    const el = this.get(0);
    if (!el) return { top: 0, left: 0 };
    return { top: el.offsetTop, left: el.offsetLeft };
  }

  scrollTop(value) {
    const el = this.get(0);
    const scrollContainer = getScrollContainer(el);

    if (value === undefined) {
      if (!el) {
        return 0;
      }
      return scrollContainer.scrollTop;
    }
    this.elements.forEach((element) => {
      const target = getScrollContainer(element);
      if (!target) {
        return;
      }

      if (isWindowObject(element)) {
        element.scrollTo(element.scrollX, value);
        return;
      }

      target.scrollTop = value;
    });
    return this;
  }

  // --- Focus ---
  focus() {
    this.elements.forEach(el => el.focus());
    return this;
  }

  blur() {
    this.elements.forEach(el => el.blur());
    return this;
  }

  select() {
    const el = this.get(0);
    if (el && el.select) el.select();
    return this;
  }

  // --- Forms ---
  serialize() {
    const el = this.get(0);
    if (!el || !el.elements) return '';
    return new URLSearchParams(new FormData(el)).toString();
  }

  // --- Check if collection is empty ---
  get [Symbol.iterator]() {
    return this.elements[Symbol.iterator];
  }
}

/**
 * Main selector function. Usage: $$('selector') or $$(element)
 */
function $$(selector, context) {
  return new DomQuery(selector, context);
}

// --- Static utility functions (replacing $.xxx) ---

$$.isArray = Array.isArray;

$$.isFunction = (fn) => typeof fn === 'function';

$$.isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

$$.isWindow = (obj) => obj != null && obj === obj.window;

$$.trim = (str) => str ? str.trim() : '';

$$.inArray = (value, array) => Array.isArray(array) ? array.indexOf(value) : -1;

$$.each = (obj, callback) => {
  if (Array.isArray(obj)) {
    obj.forEach((val, i) => callback(i, val));
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, val]) => callback(key, val));
  }
  return obj;
};

$$.contains = (parent, child) => parent && child ? parent.contains(child) : false;

$$.noop = () => {};

$$.proxy = (fn, context, ...args) => fn.bind(context, ...args);

$$.ajax = (options) => {
  const defaults = { method: 'GET', headers: {}, data: null };
  const opts = Object.assign(defaults, options);
  return fetch(opts.url, {
    method: opts.method,
    headers: opts.headers,
    body: opts.data ? (typeof opts.data === 'string' ? opts.data : JSON.stringify(opts.data)) : null,
  }).then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }).then(html => {
    if (opts.success) opts.success(html);
    return html;
  }).catch(err => {
    if (opts.error) opts.error(err);
    throw err;
  });
};

$$.parseHTML = (html) => {
  return parseHTMLString(html);
};

// Deep merge utility (replaces $.extend(true, ...))
$$.extend = (deepOrTarget, ...args) => {
  if (deepOrTarget === true) {
    // Deep merge
    const target = args[0];
    const sources = args.slice(1);
    for (const source of sources) {
      if (source && typeof source === 'object') {
        for (const key of Object.keys(source)) {
          if (isPlainObject(source[key])) {
            if (!target[key]) target[key] = {};
            $$.extend(true, target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  }
  // Shallow merge
  const target = deepOrTarget;
  for (const source of args) {
    if (source && typeof source === 'object') {
      Object.assign(target, source);
    }
  }
  return target;
};

// Initialize summernote namespace (used by summernote-en-US.js and settings.js)
$$.summernote = $$.summernote || { lang: {} };

export default $$;
