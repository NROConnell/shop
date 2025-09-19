let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartIcon = document.querySelector('.cart-icon');
const cartPanel = document.getElementById('cart');
const cartList = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

cartPanel.style.display = 'none'; // Hide cart initially

cartIcon.addEventListener('click', () => {
  cartPanel.style.display = cartPanel.style.display === 'none' ? 'block' : 'none';
});

fetch('products.json')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('products-container');
    products.forEach(product => {
      const item = document.createElement('div');
      item.className = 'product';
      item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>$${product.price.toFixed(2)}</strong></p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      container.appendChild(item);
    });
    updateCart(); // Load cart on page load
  });

function addToCart(id) {
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === id);
      cart.push(product);
      saveCart();
      updateCart();
    });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
  cartList.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartList.appendChild(li);
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Add Clear Cart button if not already present
  if (!document.getElementById('clear-cart-btn')) {
    const btn = document.createElement('button');
    btn.id = 'clear-cart-btn';
    btn.textContent = 'Clear Cart';
    btn.onclick = clearCart;
    document.getElementById('cart').appendChild(btn);
  }
}
