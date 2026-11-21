import { test } from 'node:test';
import assert from 'node:assert/strict';

test('인원 칸을 비우면 합계를 숨기고 다시 입력하면 합계를 표시한다', async () => {
  let onInput;
  const elements = {
    total: { value: '' },
    people: { value: '' },
    form: {
      addEventListener(event, listener) {
        assert.equal(event, 'input');
        onInput = listener;
      },
    },
    list: { append() {} },
    collected: {},
    paid: {},
  };
  const check = {
    hidden: false,
    classList: { toggle() {} },
  };
  globalThis.location = { search: '?total=10000&people=' };
  globalThis.document = {
    getElementById: (id) => elements[id],
    querySelector: () => check,
    createElement: () => ({}),
  };

  try {
    await import('../../src/app.js');
    assert.equal(check.hidden, true);
    assert.equal(elements.list.textContent, '인원은 1명 이상이어야 합니다');

    elements.people.value = '3';
    onInput();
    assert.equal(check.hidden, false);
    assert.equal(elements.collected.textContent, '10,000원');
    assert.equal(elements.paid.textContent, '10,000원');

    elements.people.value = '';
    onInput();
    assert.equal(check.hidden, true);
  } finally {
    delete globalThis.document;
    delete globalThis.location;
  }
});
