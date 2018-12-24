import * as $ from 'jquery';
import PromiseImpl from 'promise-polyfill';

/**
 * read contents of file as representing URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new PromiseImpl((resolve, reject) => {
    $.extend(new FileReader(), {
      onload: (e) => {
        const dataURL = e.target.result;
        resolve(dataURL);
      },
      onerror: (err) => {
        reject(err);
      },
    }).readAsDataURL(file);
  });
}

/**
 * create `<image>` from url string
 */
export function createImage(url: string): Promise<JQuery> {
  return new PromiseImpl((resolve, reject) => {
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
