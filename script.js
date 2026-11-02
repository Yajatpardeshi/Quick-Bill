const rows = document.getElementById("itemRows");
const addButton = document.getElementById("addButton");
const printButton = document.getElementById("printButton");

// The items are stored in an array instead of reading the table for calculations
let items = [
  { id: 1, name: "Notebook", quantity: 2, price: 50 },
  { id: 2, name: "Pen", quantity: 3, price: 10 }
];
let nextId = 3;

function money(number) {
  return "₹" + number.toFixed(2);
}

// Draw the table again whenever an item changes
function renderItems() {
  rows.innerHTML = "";
  items.forEach(function (item) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" class="item-name" value="${safeText(item.name)}" aria-label="Item name"></td>
      <td><input type="number" class="item-quantity" min="1" value="${item.quantity}" aria-label="Quantity"></td>
      <td><input type="number" class="item-price" min="0" step="0.01" value="${item.price}" aria-label="Unit price"></td>
      <td class="row-total">${money(item.quantity * item.price)}</td>
      <td class="no-print"><button class="delete" type="button">Delete</button></td>`;
    row.dataset.id = item.id;
    rows.appendChild(row);
  });
  updateTotals();
}

// Escape special characters before putting an item name into HTML
function safeText(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

// Calculate subtotal, 18% tax and grand total using reduce()
function updateTotals() {
  const subtotal = items.reduce(function (sum, item) {
    return sum + item.quantity * item.price;
  }, 0);
  const tax = subtotal * 0.18;
  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("tax").textContent = money(tax);
  document.getElementById("grandTotal").textContent = money(subtotal + tax);
}

// Event delegation: one listener handles all table inputs and delete buttons
rows.addEventListener("input", function (event) {
  const row = event.target.closest("tr");
  if (!row) return;
  const id = Number(row.dataset.id);
  const item = items.find(function (entry) { return entry.id === id; });
  if (!item) return;

  if (event.target.classList.contains("item-name")) item.name = event.target.value;
  if (event.target.classList.contains("item-quantity")) {
    item.quantity = Math.max(1, Number(event.target.value) || 1);
    event.target.value = item.quantity;
  }
  if (event.target.classList.contains("item-price")) {
    item.price = Math.max(0, Number(event.target.value) || 0);
    event.target.value = item.price;
  }

  row.querySelector(".row-total").textContent = money(item.quantity * item.price);
  updateTotals();
});

rows.addEventListener("click", function (event) {
  if (!event.target.classList.contains("delete")) return;
  const row = event.target.closest("tr");
  const id = Number(row.dataset.id);
  items = items.filter(function (item) { return item.id !== id; });
  renderItems();
});

// Add a new blank item to the array
addButton.addEventListener("click", function () {
  items.push({ id: nextId, name: "New item", quantity: 1, price: 0 });
  nextId++;
  renderItems();
});

printButton.addEventListener("click", function () {
  window.print();
});

// Put today's date in the date field
document.getElementById("date").value = new Date().toISOString().slice(0, 10);
renderItems();
