import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitBill, sum } from '../../src/split.js';

test('이슈 #6: 현금 회비는 100원 단위로 올리고 초과분은 총무 몫에서 뺀다', () => {
  assert.deepEqual(splitBill(34500, 4, { cash: true }), [8400, 8700, 8700, 8700]);
  assert.deepEqual(splitBill(34500, 4), [8625, 8625, 8625, 8625]);
});

test('현금 분담에서도 1명, 0원, 나누어떨어지지 않는 금액의 합계를 보존한다', () => {
  for (const [total, people] of [[12345, 1], [0, 3], [10001, 3], [30000, 3]]) {
    const amounts = splitBill(total, people, { cash: true });
    assert.equal(amounts.length, people);
    assert.equal(sum(amounts), total);
    assert.ok(amounts.slice(1).every((amount) => amount % 100 === 0));
  }
});
