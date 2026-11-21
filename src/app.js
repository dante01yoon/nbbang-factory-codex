import { splitBill, sum, won } from './split.js';

const $ = (id) => document.getElementById(id);
const form = $('form');
form.insertAdjacentHTML('beforeend', `
  <label style="display: flex; align-items: center; grid-column: 1 / -1">
    <input id="cash" type="checkbox" style="width: auto; margin: 0"> 현금 회비
  </label>
`);
const cashInput = $('cash');
const params = new URLSearchParams(location.search);
if (params.has('total')) $('total').value = params.get('total');
if (params.has('people')) $('people').value = params.get('people');
cashInput.checked = params.get('cash') === '1';

function render() {
  const total = Number($('total').value);
  const people = Number($('people').value);
  const cash = cashInput.checked;
  const list = $('list');
  list.innerHTML = '';
  let amounts = [];
  try { amounts = splitBill(total, people, { cash }); } catch (e) { list.textContent = e.message; }
  amounts.forEach((a, i) => {
    const li = document.createElement('li');
    const member = cash && i === 0 ? '1번 (총무)' : `${i + 1}번`;
    li.innerHTML = `<span>${member}</span><b>${won(a)}</b>`;
    list.append(li);
  });
  const collected = sum(amounts);
  $('collected').textContent = won(collected);
  $('paid').textContent = won(total);
  document.querySelector('.check').classList.toggle('bad', collected !== total);
}
form.addEventListener('input', render);
render();
