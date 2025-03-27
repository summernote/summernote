import $ from 'jquery';

/**
 * returns whether font is installed or not.
 *
 * @param {String} fontName
 * @return {Boolean}
 */
const genericFontFamilies = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];

function validFontName(fontName) {
  return ($.inArray(fontName.toLowerCase(), genericFontFamilies) === -1) ? `'${fontName}'` : fontName;
}

function createIsFontInstalledFunc() {
  const testText = "mw";
  const fontSize = "20px";
  const canvasWidth = 40;
  const canvasHeight = 20;

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context.textAlign = "center";
  context.fillStyle = "black";
  context.textBaseline = "middle";

  function getPxInfo(font, testFontName) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.font = fontSize + ' ' + validFontName(font) + ', "' + testFontName + '"';
    context.fillText(testText, canvasWidth / 2, canvasHeight / 2);
    // Get pixel information
    var pxInfo = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
    return pxInfo.join("");
  }

  return (fontName) => {
    const testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
    let testInfo = getPxInfo(testFontName, testFontName);
    let fontInfo = getPxInfo(fontName, testFontName);
    return testInfo !== fontInfo;
  };
}

const userAgent = navigator.userAgent;
const isMSIE = /MSIE|Trident/i.test(userAgent);
let browserVersion;
if (isMSIE) {
  let matches = /MSIE (\d+[.]\d+)/.exec(userAgent);
  if (matches) {
    browserVersion = parseFloat(matches[1]);
  }
  matches = /Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/.exec(userAgent);
  if (matches) {
    browserVersion = parseFloat(matches[1]);
  }
}

const isEdge = /Edge\/\d+/.test(userAgent);

const isSupportTouch =
  (('ontouchstart' in window) ||
   (navigator.MaxTouchPoints > 0) ||
   (navigator.msMaxTouchPoints > 0));

// [workaround] IE doesn't have input events for contentEditable
// - see: https://goo.gl/4bfIvA
const inputEventName = (isMSIE) ? 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted' : 'input';

/**
 * @class core.env
 *
 * Object which check platform and agent
 *
 * @singleton
 * @alternateClassName env
 */
export default {
  isMac: navigator.appVersion.indexOf('Mac') > -1,
  isMSIE,
  isEdge,
  isFF: !isEdge && /firefox/i.test(userAgent),
  isPhantom: /PhantomJS/i.test(userAgent),
  isWebkit: !isEdge && /webkit/i.test(userAgent),
  isChrome: !isEdge && /chrome/i.test(userAgent),
  isSafari: !isEdge && /safari/i.test(userAgent) && (!/chrome/i.test(userAgent)),
  browserVersion,
  isSupportTouch,
  isFontInstalled: createIsFontInstalledFunc(),
  isW3CRangeSupport: !!document.createRange,
  inputEventName,
  genericFontFamilies,
  validFontName,
};
