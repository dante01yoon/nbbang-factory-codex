import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBill, sum } from '../../src/split.js';

test('현금 회비 34,500원을 4명이 나누면 총무가 올림 차액을 조정한다', () => {
  const amounts = splitBill(34500, 4, { cash: true });

  assert.deepEqual(amounts, [8400, 8700, 8700, 8700]);
  assert.equal(sum(amounts), 34500);
});
