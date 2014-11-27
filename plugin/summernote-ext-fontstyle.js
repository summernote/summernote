(function ($) {
  // template, editor
  var tmpl = $.summernote.renderer.getTemplate();
  var editor = $.summernote.eventHandler.getEditor();

  // add plugin
  $.summernote.addPlugin({
    name: 'fontstyle', // name of plugin
    buttons: { // buttons
      strikethrough: function (lang) {
        return tmpl.iconButton('fa fa-strikethrough', {
          event: 'strikethrough',
          title: lang.fontstyle.strikethrough
        });
      },
      superscript: function (lang) {
        return tmpl.iconButton('fa fa-superscript', {
          event: 'superscript',
          title: lang.fontstyle.superscript
        });
      },
      subscript: function (lang) {
        return tmpl.iconButton('fa fa-subscript', {
          event: 'subscript',
          title: lang.fontstyle.subscript
        });
      },
      fontsize: function (lang, options) {
        var items = options.fontSizes.reduce(function (memo, v) {
          return memo + '<li><a data-event="fontsize" href="#" data-value="' + v + '">' +
                          '<i class="fa fa-check"></i> ' + v +
                        '</a></li>';
        }, '');

        var label = '<span class="note-current-fontsize">11</span>';
        return tmpl.button(label, {
          title: lang.fontstyle.size,
          dropdown: '<ul class="dropdown-menu">' + items + '</ul>'
        });
      }
    },

    events: { // events
      strikethrough: function (layoutInfo) {
        editor.strikethrough(layoutInfo.editable());
      },
      superscript: function (layoutInfo) {
        editor.superscript(layoutInfo.editable());
      },
      subscript: function (layoutInfo) {
        editor.subscript(layoutInfo.editable());
      },
      fontsize: function (layoutInfo, value) {
        editor.fontSize(layoutInfo.editable(), value);
      }
    },

    options: {
      fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36']
    },

    langs: {
      'en-US': {
        fontstyle: {
          strikethrough: 'Strikethrough',
          subscript: 'Subscript',
          superscript: 'Superscript',
          size: 'Font Size'
        }
      },
      'ar-AR': {
        fontstyle: {
          strikethrough: 'فى وسطه خط',
          size: 'الحجم'
        }
      },
      'cs-CZ': {
        fontstyle: {
          strikethrough: 'Přeškrtnuté',
          size: 'Velikost písma'
        }
      },
      'ca-ES': {
        fontstyle: {
          strikethrough: 'Ratllat',
          size: 'Mida de lletra'
        }
      },
      'da-DK': {
        fontstyle: {
          strikethrough: 'Gennemstreget',
          subscript: 'Sænket skrift',
          superscript: 'Hævet skrift',
          size: 'Skriftstørrelse'
        }
      },
      'de-DE': {
        fontstyle: {
          strikethrough: 'Durchgestrichen',
          size: 'Schriftgröße'
        }
      },
      'es-ES': {
        fontstyle: {
          strikethrough: 'Tachado',
          superscript: 'Superíndice',
          subscript: 'Subíndice',
          size: 'Tamaño de la fuente'
        }
      },
      'es-EU': {
        fontstyle: {
          strikethrough: 'Marratua',
          size: 'Letren neurria'
        }
      },
      'fa-IR': {
        fontstyle: {
          strikethrough: 'Strike',
          size: 'اندازه ی فونت'
        }
      },
      'fi-FI': {
        fontstyle: {
          strikethrough: 'Yliviivaus',
          size: 'Kirjasinkoko'
        }
      },
      'fr-FR': {
        fontstyle: {
          strikethrough: 'Barré',
          superscript: 'Exposant',
          subscript: 'Indicé',
          size: 'Taille de police'
        }
      },
      'he-IL': {
        fontstyle: {
          strikethrough: 'קו חוצה',
          subscript: 'כתב תחתי',
          superscript: 'כתב עילי',
          size: 'גודל גופן'
        }
      },
      'hu-HU': {
        fontstyle: {
          strikethrough: 'Áthúzott',
          size: 'Betűméret'
        }
      },
      'id-ID': {
        fontstyle: {
          strikethrough: 'Coret',
          size: 'Ukuran font'
        }
      },
      'it-IT': {
        fontstyle: {
          strikethrough: 'Testo barrato',
          size: 'Dimensione del carattere'
        }
      },
      'jp-JP': {
        fontstyle: {
          strikethrough: '取り消し線',
          size: '大きさ'
        }
      },
      'ko-KR': {
        fontstyle: {
          superscript: '위 첨자',
          subscript: '아래 첨자',
          strikethrough: '취소선',
          size: '글자 크기'
        }
      },
      'nb-NO': {
        fontstyle: {
          strikethrough: 'Gjennomstrek',
          size: 'Skriftstørrelse'
        }
      },
      'nl-NL': {
        fontstyle: {
          strikethrough: 'Doorhalen',
          size: 'Tekstgrootte'
        }
      },
      'pl-PL': {
        fontstyle: {
          strikethrough: 'Przekreślenie',
          size: 'Rozmiar'
        }
      },
      'pt-BR': {
        fontstyle: {
          strikethrough: 'Riscado',
          size: 'Tamanho da fonte'
        }
      },
      'ro-RO': {
        fontstyle: {
          strikethrough: 'Tăiat',
          size: 'Dimensiune font'
        }
      },
      'ru-RU': {
        fontstyle: {
          strikethrough: 'Зачёркнутый',
          subscript: 'Нижний индекс',
          superscript: 'Верхний индекс',
          size: 'Размер шрифта'
        }
      },
      'sk-SK': {
        fontstyle: {
          strikethrough: 'Preškrtnuté',
          size: 'Veľkosť písma'
        }
      },
      'sl-SI': {
        fontstyle: {
          strikethrough: 'Prečrtano',
          subscript: 'Podpisano',
          superscript: 'Nadpisano',
          size: 'Velikost pisave'
        }
      },
      'sr-RS': {
        fontstyle: {
          strikethrough: 'Прецртано',
          size: 'Величина фонта'
        }
      },
      'sr-RS-Latin': {
        fontstyle: {
          strikethrough: 'Precrtano',
          size: 'Veličina fonta'
        }
      },
      'sv-SE': {
        fontstyle: {
          strikethrough: 'Genomstruken',
          size: 'Teckenstorlek'
        }
      },
      'th-TH': {
        fontstyle: {
          strikethrough: 'ขีดฆ่า',
          subscript: 'ตัวห้อย',
          superscript: 'ตัวยก',
          size: 'ขนาดตัวอักษร'
        }
      },
      'tr-TR': {
        fontstyle: {
          strikethrough: 'Üstü çizili',
          subscript: 'Subscript',
          superscript: 'Superscript',
          size: 'Yazı tipi boyutu'
        }
      },
      'uk-UA': {
        fontstyle: {
          strikethrough: 'Закреслений',
          subscript: 'Нижній індекс',
          superscript: 'Верхній індекс',
          size: 'Розмір шрифту'
        }
      },
      'vi-VN': {
        fontstyle: {
          strikethrough: 'Gạch Ngang',
          size: 'Cỡ Chữ'
        }
      },
      'zh-CN': {
        fontstyle: {
          strikethrough: '删除线',
          size: '字号'
        }
      },
      'zh-TW': {
        fontstyle: {
          strikethrough: '刪除線',
          size: '字體大小'
        }
      }
    }
  });
})(jQuery);
