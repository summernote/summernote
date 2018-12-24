import $ from 'jquery';

export function eq<V>(itemA: V): (V) => boolean {
  return function(itemB: V) {
    return itemA === itemB;
  };
}

export function eq2<V>(itemA: V, itemB: V): boolean {
  return itemA === itemB;
}

export function peq2<V>(propName: string): (a: V, b: V) => boolean {
  return (itemA, itemB) => itemA[propName] === itemB[propName];
}

export function ok(): boolean {
  return true;
}

export function fail(): boolean {
  return false;
}

export function not(f: Function): Function {
  return function() {
    return !f.apply(f, arguments);
  };
}

export function and<V>(fA: (V) => boolean, fB: (V) => boolean): (V) => boolean {
  return (item) => fA(item) && fB(item);
}

export function self<V>(a: V): V {
  return a;
}

export function invoke(obj: any, method: string): Function {
  return function() {
    return obj[method].apply(obj, arguments);
  };
}

let idCounter = 0;
/**
 * generate a globally-unique id
 *
 * @param {String} [prefix]
 */
export function uniqueId(prefix?: string): string {
  const id = ++idCounter + '';
  return prefix ? `${prefix}${id}` : id;
}

export interface Bound {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * returns bnd (bounds) from rect
 *
 * - IE Compatibility Issue: http://goo.gl/sRLOAo
 * - Scroll Issue: http://goo.gl/sNjUc
 */
export function rect2bnd(rect): Bound {
  const $document = $(document);
  return {
    top: rect.top + $document.scrollTop(),
    left: rect.left + $document.scrollLeft(),
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
  };
}

/**
 * returns a copy of the object where the keys have become the values and
 * the values the keys.
 */
export function invertObject(obj: any): any {
  const inverted = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      inverted[obj[key]] = key;
    }
  }
  return inverted;
}

export function namespaceToCamel(namespace: string, prefix?: string): string {
  prefix = prefix || '';
  return prefix + namespace.split('.').map((name) => {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }).join('');
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */
export function debounce(
  func: Function, wait: number, immediate: boolean
): Function {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function isValidUrl(url): boolean {
  const expression =
    /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return expression.test(url);
}
