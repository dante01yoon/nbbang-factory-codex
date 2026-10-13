import { splitBill, sum, won } from './split.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
if (params.has('total')) $('total').value = params.get('total');
if (params.has('people')) $('people').value = params.get('people');

function render() {
  const total = Number($('total').value);
  const people = Number($('people').value);
  const list = $('list');
  list.innerHTML = '';
  let amounts = [];
  try { amounts = splitBill(total, people); } catch (e) { list.textContent = e.message; }
  amounts.forEach((a, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${i + 1}번</span><b>${won(a)}</b>`;
    list.append(li);
  });
  const collected = sum(amounts);
  $('collected').textContent = won(collected);
  $('paid').textContent = won(total);
  document.querySelector('.check').classList.toggle('bad', collected !== total);
}
$('form').addEventListener('input', render);
render();
