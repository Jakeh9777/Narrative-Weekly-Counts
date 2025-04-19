
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');
  const dateInput = document.getElementById('dateInput');
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  const products = [
    'BACON, Egg & Cheese',
    'SAUSAGE, Egg & Cheese',
    'EGG & Cheese',
    'Scones',
    'Cookies'
  ];

  products.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `<label>${p}<input type="number" min="0" name="${p}"/></label>`;
    form.appendChild(div);
  });

  document.getElementById('submitBtn').addEventListener('click', () => {
    const data = new FormData(form);
    const result = {};
    for (let [key, value] of data.entries()) {
      result[key] = parseInt(value || 0, 10);
    }
    console.log('Submitting for', dateInput.value, result);
    alert('Counts saved! (simulated)');
  });
});
