import { afterEach, describe, expect, it } from 'vitest';
import $$ from '@/js/core/dom-query.js';

describe('base:core.dom-query', () => {
  afterEach(() => {
    $$('body').empty();
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
});
