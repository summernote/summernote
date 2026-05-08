import { afterEach, describe, expect, it, vi } from 'vitest';
import $$ from '@/js/core/dom-query.js';

describe('base:core.dom-query', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    $$('body').empty();
    delete window.bootstrap;
  });

  describe('extend', () => {
    it('preserves regular expressions during deep merges', () => {
      const source = {
        nested: {
          pattern: /<script>/gi,
        },
      };

      const merged = $$.extend(true, {}, source);

      expect(merged.nested.pattern).toBeInstanceOf(RegExp);
      expect(merged.nested.pattern.source).to.equal('<script>');
      expect(merged.nested.pattern.flags).to.equal('gi');
    });
  });

  describe('visibility helpers', () => {
    it('shows elements hidden by stylesheet rules', () => {
      const style = $$('<style>.hidden-by-css { display: none; }</style>').appendTo('body');
      const $element = $$('<div class="hidden-by-css">popover</div>').appendTo('body');

      $element.show();

      expect(getComputedStyle($element[0]).display).to.equal('block');

      style.remove();
    });
  });

  describe('attributes, properties, and data', () => {
    it('supports css, attr, prop, and data getters and setters', () => {
      const $element = $$('<div data-role="server"></div>').appendTo('body');

      $element.css({ width: 10, opacity: 0, zIndex: 3 });
      $element.attr({ title: 'hello', hidden: false, 'data-state': 'ready' });
      $element.prop({ customFlag: true });
      $element.data({ count: 2, extra: 'value' });
      $element.data('single', 3);

      expect($element.css('width')).to.equal('10px');
      expect($element.css('opacity')).to.equal('0');
      expect($element.attr('title')).to.equal('hello');
      expect($element.attr('hidden')).to.equal(null);
      expect($element.prop('customFlag')).to.be.true;
      expect($element.data('count')).to.equal(2);
      expect($element.data('role')).to.equal('server');
      expect($element.data()).to.include({ role: 'server', count: 2, extra: 'value', single: 3 });

      $element.removeData('role').removeData();

      expect($element.data('role')).to.equal(undefined);
      expect($element.data()).to.deep.equal({ state: 'ready' });
    });
  });

  describe('content helpers', () => {
    it('supports html, text, and val with strings, nodes, arrays, and DomQuery objects', () => {
      const $element = $$('<div></div>').appendTo('body');
      const $child = $$('<span class="from-dom-query">child</span>');
      const node = document.createElement('strong');
      node.textContent = 'node';

      $element.html(['before', node, $child, '<em>after</em>']);
      expect($element.html()).to.contain('<strong>node</strong>');
      expect($element.find('.from-dom-query').length).to.equal(1);

      $element.text('plain text');
      expect($element.text()).to.equal('plain text');

      const $input = $$('<input>').appendTo('body');
      $input.val('typed');
      expect($input.val()).to.equal('typed');
    });
  });

  describe('traversal helpers', () => {
    it('supports find/closest/parent/parents/parentsUntil/children/siblings/prev/next/is/not/eq', () => {
      const $fixture = $$([
        '<div class="outer">',
        '  <section class="middle stop-here">',
        '    <div id="parent">',
        '      <span class="child first special">one</span>',
        '      <span class="child second">two</span>',
        '      <span class="child third">three</span>',
        '    </div>',
        '  </section>',
        '</div>',
      ].join('')).appendTo('body');
      const $children = $fixture.find('.child');
      const $second = $children.eq(1);

      expect($fixture.find('#parent').length).to.equal(1);
      expect($second.closest('.outer').length).to.equal(1);
      expect($second.parent().attr('id')).to.equal('parent');
      expect($second.parents('.outer').length).to.equal(1);
      expect($second.parentsUntil('.stop-here').hasClass('middle')).to.be.false;
      expect($fixture.find('#parent').children('.child').length).to.equal(3);
      expect($second.siblings('.child').length).to.equal(2);
      expect($second.prev().hasClass('first')).to.be.true;
      expect($second.next().hasClass('third')).to.be.true;
      expect($second.is('.second')).to.be.true;
      expect($second.is((el) => el.classList.contains('second'))).to.be.true;
      expect($children.not('.second').length).to.equal(2);
      expect($children.eq(-1).hasClass('third')).to.be.true;
    });
  });

  describe('events and bootstrap wrappers', () => {
    it('supports one, trigger, tooltip, and modal helpers', () => {
      const $button = $$('<button type="button"></button>').appendTo('body');
      const handler = vi.fn();
      const tooltipMethod = vi.fn();
      const modalMethod = vi.fn();

      window.bootstrap = {
        Tooltip: {
          getOrCreateInstance: vi.fn(() => ({ show: tooltipMethod })),
        },
        Modal: {
          getOrCreateInstance: vi.fn(() => ({ hide: modalMethod })),
        },
      };

      $button.one('custom', handler);
      $button.trigger('custom', ['payload']);
      $button.trigger('custom', ['payload-again']);
      $button.tooltip({ container: $$('body') });
      $button.tooltip('show');
      $button.modal('hide');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][1]).to.equal('payload');
      expect(window.bootstrap.Tooltip.getOrCreateInstance).toHaveBeenCalled();
      expect(tooltipMethod).toHaveBeenCalledTimes(1);
      expect(modalMethod).toHaveBeenCalledTimes(1);
    });
  });

  describe('dom manipulation helpers', () => {
    it('supports append, prepend, before, after, insertBefore, insertAfter, and replaceWith', () => {
      const $host = $$([
        '<div class="host">',
        '  <div class="target first"></div>',
        '  <div class="target second"></div>',
        '</div>',
      ].join('')).appendTo('body');
      const $targets = $host.find('.target');

      $targets.append('<span class="append">a</span>');
      $targets.prepend('<span class="prepend">p</span>');
      $targets.before($$('<i class="before">b</i>'));
      $targets.after($$('<i class="after">a</i>'));

      const $moveBefore = $$('<u class="move-before"></u>');
      const $moveAfter = $$('<u class="move-after"></u>');
      $moveBefore.insertBefore($targets.eq(0));
      $moveAfter.insertAfter($targets.eq(-1));

      expect($host.find('.append').length).to.equal(2);
      expect($host.find('.prepend').length).to.equal(2);
      expect($host.find('.before').length).to.equal(2);
      expect($host.find('.after').length).to.equal(2);

      $targets.eq(0).replaceWith('<article class="replaced"></article>');
      $targets.eq(1).replaceWith($$('<article class="replaced-dom-query"></article>'));

      expect($host.find('.move-before').length).to.equal(1);
      expect($host.find('.move-after').length).to.equal(1);
      expect($host.find('.replaced').length).to.equal(1);
      expect($host.find('.replaced-dom-query').length).to.equal(1);
    });
  });

  describe('static utilities', () => {
    it('supports utility helpers and ajax callbacks', async() => {
      const success = vi.fn();
      const error = vi.fn();
      const fetchMock = vi.fn()
        .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('ok') })
        .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('fail') });

      vi.stubGlobal('fetch', fetchMock);

      expect($$.trim(' hello ')).to.equal('hello');
      expect($$.inArray('b', ['a', 'b'])).to.equal(1);
      expect($$.contains(document.body, document.body.appendChild(document.createElement('div')))).to.be.true;

      expect(await $$.ajax({ url: '/ok', success })).to.equal('ok');
      await expect($$.ajax({ url: '/fail', error })).rejects.to.throw('HTTP 500');

      expect(success).toHaveBeenCalledWith('ok');
      expect(error).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('covers collection, class, dimension, event, and static helper branches', () => {
      const fragment = document.createDocumentFragment();
      const fragChild = document.createElement('div');
      fragChild.id = 'fragment-node';
      fragChild.className = 'from-fragment';
      fragment.appendChild(fragChild);

      const $fromContext = $$('#fragment-node', fragment);
      const $fromNodeList = $$(fragment.childNodes);
      const $fromDomQuery = $$($fromNodeList);

      expect($fromContext.get(0)).to.equal(fragChild);
      expect($fromDomQuery.first().get(0)).to.equal(fragChild);
      expect($fromDomQuery.last().get(0)).to.equal(fragChild);
      expect($fromDomQuery.map((_, el) => el.id)).to.deep.equal(['fragment-node']);
      expect($$('.from-fragment', [fragment]).length).to.equal(1);

      const eachIndexes = [];
      $fromDomQuery.each(function(index, el) {
        eachIndexes.push([index, this === el]);
      });
      expect(eachIndexes).to.deep.equal([[0, true]]);
      expect($fromDomQuery.filter('.from-fragment').length).to.equal(1);
      expect($fromDomQuery.filter((_, el) => el.id === 'fragment-node').length).to.equal(1);
      expect($fromDomQuery.not(function() {
        return false;
      }).length).to.equal(1);
      expect($fromDomQuery.get()).to.equal(fragChild);
      expect($fromDomQuery.eq(9).length).to.equal(0);
      expect($$('#missing-simple-id').length).to.equal(0);
      expect($$().css('width')).to.equal(undefined);
      expect($$().data()).to.equal(undefined);
      const $emptyCollection = $$();
      expect($emptyCollection.css()).to.equal($emptyCollection);
      expect($emptyCollection.attr('title')).to.equal(undefined);
      expect($emptyCollection.prop('title')).to.equal(undefined);
      expect($emptyCollection.html()).to.equal('');
      expect($emptyCollection.text()).to.equal('');
      expect($emptyCollection.val()).to.equal(undefined);

      const $fixture = $$([
        '<div id="fixture-id" class="fixture">',
        '  <div class="target first"></div>',
        '  <div class="target second"></div>',
        '</div>',
      ].join('')).appendTo('body');
      const $targets = $fixture.children();
      const $firstTarget = $targets.eq(0);
      const button = document.createElement('button');
      button.name = 'pick';
      button.value = 'yes';

      $targets.addClass('alpha beta', ['gamma']);
      expect($targets.hasClass('alpha')).to.be.true;
      expect($$('.target', $fixture).length).to.equal(2);
      expect($$('#fixture-id').get(0)).to.equal($fixture.get(0));
      $targets.toggleClass('toggle').toggleClass('toggle', false);
      expect($targets.hasClass('toggle')).to.be.false;
      $targets.removeClass('beta gamma');
      expect($targets.hasClass('beta')).to.be.false;
      expect($targets.eq(0).closest('.missing').length).to.equal(0);
      expect($targets.eq(0).parent('.missing').length).to.equal(0);
      expect($targets.eq(0).prev().length).to.equal(0);
      expect($targets.eq(1).next().length).to.equal(0);

      $firstTarget.append(document.createElement('span'));
      $firstTarget.append($$('<em class="from-dom-query"></em>'));
      $firstTarget.prepend(button);
      $firstTarget.prepend($$('<strong class="from-prepend"></strong>'));

      const beforeElement = document.createElement('i');
      beforeElement.className = 'before-element';
      const afterElement = document.createElement('i');
      afterElement.className = 'after-element';
      $firstTarget.before('<small class="before-string"></small>');
      $firstTarget.before(beforeElement);
      $firstTarget.after('<small class="after-string"></small>');
      $firstTarget.after(afterElement);

      const orphan = document.createElement('div');
      $$(orphan).before($$('<span class="ignored-before"></span>'));
      $$(orphan).after($$('<span class="ignored-after"></span>'));
      expect(document.querySelector('.ignored-before')).to.equal(null);
      expect(document.querySelector('.ignored-after')).to.equal(null);

      $firstTarget.wrap('<section class="wrap"></section>');
      expect($fixture.find('.wrap').length).to.equal(1);
      $fixture.find('.target').eq(0).unwrap();
      expect($fixture.find('.wrap').length).to.equal(0);
      const $bodyChild = $$('<div class="body-child"></div>').appendTo('body');
      $bodyChild.unwrap();
      expect(document.body.contains($bodyChild[0])).to.be.true;

      const $replacementTarget = $$('<div class="replace-target"></div>').appendTo($fixture);
      const replacementNode = document.createElement('article');
      replacementNode.className = 'replacement-element';
      $replacementTarget.replaceWith(replacementNode);
      expect($fixture.find('.replacement-element').length).to.equal(1);
      $$('<div class="replace-noop"></div>').appendTo($fixture).replaceWith(123);
      expect($fixture.find('.replace-noop').length).to.equal(1);
      $$('<div class="no-replace"></div>').appendTo($fixture).replaceWith($$());
      expect($fixture.find('.no-replace').length).to.equal(1);

      const $detached = $$('<div class="detached"></div>').appendTo($fixture).detach();
      expect($detached.length).to.equal(1);
      expect($fixture.find('.detached').length).to.equal(0);
      $detached.detach().remove();
      expect($detached.length).to.equal(0);

      const $cloned = $fixture.clone(false);
      expect($cloned.get(0).childNodes.length).to.equal(0);
      expect($$(document.createElement('span')).siblings().length).to.equal(0);
      expect($$(document.createElement('span')).is(123)).to.be.false;

      $targets.removeClass();
      expect($targets.get(0).className).to.equal('');

      const directHandler = vi.fn();
      const delegatedHandler = vi.fn();
      const cleanupHandler = vi.fn();
      const nativeHandler = vi.fn();
      const normalizedHandler = vi.fn((event) => {
        expect(event.originalEvent).to.equal(event);
        expect(event.isDefaultPrevented()).to.be.false;
      });
      const $eventHost = $$('<div class="event-host"><button class="event-child"></button></div>').appendTo('body');
      const $eventButton = $eventHost.find('button');
      const eventButton = $eventButton.get(0);

      eventButton.focus = vi.fn();
      eventButton.blur = vi.fn();
      eventButton.click = vi.fn();

      $eventButton.on('alpha beta', directHandler);
      $eventButton.on('normalized', normalizedHandler);
      $eventHost.on('delegated', '.event-child', delegatedHandler);
      $eventButton.trigger('alpha', 'payload');
      $eventButton.trigger(new CustomEvent('beta', { bubbles: true, detail: ['array-detail'] }));
      $eventButton.trigger('normalized');
      $eventButton.trigger('focus').trigger('blur').trigger('click');
      $eventButton.trigger('delegated', ['delegated-detail']);

      expect(directHandler).toHaveBeenCalledTimes(2);
      expect(normalizedHandler).toHaveBeenCalledTimes(1);
      expect(directHandler.mock.calls[0][1]).to.equal('payload');
      expect(directHandler.mock.calls[1][1]).to.equal('array-detail');
      expect(delegatedHandler).toHaveBeenCalledTimes(1);
      expect(eventButton.focus).toHaveBeenCalledTimes(1);
      expect(eventButton.blur).toHaveBeenCalledTimes(1);
      expect(eventButton.click).toHaveBeenCalledTimes(1);

      $eventButton.off('alpha', directHandler);
      $eventButton.trigger('alpha');
      expect(directHandler).toHaveBeenCalledTimes(2);

      $eventButton.off('beta');
      $eventButton.trigger('beta');
      expect(directHandler).toHaveBeenCalledTimes(2);

      eventButton.addEventListener('native', nativeHandler);
      const removeSpy = vi.spyOn(eventButton, 'removeEventListener');
      delete eventButton._domQueryHandlers;
      $eventButton.off('native', nativeHandler);
      expect(removeSpy).toHaveBeenCalledWith('native', nativeHandler);

      const originalButton = $eventButton.get(0);
      $eventButton.on('cleanup', cleanupHandler);
      $eventButton.off();
      $eventButton.trigger('cleanup');
      expect(cleanupHandler).not.toHaveBeenCalled();
      expect($eventButton.get(0)).to.equal(originalButton);

      delete originalButton._domQueryHandlers;
      $eventButton.off('untracked');
      expect($eventButton.get(0)).not.to.equal(originalButton);
      const detachedButton = document.createElement('button');
      delete detachedButton._domQueryHandlers;
      expect(() => $$(detachedButton).off('detached')).not.to.throw();
      $eventHost.on('delegated-text', '.event-child', delegatedHandler);
      $eventHost.trigger(new CustomEvent('delegated-text', { bubbles: true, detail: 'ignored' }));
      expect(delegatedHandler).toHaveBeenCalledTimes(1);

      const $input = $$('<input value="start">').appendTo('body');
      const inputElement = $input.get(0);
      inputElement.focus = vi.fn();
      inputElement.blur = vi.fn();
      inputElement.select = vi.fn();
      $input.focus().blur().select();
      expect(inputElement.focus).toHaveBeenCalledTimes(1);
      expect(inputElement.blur).toHaveBeenCalledTimes(1);
      expect(inputElement.select).toHaveBeenCalledTimes(1);

      const $box = $$('<div class="box"></div>').appendTo('body');
      Object.defineProperty($box[0], 'offsetWidth', { configurable: true, value: 50 });
      Object.defineProperty($box[0], 'offsetHeight', { configurable: true, value: 40 });
      Object.defineProperty($box[0], 'clientWidth', { configurable: true, value: 45 });
      Object.defineProperty($box[0], 'clientHeight', { configurable: true, value: 35 });
      Object.defineProperty($box[0], 'offsetTop', { configurable: true, value: 12 });
      Object.defineProperty($box[0], 'offsetLeft', { configurable: true, value: 14 });
      vi.spyOn($box[0], 'getBoundingClientRect').mockReturnValue({ top: 5, left: 7 });
      $box.css({ marginLeft: '2px', marginRight: '3px', marginTop: '1px', marginBottom: '4px' });
      $box.css('left', 5);
      $box.attr('data-temp', 'yes');
      $box.attr('data-temp', false);
      $box.removeAttr('class');
      $box.prop('title', 'box');
      const nativeGetComputedStyle = window.getComputedStyle.bind(window);
      const computedStyleStub = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
        if (element === $box[0]) {
          return {
            getPropertyValue: (property) => property === 'zIndex' ? '' : '0',
            zIndex: '3',
            marginLeft: '2px',
            marginRight: '3px',
            marginTop: '1px',
            marginBottom: '4px',
          };
        }
        return nativeGetComputedStyle(element);
      });

      expect($box.width()).to.equal(50);
      expect($box.height()).to.equal(40);
      expect($box.innerWidth()).to.equal(45);
      expect($box.innerHeight()).to.equal(35);
      expect($box.outerWidth(true)).to.equal(55);
      expect($box.outerHeight(true)).to.equal(45);
      expect($box.offset()).to.deep.equal({ top: 5, left: 7 });
      expect($box.position()).to.deep.equal({ top: 12, left: 14 });
      expect($box[0].style.left).to.equal('5px');
      expect($box.attr('data-temp')).to.equal(null);
      expect($box.prop('title')).to.equal('box');
      expect($box.css('zIndex')).to.equal('3');
      computedStyleStub.mockRestore();

      $box.width(25).height(30);
      expect($box[0].style.width).to.equal('25px');
      expect($box[0].style.height).to.equal('30px');
      expect($box.outerWidth()).to.equal(50);
      expect($box.outerHeight()).to.equal(40);

      expect($$(window).width()).to.equal(window.innerWidth);
      expect($$(window).height()).to.equal(window.innerHeight);
      expect($$(window).innerWidth()).to.equal(window.innerWidth);
      expect($$(window).innerHeight()).to.equal(window.innerHeight);
      expect($$(window).outerWidth()).to.equal(window.innerWidth);
      expect($$(window).outerHeight()).to.equal(window.innerHeight);
      expect($$(document).width()).to.equal(document.documentElement.clientWidth);
      expect($$(document).height()).to.equal(document.documentElement.clientHeight);
      expect($$(document).innerWidth()).to.equal(document.documentElement.clientWidth);
      expect($$(document).innerHeight()).to.equal(document.documentElement.clientHeight);
      expect($$(document).outerWidth()).to.equal(document.documentElement.clientWidth);
      expect($$(document).outerHeight()).to.equal(document.documentElement.clientHeight);
      expect($$().width()).to.equal(0);
      expect($$().height()).to.equal(0);
      expect($$().innerWidth()).to.equal(0);
      expect($$().innerHeight()).to.equal(0);
      expect($$().outerWidth()).to.equal(0);
      expect($$().outerHeight()).to.equal(0);
      expect($$().offset()).to.deep.equal({ top: 0, left: 0 });
      expect($$().position()).to.deep.equal({ top: 0, left: 0 });

      $box[0].style.display = 'inline';
      $box.hide();
      expect($box[0].style.display).to.equal('none');
      $box.show();
      expect($box[0].style.display).to.equal('inline');
      $box.toggle();
      expect($box[0].style.display).to.equal('none');
      $box.toggle(true);
      expect($box[0].style.display).to.equal('');
      $box.toggle(false);
      expect($box[0].style.display).to.equal('none');

      const $scrollable = $$('<div></div>').appendTo('body');
      Object.defineProperty($scrollable[0], 'scrollTop', { configurable: true, writable: true, value: 3 });
      expect($scrollable.scrollTop()).to.equal(3);
      $scrollable.scrollTop(9);
      expect($scrollable[0].scrollTop).to.equal(9);
      expect($$().scrollTop()).to.equal(0);
      expect(() => $$([null]).scrollTop(5)).not.to.throw();
      const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      $$(window).scrollTop(11);
      expect(scrollSpy).toHaveBeenCalledWith(window.scrollX, 11);

      const $form = $$('<form><input name="a" value="1"><input name="b" value="two"></form>').appendTo('body');
      expect($form.serialize()).to.equal('a=1&b=two');
      expect($$(document.createElement('div')).serialize()).to.equal('');
      expect(Array.from($form)[0].tagName).to.equal('FORM');

      expect($$.isArray([])).to.be.true;
      expect($$.isFunction(() => {})).to.be.true;
      expect($$.isNumeric('12.5')).to.be.true;
      expect($$.isWindow(window)).to.be.true;
      expect($$.trim(null)).to.equal('');
      expect($$.inArray('missing', null)).to.equal(-1);
      expect($$.contains(null, document.body)).to.be.false;
      expect($$.each([1, 2], (index, value) => `${index}:${value}`)).to.deep.equal([1, 2]);
      expect($$.each('text', () => {})).to.equal('text');
      expect($$.noop()).to.equal(undefined);
      expect($$.proxy(function(prefix, suffix) {
        return `${this.name}:${prefix}:${suffix}`;
      }, { name: 'ctx' }, 'a')('b')).to.equal('ctx:a:b');
      expect($$.parseHTML('<span>parsed</span>').length).to.equal(1);
      expect($$.extend({}, { a: 1 }, null, { b: 2 })).to.deep.equal({ a: 1, b: 2 });
      const nullProto = Object.create(null);
      nullProto.deep = { ok: true };
      expect($$.extend(true, { deep: { keep: true } }, nullProto)).to.deep.equal({ deep: { ok: true, keep: true } });
      const nestedNullProto = Object.create(null);
      nestedNullProto.extra = true;
      expect($$.extend(true, {}, { nested: nestedNullProto })).to.deep.equal({ nested: { extra: true } });
      expect($$.extend(true, { nested: { keep: true } }, { nested: { add: true } })).to.deep.equal({ nested: { keep: true, add: true } });
      expect($$.extend({}, 1, { c: 3 })).to.deep.equal({ c: 3 });
      expect($$.each({ a: 1, b: 2 }, (key, value) => `${key}${value}`)).to.deep.equal({ a: 1, b: 2 });
      expect($$.summernote.lang).to.deep.equal({});
      $$('<span class="prepend-to"></span>').prependTo($fixture);
      expect($fixture.children().first().hasClass('prepend-to')).to.be.true;
      expect($$('<span></span>').insertAfter($$()).length).to.equal(1);
      expect($$('<span></span>').insertBefore($$()).length).to.equal(1);
      expect($$('<span class="after-raw"></span>').insertAfter($fixture.get(0)).length).to.equal(1);
      expect($$('<span class="before-raw"></span>').insertBefore($fixture.get(0)).length).to.equal(1);
    });

    it('covers bootstrap no-op branches and ajax payload serialization', async() => {
      const $button = $$('<button type="button"></button>').appendTo('body');
      $button.tooltip().modal();

      const originalGetComputedStyle = window.getComputedStyle.bind(window);
      vi.stubGlobal('getComputedStyle', (element) => {
        if (element.tagName === 'X-DEFAULT') {
          return {
            display: 'none',
            getPropertyValue: () => '',
          };
        }
        return originalGetComputedStyle(element);
      });
      const $custom = $$('<x-default></x-default>').appendTo('body');
      $custom.show();
      $custom.hide().show();
      expect($custom[0].style.display).to.equal('block');

      const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('serialized') });
      vi.stubGlobal('fetch', fetchMock);
      window.bootstrap = {
        Tooltip: {
          getOrCreateInstance: vi.fn(() => ({})),
        },
        Modal: {
          getOrCreateInstance: vi.fn(() => ({})),
        },
      };
      $button.tooltip({ title: undefined, container: null, trigger: 'manual' });
      $button.tooltip({});
      $button.modal('show');

      const response = await $$.ajax({
        url: '/serialize',
        method: 'POST',
        data: { alpha: 1 },
      });

      expect(response).to.equal('serialized');
      expect(fetchMock.mock.calls[0][1].body).to.equal(JSON.stringify({ alpha: 1 }));
      expect(window.bootstrap.Tooltip.getOrCreateInstance.mock.calls[0][1]).to.deep.equal({ trigger: 'manual' });
      await $$.ajax({
        url: '/serialize-string',
        method: 'POST',
        data: 'alpha=1',
      });
      expect(fetchMock.mock.calls[1][1].body).to.equal('alpha=1');
    });

    it('covers unsupported manipulation inputs and remaining utility branches', async() => {
      const $host = $$('<div id="root-host"><span class="a"></span><span class="b"></span></div>').appendTo('body');
      const $spans = $host.find('span');
      $spans.append(1).prepend(1).before(1).after(1);
      expect($host.find('span').length).to.equal(2);

      $spans.wrap(document.createElement('div'));
      expect($host.find('div').length).to.be.greaterThan(0);

      const noSelect = $$('<div></div>').appendTo('body');
      expect(() => noSelect.select()).not.to.throw();

      const root = {
        ownerDocument: null,
        contains: () => false,
        querySelectorAll: () => [document.getElementById('root-host')],
      };
      expect($$('#root-host', [root]).length).to.equal(1);

      const rejectedFetch = vi.fn().mockRejectedValue(new Error('network'));
      vi.stubGlobal('fetch', rejectedFetch);
      await expect($$.ajax({ url: '/boom' })).rejects.to.throw('network');
      expect($$.extend(true, {}, 1, { done: true })).to.deep.equal({ done: true });

      const $eventHost = $$('<div class="event-host"><button class="event-child">label</button></div>').appendTo('body');
      const delegated = vi.fn();
      $eventHost.on('delegated-single', '.event-child', delegated);
      $eventHost.find('button')[0].dispatchEvent(new CustomEvent('delegated-single', { bubbles: true, detail: 'value' }));
      const textNode = $eventHost.find('button')[0].firstChild;
      textNode.dispatchEvent(new Event('delegated-single', { bubbles: true }));
      expect(delegated).toHaveBeenCalledTimes(1);

      const once = vi.fn();
      $eventHost.find('button').one('once-single', once);
      $eventHost.find('button')[0].dispatchEvent(new CustomEvent('once-single', { bubbles: true, detail: 'payload' }));
      expect(once.mock.calls[0][1]).to.equal('payload');

      const hidden = $$('<div style="display:none"></div>').appendTo('body');
      hidden.hide();
      hidden.toggle();
      expect(hidden[0].style.display).to.equal('');
      hidden.width('50%').height('auto');
      expect(hidden[0].style.width).to.equal('50%');
      expect(hidden[0].style.height).to.equal('auto');

      const originalDocumentElement = document.documentElement;
      const originalScrollingElement = document.scrollingElement;
      Object.defineProperty(document, 'documentElement', {
        configurable: true,
        value: { clientWidth: 0, clientHeight: 0, scrollTop: 0 },
      });
      Object.defineProperty(document, 'scrollingElement', {
        configurable: true,
        value: null,
      });
      expect($$(document).width()).to.equal(0);
      expect($$(document).height()).to.equal(0);
      expect($$(document).innerWidth()).to.equal(0);
      expect($$(document).innerHeight()).to.equal(0);
      expect($$(document).outerWidth()).to.equal(0);
      expect($$(document).outerHeight()).to.equal(0);
      expect($$(window).scrollTop()).to.equal(0);
      Object.defineProperty(document, 'documentElement', {
        configurable: true,
        value: originalDocumentElement,
      });
      Object.defineProperty(document, 'scrollingElement', {
        configurable: true,
        value: originalScrollingElement,
      });

      expect(() => $eventHost.on('noop', 123)).not.to.throw();
    });
  });
});
