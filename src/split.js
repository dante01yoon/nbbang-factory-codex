// 총액을 나누고 나머지는 앞 번호부터 1원씩 배분한다.
export function splitBill(total, people) {
  if (!Number.isInteger(total) || total < 0) throw new Error('총액은 0 이상의 정수여야 합니다');
  if (!Number.isInteger(people) || people < 1) throw new Error('인원은 1명 이상이어야 합니다');
  const each = Math.floor(total / people);
  const remainder = total % people;
  return Array.from({ length: people }, (_, index) => each + (index < remainder ? 1 : 0));
}

export function sum(amounts) {
  return amounts.reduce((a, b) => a + b, 0);
}

export function won(n) {
  return n.toLocaleString('ko-KR') + '원';
}
