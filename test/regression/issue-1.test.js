import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBill, sum } from '../../src/split.js';

test('이슈 #1: 10,000원을 3명이 나눠도 받은 돈 합계가 유지된다', () => {
  const amounts = splitBill(10000, 3);
  assert.equal(sum(amounts), 10000);
  assert.deepEqual(amounts, [3334, 3333, 3333]);
});

test('나머지가 여러 원이면 앞 번호부터 1원씩 배분한다', () => {
  assert.deepEqual(splitBill(10001, 3), [3334, 3334, 3333]);
});

test('1명, 0원, 총액보다 많은 인원에서도 총액과 합계가 같다', () => {
  for (const [total, people] of [[10000, 1], [0, 3], [2, 5]]) {
    const amounts = splitBill(total, people);
    assert.equal(amounts.length, people);
    assert.equal(sum(amounts), total);
    assert.ok(amounts.every((amount) => Number.isInteger(amount) && amount >= 0));
    assert.ok(Math.max(...amounts) - Math.min(...amounts) <= 1);
  }
});
