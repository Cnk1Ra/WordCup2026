// SpaceFut - Main JavaScript

// Products Data
const products = [
  { id: 1, name: 'Camisa Seleção Brasileira I 2026', team: 'Brasil', category: 'selecao', oldPrice: 449.90, price: 349.90, badge: '-22%', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop' },
  { id: 2, name: 'Camisa Seleção Brasileira II 2026', team: 'Brasil', category: 'selecao', oldPrice: 449.90, price: 349.90, badge: 'Novo', badgeClass: 'green', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop' },
  { id: 3, name: 'Camisa Flamengo I 2025', team: 'Flamengo', category: 'clubes', oldPrice: 349.90, price: 279.90, badge: '-20%', image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&h=400&fit=crop' },
  { id: 4, name: 'Camisa Corinthians I 2025', team: 'Corinthians', category: 'clubes', oldPrice: 329.90, price: 269.90, badge: '-18%', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop' },
  { id: 5, name: 'Camisa Real Madrid I 2025', team: 'Real Madrid', category: 'europeus', oldPrice: 499.90, price: 399.90, badge: '-20%', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=400&fit=crop' },
  { id: 6, name: 'Camisa Goleiro Brasil 2026', team: 'Brasil', category: 'selecao', oldPrice: 399.90, price: 319.90, badge: 'Novo', badgeClass: 'green', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop' },
  { id: 7, name: 'Camisa Palmeiras I 2025', team: 'Palmeiras', category: 'clubes', oldPrice: 349.90, price: 289.90, badge: '-17%', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop' },
  { id: 8, name: 'Camisa Barcelona I 2025', team: 'Barcelona', category: 'europeus', oldPrice: 499.90, price: 389.90, badge: '-22%', image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=400&fit=crop' },
  { id: 9, name: 'Camisa Brasil Retrô 1970', team: 'Brasil', category: 'retro', oldPrice: 299.90, price: 249.90, badge: 'Retrô', badgeClass: 'green', image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=400&fit=crop' },
  { id: 10, name: 'Bola Trionda Copa 2026', team: 'FIFA', category: 'acessorios', oldPrice: 899.90, price: 749.90, badge: '-17%', image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=400&h=400&fit=crop' }
];

// State
let selectedProduct = null;
let selectedSize = 'G';

// Helper Functions
function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

// Render Functions
function renderProductCard(product) {
  return `
    <div class="product-card" onclick="openProductPage(${product.id})">
      <div class="product-card-image">
        <span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-card-info">
        <p class="product-card-name">${product.name}</p>
        <p class="product-card-price-old">${formatPrice(product.oldPrice)}</p>
        <p class="product-card-price">${formatPrice(product.price)}</p>
        <p class="product-card-installment">ou 12x de ${formatPrice(product.price / 12)}</p>
      </div>
    </div>
  `;
}

function renderOfertaCard(product) {
  return `
    <div class="oferta-card" onclick="openProductPage(${product.id})">
      <div class="oferta-card-image">
        <span class="product-badge">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="oferta-card-info">
        <p class="oferta-card-price-old">${formatPrice(product.oldPrice)}</p>
        <p class="oferta-card-price">${formatPrice(product.price)}</p>
      </div>
    </div>
  `;
}

// Initialize Carousels
function initCarousels() {
  const lancamentos = document.getElementById('lancamentosCarousel');
  const ofertas = document.getElementById('ofertasGrid');
  const maisVendidos = document.getElementById('maisVendidosCarousel');
  
  if (lancamentos) {
    const newProducts = products.filter(p => p.badgeClass === 'green');
    lancamentos.innerHTML = (newProducts.length > 0 ? newProducts : products).slice(0, 6).map(renderProductCard).join('');
  }
  
  if (ofertas) {
    ofertas.innerHTML = products.filter(p => p.badge.includes('%')).slice(0, 6).map(renderOfertaCard).join('');
  }
  
  if (maisVendidos) {
    maisVendidos.innerHTML = products.slice(0, 6).map(renderProductCard).join('');
  }
}

// Filter Products by Category
function filterProducts(category) {
  const filtered = category === 'todos' ? products : products.filter(p => p.category === category);
  
  const lancamentos = document.getElementById('lancamentosCarousel');
  const maisVendidos = document.getElementById('maisVendidosCarousel');
  
  if (lancamentos) {
    lancamentos.innerHTML = filtered.slice(0, 6).map(renderProductCard).join('');
  }
  
  if (maisVendidos) {
    maisVendidos.innerHTML = filtered.slice(0, 6).map(renderProductCard).join('');
  }
}

// Product Page Functions
function openProductPage(id) {
  selectedProduct = products.find(p => p.id === id);
  if (!selectedProduct) return;
  
  document.getElementById('productPageImage').src = selectedProduct.image;
  document.getElementById('productPageName').textContent = selectedProduct.name;
  document.getElementById('productPageTeam').textContent = selectedProduct.team;
  document.getElementById('productPageOldPrice').textContent = formatPrice(selectedProduct.oldPrice);
  document.getElementById('productPagePrice').textContent = formatPrice(selectedProduct.price);
  document.getElementById('productPageInstallment').textContent = 'ou 12x de ' + formatPrice(selectedProduct.price / 12) + ' sem juros';
  
  document.getElementById('productPage').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductPage() {
  document.getElementById('productPage').classList.remove('active');
  document.body.style.overflow = '';
}

// Size Selection
function initSizeSelection() {
  const sizesContainer = document.getElementById('sizesContainer');
  if (sizesContainer) {
    sizesContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('size-btn')) {
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedSize = e.target.dataset.size;
      }
    });
  }
}

// Checkout Functions
function openCheckout() {
  if (!selectedProduct) return;
  
  document.getElementById('checkoutImage').src = selectedProduct.image;
  document.getElementById('checkoutProductName').textContent = selectedProduct.name;
  document.getElementById('checkoutSize').textContent = selectedSize;
  document.getElementById('checkoutProductPrice').textContent = formatPrice(selectedProduct.price);
  document.getElementById('checkoutSubtotal').textContent = formatPrice(selectedProduct.price);
  document.getElementById('checkoutTotal').textContent = formatPrice(selectedProduct.price);
  
  document.getElementById('checkoutOverlay').classList.add('active');
  document.getElementById('checkoutForm').style.display = 'block';
  document.getElementById('successMessage').classList.remove('active');
}

function closeCheckout(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('checkoutOverlay').classList.remove('active');
}

function finalizePurchase() {
  const name = document.getElementById('inputName').value;
  const cep = document.getElementById('inputCep').value;
  const address = document.getElementById('inputAddress').value;
  
  if (!name || !cep || !address) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }
  
  document.getElementById('checkoutForm').style.display = 'none';
  document.getElementById('successMessage').classList.add('active');
}

// CEP Mask
function initCepMask() {
  const cepInput = document.getElementById('inputCep');
  if (cepInput) {
    cepInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
      }
      e.target.value = value;
    });
  }
}

// Scroll to Products
function scrollToProducts() {
  const carousel = document.querySelector('.products-carousel');
  if (carousel) {
    carousel.scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  initCarousels();
  initSizeSelection();
  initCepMask();
});
