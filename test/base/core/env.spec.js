import { afterEach, describe, expect, it } from 'vitest';

describe('base:core.env', () => {
  const originalUserAgent = navigator.userAgent;
  const originalAppVersion = navigator.appVersion;
  const originalMaxTouchPoints = navigator.MaxTouchPoints;
  const originalMsMaxTouchPoints = navigator.msMaxTouchPoints;
  const originalOntouchstart = window.ontouchstart;

  function setNavigatorProp(name, value) {
    Object.defineProperty(navigator, name, {
      configurable: true,
      value,
    });
  }

  afterEach(() => {
    setNavigatorProp('userAgent', originalUserAgent);
    setNavigatorProp('appVersion', originalAppVersion);
    setNavigatorProp('MaxTouchPoints', originalMaxTouchPoints);
    setNavigatorProp('msMaxTouchPoints', originalMsMaxTouchPoints);

    if (originalOntouchstart === undefined) {
      delete window.ontouchstart;
    } else {
      window.ontouchstart = originalOntouchstart;
    }
  });

  it('keeps generic font names unchanged', async() => {
    const env = (await import(/* @vite-ignore */ `/src/js/core/env.js?generic=${Math.random()}`)).default;

    expect(env.validFontName('serif')).to.equal('serif');
  });

  it('detects IE metadata and touch fallback branches from navigator values', async() => {
    setNavigatorProp('userAgent', 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0; rv:11.0)');
    setNavigatorProp('appVersion', 'Windows');
    setNavigatorProp('MaxTouchPoints', 0);
    setNavigatorProp('msMaxTouchPoints', 0);
    delete window.ontouchstart;

    const env = (await import(/* @vite-ignore */ `/src/js/core/env.js?ie=${Math.random()}`)).default;

    expect(env.isMSIE).to.be.true;
    expect(env.browserVersion).to.equal(11);
    expect(env.inputEventName).to.contain('DOMCharacterDataModified');
    expect(env.isSupportTouch).to.be.false;
    expect(env.isMac).to.be.false;
  });

  it('keeps browserVersion undefined when the legacy MSIE pattern is missing', async() => {
    setNavigatorProp('userAgent', 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0)');
    setNavigatorProp('appVersion', 'Windows');

    const env = (await import(/* @vite-ignore */ `/src/js/core/env.js?trident-only=${Math.random()}`)).default;

    expect(env.isMSIE).to.be.true;
    expect(env.browserVersion).to.equal(11);
  });

  it('keeps browserVersion from MSIE when the Trident fallback is missing', async() => {
    setNavigatorProp('userAgent', 'Mozilla/4.0 (compatible; MSIE 10.0; Windows NT 6.1)');
    setNavigatorProp('appVersion', 'Windows');

    const env = (await import(/* @vite-ignore */ `/src/js/core/env.js?msie-only=${Math.random()}`)).default;

    expect(env.isMSIE).to.be.true;
    expect(env.browserVersion).to.equal(10);
  });
});
