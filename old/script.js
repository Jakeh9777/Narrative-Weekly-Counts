
const products = [
  "Bacon, Egg & Cheese", "Sausage, Egg & Cheese", "Egg & Cheese",
  "Chix Salad Sandwich", "Chicken Bacon Ranch Wrap", "Italian Sand",
  "Scones", "Cookies", "Muffins", "Chocolate Croissants",
  "Almond Croissants", "Croissant Plain", "Cinnamon Rolls",
  "Yogurt Parfaits", "Overnight Oats", "Rice Crispy Bars",
  "Pumpkin Bread/Banana/etc Loaves", "Chia Pudding"
];

function getMonday(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function renderForm() {
  const form = document.getElementById("entryForm");
  form.innerHTML = "";
  products.forEach(p => {
    const label = document.createElement("label");
    label.textContent = p;
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.name = p;
    label.appendChild(input);
    form.appendChild(label);
  });
}

function getWeekDates(monday) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    days.push(formatDate(d));
  }
  return days;
}

function submitData() {
  const date = document.getElementById("date").value;
  if (!date) return alert("Please select a date.");
  const week = formatDate(getMonday(date));
  const data = JSON.parse(localStorage.getItem("productData") || "{}");
  data[week] = data[week] || {};
  data[week][date] = {};
  document.querySelectorAll("#entryForm input").forEach(input => {
    const val = input.value.trim();
    if (val !== "") data[week][date][input.name] = parseInt(val);
  });
  localStorage.setItem("productData", JSON.stringify(data));
  document.querySelectorAll("#entryForm input").forEach(input => input.value = "");
  
populateWeekSelector();
  const newWeek = document.getElementById("weekSelector").value;
  if (newWeek) renderTable(newWeek);

  selector.value = week;
  renderTable(week);
}

function populateWeekSelector() {
  const data = JSON.parse(localStorage.getItem("productData") || "{}");
  const selector = document.getElementById("weekSelector");
  const weeks = Object.keys(data).sort().reverse();
  
  selector.innerHTML = weeks.map(w => {
    const start = new Date(w);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const startMonth = start.toLocaleDateString("en-US", { month: "long" });
    const endMonth = end.toLocaleDateString("en-US", { month: "long" });
    const startDay = ("0" + start.getDate()).slice(-2);
    const endDay = ("0" + end.getDate()).slice(-2);
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    const yearLabel = startYear !== endYear ? `, ${startYear}` : "";
    const label = `${startMonth}, ${startDay}${yearLabel} - ${endMonth}, ${endDay}, ${endYear}`;

    return `<option value="${w}">${label}</option>`;
  }).join("");
  if (weeks.length) selector.value = weeks[0];

}

function renderTable(week) {
  const table = document.getElementById("weeklyTable");
  const allData = JSON.parse(localStorage.getItem("productData") || "{}");
  const data = allData[week];
  if (!data) return table.innerHTML = "<p>No data for this week.</p>";

  const monday = new Date(week);
  const days = getWeekDates(monday);
  const dateLabels = days.map(d => {
    const day = new Date(d);
    return day.toLocaleDateString("en-US", { weekday: "short", month: "2-digit", day: "2-digit" });
  });

  let html = "<table><thead><tr><th>Product</th>";
  dateLabels.forEach(label => html += `<th>${label}</th>`);
  html += "<th>Total</th></tr></thead><tbody>";

  products.forEach(product => {
    let total = 0;
    html += `<tr><td>${product}</td>`;
    days.forEach(day => {
      const val = data[day]?.[product] || "";
      total += data[day]?.[product] || 0;
      
    html += `<td contenteditable="true" data-date="${day}" data-product="${product}">${val}</td>`;

    });
    html += `<td><strong>${total || ""}</strong></td></tr>`;
  });

  html += "</tbody></table>";
  table.innerHTML = html;
}

function clearAllData() {
  if (confirm("Clear ALL data?")) {
    localStorage.removeItem("productData");
    document.getElementById("weeklyTable").innerHTML = "";
    
populateWeekSelector();
  const newWeek = document.getElementById("weekSelector").value;
  if (newWeek) renderTable(newWeek);

  }
}


function clearThisWeek() {
      const selector = document.getElementById("weekSelector");

  const week = document.getElementById("weekSelector").value;
  if (week && confirm("Clear this week's data?")) {
    const data = JSON.parse(localStorage.getItem("productData") || "{}");
    delete data[week];
    localStorage.setItem("productData", JSON.stringify(data));
    document.getElementById("weeklyTable").innerHTML = "";
    
populateWeekSelector();
  const newWeek = document.getElementById("weekSelector").value;
  if (newWeek) renderTable(newWeek);

  }
}

document.getElementById("weekSelector").addEventListener("change", (e) => {
  
  const week = e.target.value;
  if (week) renderTable(week);

});

renderForm();

populateWeekSelector();
  const newWeek = document.getElementById("weekSelector").value;
  if (newWeek) renderTable(newWeek);


document.addEventListener("blur", function(e) {
  if (e.target.matches('td[contenteditable="true"]')) {
    const date = e.target.dataset.date;
    const product = e.target.dataset.product;
    const newVal = parseInt(e.target.textContent.trim());
    const allData = JSON.parse(localStorage.getItem("productData") || "{}");
    const week = formatDate(getMonday(date));
    if (!allData[week]) allData[week] = {};
    if (!allData[week][date]) allData[week][date] = {};
    if (!isNaN(newVal)) {
      allData[week][date][product] = newVal;
    } else {
      delete allData[week][date][product];
    }
    localStorage.setItem("productData", JSON.stringify(allData));
    renderTable(week);
  }
}, true);

function exportCurrentWeek() {
  const week = document.getElementById("weekSelector").value;
  if (!week) return;
  const data = JSON.parse(localStorage.getItem("productData") || "{}")[week];
  if (!data) return;

  const days = getWeekDates(new Date(week));
  const rows = [["Product", ...days]];
  products.forEach(product => {
    const row = [product];
    days.forEach(day => {
      row.push(data[day]?.[product] || "");
    });
    rows.push(row);
  });

  downloadCSV(rows, `week-${week}.tsv`);
}

function exportAllWeeks() {
  const allData = JSON.parse(localStorage.getItem("productData") || "{}");
  const weeks = Object.keys(allData).sort();
  const daysPerWeek = weeks.flatMap(week => getWeekDates(new Date(week)));

  const header = ["Week", "Date", "Product", "Count"];
  const rows = [header];

  weeks.forEach(week => {
    const weekData = allData[week];
    Object.keys(weekData).forEach(date => {
      const dayData = weekData[date];
      Object.keys(dayData).forEach(product => {
        rows.push([week, date, product, dayData[product]]);
      });
    });
  });

  downloadCSV(rows, "all-product-data.tsv");
}

function downloadCSV(rows, filename) {
  const csvContent = rows.map(e => e.map(String).join("\t")).join("\n");
  const blob = new Blob([csvContent], { type: "text/tab-separated-values;charset=utf-8;" });
  const link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
