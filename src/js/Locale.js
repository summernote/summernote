define('Locale', function () {
  /**
   * Locale
   */
  var Locale = {
    'en-US': {
      font: {
        bold: 'Bold',
        italic: 'Italic',
        underline: 'Underline',
        strike: 'Strike',
        clear: 'Remove Font Style',
        height: 'Line Height',
        size: 'Font Size'
      },
      image: {
        image: 'Picture',
        insert: 'Insert Image',
        resizeFull: 'Resize Full',
        resizeHalf: 'Resize Half',
        resizeQuarter: 'Resize Quarter',
        floatLeft: 'Float Left',
        floatRight: 'Float Right',
        floatNone: 'Float None',
        dragImageHere: 'Drag an image here',
        selectFromFiles: 'Select from files',
        url: 'Image URL'
      },
      link: {
        link: 'Link',
        insert: 'Insert Link',
        unlink: 'Unlink',
        edit: 'Edit',
        textToDisplay: 'Text to display',
        url: 'To what URL should this link go?'
      },
      video: {
        video: 'Video',
        videoLink: 'Video Link',
        insert: 'Insert Video',
        url: 'Video URL?',
        providers: '(YouTube, Vimeo, Vine, Instagram, or DailyMotion)'
      },
      table: {
        table: 'Table'
      },
      hr: {
        insert: 'Insert Horizontal Rule'
      },
      style: {
        style: 'Style',
        normal: 'Normal',
        blockquote: 'Quote',
        pre: 'Code',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6'
      },
      lists: {
        unordered: 'Unordered list',
        ordered: 'Ordered list'
      },
      options: {
        help: 'Help',
        fullscreen: 'Full Screen',
        codeview: 'Code View'
      },
      paragraph: {
        paragraph: 'Paragraph',
        outdent: 'Outdent',
        indent: 'Indent',
        left: 'Align left',
        center: 'Align center',
        right: 'Align right',
        justify: 'Justify full'
      },
      color: {
        recent: 'Recent Color',
        more: 'More Color',
        background: 'BackColor',
        foreground: 'FontColor',
        transparent: 'Transparent',
        setTransparent: 'Set transparent',
        reset: 'Reset',
        resetToDefault: 'Reset to default'
      },
      shortcut: {
        shortcuts: 'Keyboard shortcuts',
        close: 'Close',
        textFormatting: 'Text formatting',
        action: 'Action',
        paragraphFormatting: 'Paragraph formatting',
        documentStyle: 'Document Style'
      },
      history: {
        undo: 'Undo',
        redo: 'Redo'
      }
    },

    'nl-NL': {
      font: {
        bold: 'Vet',
        italic: 'Cursief',
        underline: 'Onderstrepen',
        strike: 'Doorhalen',
        clear: 'Stijl verwijderen',
        height: 'Regelhoogte',
        size: 'Tekstgrootte'
      },
      image: {
        image: 'Afbeelding',
        insert: 'Afbeelding invoegen',
        resizeFull: 'Volledige breedte',
        resizeHalf: 'Halve breedte',
        resizeQuarter: 'Kwart breedte',
        floatLeft: 'Links uitlijnen',
        floatRight: 'Rechts uitlijnen',
        floatNone: 'Geen uitlijning',
        dragImageHere: 'Sleep hier een afbeelding naar toe',
        selectFromFiles: 'Selecteer een bestand',
        url: 'URL van de afbeelding'
      },
      link: {
        link: 'Link',
        insert: 'Link invoegen',
        unlink: 'Link verwijderen',
        edit: 'Wijzigen',
        textToDisplay: 'Tekst van link',
        url: 'Naar welke URL moet deze link verwijzen?'
      },
      video: {
        video: 'Video',
        videoLink: 'Video Link',
        insert: 'Insert Video',
        url: 'Video URL?',
        providers: '(YouTube, Vimeo, Vine, Instagram, or DailyMotion)'
      },
      table: {
        table: 'Tabel'
      },
      hr: {
        insert: 'Horizontale lijn invoegen'
      },
      style: {
        style: 'Stijl',
        normal: 'Normaal',
        blockquote: 'Quote',
        pre: 'Code',
        h1: 'Kop 1',
        h2: 'Kop 2',
        h3: 'Kop 3',
        h4: 'Kop 4',
        h5: 'Kop 5',
        h6: 'Kop 6'
      },
      lists: {
        unordered: 'Ongeordende lijst',
        ordered: 'Geordende lijst'
      },
      options: {
        help: 'Help',
        fullscreen: 'Volledig scherm',
        codeview: 'Bekijk Code'
      },
      paragraph: {
        paragraph: 'Paragraaf',
        outdent: 'Inspringen verkleinen',
        indent: 'Inspringen vergroten',
        left: 'Links uitlijnen',
        center: 'Centreren',
        right: 'Rechts uitlijnen',
        justify: 'Uitvullen'
      },
      color: {
        recent: 'Recente kleur',
        more: 'Meer kleuren',
        background: 'Achtergrond kleur',
        foreground: 'Tekst kleur',
        transparent: 'Transparant',
        setTransparent: 'Transparant',
        reset: 'Standaard',
        resetToDefault: 'Standaard kleur'
      },
      shortcut: {
        shortcuts: 'Toetsencombinaties',
        close: 'sluiten',
        textFormatting: 'Tekststijlen',
        action: 'Acties',
        paragraphFormatting: 'Paragraafstijlen',
        documentStyle: 'Documentstijlen'
      },
      history: {
        undo: 'Ongedaan maken',
        redo: 'Opnieuw doorvoeren'
      }
    },

    'de-DE': {
      font: {
        bold: 'Fett',
        italic: 'Kursiv',
        underline: 'Unterstreichen',
        strike: 'Durchgestrichen',
        clear: 'Zurücksetzen',
        height: 'Zeilenhöhe',
        size: 'Schriftgröße'
      },
      image: {
        image: 'Grafik',
        insert: 'Grafik einfügen',
        resizeFull: 'Originalgröße',
        resizeHalf: 'Größe 1/2',
        resizeQuarter: 'Größe 1/4',
        floatLeft: 'Linksbündig',
        floatRight: 'Rechtsbündig',
        floatNone: 'Kein Textfluss',
        dragImageHere: 'Ziehen Sie ein Bild mit der Maus hierher',
        selectFromFiles: 'Wählen Sie eine Datei aus',
        url: 'Grafik URL'
      },
      link: {
        link: 'Link',
        insert: 'Link einfügen',
        unlink: 'Link entfernen',
        edit: 'Editieren',
        textToDisplay: 'Anzeigetext',
        url: 'Ziel des Links?'
      },
      video: {
        video: 'Video',
        videoLink: 'Video Link',
        insert: 'Insert Video',
        url: 'Video URL?',
        providers: '(YouTube, Vimeo, Vine, Instagram, or DailyMotion)'
      },
      table: {
        table: 'Tabelle'
      },
      hr: {
        insert: 'Eine horizontale Linie einfügen'
      },
      style: {
        style: 'Stil',
        normal: 'Normal',
        blockquote: 'Zitat',
        pre: 'Quellcode',
        h1: 'Überschrift 1',
        h2: 'Überschrift 2',
        h3: 'Überschrift 3',
        h4: 'Überschrift 4',
        h5: 'Überschrift 5',
        h6: 'Überschrift 6'
      },
      lists: {
        unordered: 'Aufzählung',
        ordered: 'Nummerieung'
      },
      options: {
        help: 'Hilfe',
        fullscreen: 'Vollbild',
        codeview: 'HTML-Code anzeigen'
      },
      paragraph: {
        paragraph: 'Absatz',
        outdent: 'Einzug vergrößern',
        indent: 'Einzug verkleinern',
        left: 'Links ausrichten',
        center: 'Zentriert ausrichten',
        right: 'Rechts ausrichten',
        justify: 'Blocksatz'
      },
      color: {
        recent: 'Letzte Farbe',
        more: 'Mehr Farben',
        background: 'Hintergrundfarbe',
        foreground: 'Schriftfarbe',
        transparent: 'Transparenz',
        setTransparent: 'Transparenz setzen',
        reset: 'Zurücksetzen',
        resetToDefault: 'Auf Standard zurücksetzen'
      },
      shortcut: {
        shortcuts: 'Tastenkürzel',
        close: 'Schließen',
        textFormatting: 'Textformatierung',
        action: 'Aktion',
        paragraphFormatting: 'Absatzformatierung',
        documentStyle: 'Dokumentenstil'
      },
      history: {
        undo: 'Rückgängig',
        redo: 'Wiederholen'
      }
    },

    'ko-KR': {
      font: {
        bold: '굵게',
        italic: '기울임꼴',
        underline: '밑줄',
        strike: '취소선',
        clear: '글자 효과 없애기',
        height: '줄간격',
        size: '글자 크기'
      },
      image: {
        image: '사진',
        insert: '사진 추가',
        resizeFull: '원본 크기로 변경',
        resizeHalf: '50% 크기로 변경',
        resizeQuarter: '25% 크기로 변경',
        floatLeft: '왼쪽 정렬',
        floatRight: '오른쪽 정렬',
        floatNone: '정렬하지 않음',
        dragImageHere: '사진을 이곳으로 끌어오세요',
        selectFromFiles: '파일 선택',
        url: '사진 URL'
      },
      link: {
        link: '링크',
        insert: '링크 추가',
        unlink: '링크 삭제',
        edit: '수정',
        textToDisplay: '링크에 표시할 내용',
        url: '이동할 URL'
      },
      video: {
        video: '동영상',
        videoLink: '동영상 링크',
        insert: '동영상 추가',
        url: '동영상 URL?',
        providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion 사용 가능)'
      },
      table: {
        table: '테이블'
      },
      hr: {
        insert: '구분선 추가'
      },
      style: {
        style: '스타일',
        normal: '본문',
        blockquote: '인용구',
        pre: '코드',
        h1: '제목 1',
        h2: '제목 2',
        h3: '제목 3',
        h4: '제목 4',
        h5: '제목 5',
        h6: '제목 6'
      },
      lists: {
        unordered: '글머리 기호',
        ordered: '번호 매기기'
      },
      options: {
        help: '도움말',
        fullscreen: '전체 화면',
        codeview: '코드 보기'
      },
      paragraph: {
        paragraph: '문단 정렬',
        outdent: '내어쓰기',
        indent: '들여쓰기',
        left: '왼쪽 정렬',
        center: '가운데 정렬',
        right: '오른쪽 정렬',
        justify: '양쪽 정렬'
      },
      color: {
        recent: '마지막으로 사용한 색',
        more: '다른 색 선택',
        background: '배경색',
        foreground: '글자색',
        transparent: '투명',
        setTransparent: '투명',
        reset: '취소',
        resetToDefault: '기본 값으로 변경'
      },
      shortcut: {
        shortcuts: '키보드 단축키',
        close: '닫기',
        textFormatting: '글자 스타일 적용',
        action: '기능',
        paragraphFormatting: '문단 스타일 적용',
        documentStyle: '문서 스타일 적용'
      },
      history: {
        undo: '실행 취소',
        redo: '다시 실행'
      }
    }
  };

  return Locale;
});
