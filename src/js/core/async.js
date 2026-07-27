import $ from 'jquery';

/**
 * @method readFileAsDataURL
 *
 * read contents of file as representing URL
 *
 * @param {File} file
 * @return {Promise} - then: dataUrl
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    $.extend(new FileReader(), {
      onload: (event) => {
        const dataURL = event.target.result;
        resolve(dataURL);
      },
      onerror: (err) => {
        reject(err);
      },
    }).readAsDataURL(file);
  });
}

/**
 * @method createImage
 *
 * create `<image>` from url string
 *
 * @param {String} url
 * @return {Promise} - then: $image
 */
export function createImage(url) {
  return new Promise((resolve, reject) => {
    const $img = $('<img>');

    $img.one('load', () => {
      $img.off('error abort');
      resolve($img);
    }).one('error abort', () => {
      $img.off('load').detach();
      reject($img);
    }).css({
      display: 'none',
    }).appendTo(document.body).attr('src', url);
  });
}
