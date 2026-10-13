import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBill, sum, won } from '../src/split.js';

test('나누어떨어지면 모두 같은 금액', () => {
  assert.deepEqual(splitBill(30000, 3), [10000, 10000, 10000]);
});

test('인원이 0명이면 오류', () => {
  assert.throws(() => splitBill(10000, 0));
});

test('원 단위 표기', () => {
  assert.equal(won(12345), '12,345원');
  assert.equal(sum([1, 2, 3]), 6);
});
