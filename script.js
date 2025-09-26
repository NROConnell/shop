let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 5;

const cartIcon = document.querySelector('.cart-icon');
const cartPanel = document.getElementById('cart');
const cartList = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const searchBox = document.getElementById('search-box');
const sortOptions = document.getElementById('sort-options');
const productsContainer = document.getElementById('products-container');
const pagination = document.getElementById('pagination');

cartPanel.style.display = 'none';

cartIcon.addEventListener('click', () => {
  cartPanel.style.display = cartPanel.style.display === 'none' ? 'block' : 'none';
});

fetch('products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(allProducts);
    updateCart();
  });

function renderProducts(products) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = products.slice(start, end);

  productsContainer.innerHTML = '';
  paginated.forEach(product => {
    const item = document.createElement('div');
    item.className = 'product';
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>$${product.price.toFixed(2)}</strong></p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsContainer.appendChild(item);
  });

  renderPagination(products.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderProducts(filteredProducts());
  };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = i === currentPage ? 'active' : '';
    pageBtn.onclick = () => {
      currentPage = i;
      renderProducts(filteredProducts());
    };
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderProducts(filteredProducts());
  };
  pagination.appendChild(nextBtn);
}

searchBox.addEventListener('input', () => {
  currentPage = 1;
  renderProducts(filteredProducts());
});

sortOptions.addEventListener('change', () => {
  currentPage = 1;
  renderProducts(filteredProducts());
});

function filteredProducts() {
  const query = searchBox.value.toLowerCase();
  let filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));

  const sort = sortOptions.value;
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  cart.push(product);
  saveCart();
  updateCart();
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

  if (!document.getElementById('clear-cart-btn')) {
    const btn = document.createElement('button');
    btn.id = 'clear-cart-btn';
    btn.textContent = 'Clear Cart';
    btn.onclick = clearCart;
    document.getElementById('cart').appendChild(btn);
  }
}
