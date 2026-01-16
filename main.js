// SpaceFut - Main JavaScript
// Versao melhorada com carrinho, favoritos, busca e validacoes

// ============================================
// DADOS DOS PRODUTOS
// ============================================
const products = [
  { id: 1, name: 'Camisa Selecao Brasileira I 2026', team: 'Brasil', category: 'selecao', oldPrice: 449.90, price: 349.90, badge: '-22%', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop' },
  { id: 2, name: 'Camisa Selecao Brasileira II 2026', team: 'Brasil', category: 'selecao', oldPrice: 449.90, price: 349.90, badge: 'Novo', badgeClass: 'green', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop' },
  { id: 3, name: 'Camisa Flamengo I 2025', team: 'Flamengo', category: 'clubes', oldPrice: 349.90, price: 279.90, badge: '-20%', image: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&h=400&fit=crop' },
  { id: 4, name: 'Camisa Corinthians I 2025', team: 'Corinthians', category: 'clubes', oldPrice: 329.90, price: 269.90, badge: '-18%', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop' },
  { id: 5, name: 'Camisa Real Madrid I 2025', team: 'Real Madrid', category: 'europeus', oldPrice: 499.90, price: 399.90, badge: '-20%', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=400&fit=crop' },
  { id: 6, name: 'Camisa Goleiro Brasil 2026', team: 'Brasil', category: 'selecao', oldPrice: 399.90, price: 319.90, badge: 'Novo', badgeClass: 'green', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop' },
  { id: 7, name: 'Camisa Palmeiras I 2025', team: 'Palmeiras', category: 'clubes', oldPrice: 349.90, price: 289.90, badge: '-17%', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop' },
  { id: 8, name: 'Camisa Barcelona I 2025', team: 'Barcelona', category: 'europeus', oldPrice: 499.90, price: 389.90, badge: '-22%', image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=400&fit=crop' },
  { id: 9, name: 'Camisa Brasil Retro 1970', team: 'Brasil', category: 'retro', oldPrice: 299.90, price: 249.90, badge: 'Retro', badgeClass: 'green', image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=400&fit=crop' },
  { id: 10, name: 'Bola Trionda Copa 2026', team: 'FIFA', category: 'acessorios', oldPrice: 899.90, price: 749.90, badge: '-17%', image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=400&h=400&fit=crop' }
];

// ============================================
// ESTADO DA APLICACAO
// ============================================
let selectedProduct = null;
let selectedSize = 'G';
let currentCategory = 'todos';

// ============================================
// GERENCIAMENTO DE CARRINHO (LocalStorage)
// ============================================
const CartManager = {
  STORAGE_KEY: 'spacefut_cart',

  getCart() {
    const cart = localStorage.getItem(this.STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.updateCartBadge();
  },

  addItem(productId, size, quantity = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.productId === productId && item.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ productId, size, quantity });
    }

    this.saveCart(cart);
    this.showNotification('Produto adicionado ao carrinho!');
  },

  removeItem(productId, size) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.productId === productId && item.size === size));
    this.saveCart(cart);
  },

  updateQuantity(productId, size, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId && item.size === size);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(productId, size);
      } else {
        this.saveCart(cart);
      }
    }
  },

  getTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  },

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  clearCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateCartBadge();
  },

  updateCartBadge() {
    const count = this.getItemCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  },

  showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = message;
      notification.classList.add('active');
      setTimeout(() => notification.classList.remove('active'), 2500);
    }
  }
};

// ============================================
// GERENCIAMENTO DE FAVORITOS (LocalStorage)
// ============================================
const FavoritesManager = {
  STORAGE_KEY: 'spacefut_favorites',

  getFavorites() {
    const favorites = localStorage.getItem(this.STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },

  saveFavorites(favorites) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.updateFavoritesBadge();
  },

  toggleFavorite(productId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(productId);

    if (index > -1) {
      favorites.splice(index, 1);
      CartManager.showNotification('Removido dos favoritos');
    } else {
      favorites.push(productId);
      CartManager.showNotification('Adicionado aos favoritos!');
    }

    this.saveFavorites(favorites);
    this.updateFavoriteIcons();
  },

  isFavorite(productId) {
    return this.getFavorites().includes(productId);
  },

  updateFavoritesBadge() {
    const count = this.getFavorites().length;
    const badges = document.querySelectorAll('.favorites-badge');
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  },

  updateFavoriteIcons() {
    const favorites = this.getFavorites();
    document.querySelectorAll('[data-favorite-btn]').forEach(btn => {
      const productId = parseInt(btn.dataset.productId);
      const icon = btn.querySelector('svg');
      if (favorites.includes(productId)) {
        icon.style.fill = 'var(--red)';
      } else {
        icon.style.fill = 'var(--black)';
      }
    });

    // Atualiza icone na pagina do produto
    const productPageFavorite = document.getElementById('productPageFavorite');
    if (productPageFavorite && selectedProduct) {
      const icon = productPageFavorite.querySelector('svg');
      if (icon) {
        icon.style.fill = favorites.includes(selectedProduct.id) ? 'var(--red)' : 'var(--black)';
      }
    }
  }
};

// ============================================
// FUNCIONALIDADE DE BUSCA
// ============================================
const SearchManager = {
  isOpen: false,

  open() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    if (searchOverlay) {
      searchOverlay.classList.add('active');
      this.isOpen = true;
      setTimeout(() => searchInput?.focus(), 100);
    }
  },

  close() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    if (searchOverlay) {
      searchOverlay.classList.remove('active');
      this.isOpen = false;
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '';
    }
  },

  search(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (query.length < 2) {
      searchResults.innerHTML = '<p class="search-hint">Digite pelo menos 2 caracteres para buscar...</p>';
      return;
    }

    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const results = products.filter(product => {
      const normalizedName = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedTeam = product.team.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedCategory = product.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      return normalizedName.includes(normalizedQuery) ||
             normalizedTeam.includes(normalizedQuery) ||
             normalizedCategory.includes(normalizedQuery);
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-no-results">Nenhum produto encontrado para "' + query + '"</p>';
      return;
    }

    searchResults.innerHTML = results.map(product => `
      <div class="search-result-item" onclick="SearchManager.close(); openProductPage(${product.id})">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="search-result-info">
          <p class="search-result-name">${product.name}</p>
          <p class="search-result-team">${product.team}</p>
          <p class="search-result-price">${formatPrice(product.price)}</p>
        </div>
      </div>
    `).join('');
  }
};

// ============================================
// VALIDACAO DE FORMULARIOS
// ============================================
const FormValidator = {
  validateCEP(cep) {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  },

  validateName(name) {
    return name.trim().length >= 3 && name.includes(' ');
  },

  validateAddress(address) {
    return address.trim().length >= 5;
  },

  validateCity(city) {
    return city.trim().length >= 2;
  },

  validateState(state) {
    return state && state.length === 2;
  },

  showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.add('input-error');

    // Remove mensagem de erro existente
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Adiciona nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  },

  clearError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.remove('input-error');
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
  },

  clearAllErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
  }
};

// ============================================
// BUSCA DE CEP (ViaCEP API)
// ============================================
async function fetchCEP(cep) {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) return null;

    return {
      address: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}

// ============================================
// FUNCOES AUXILIARES
// ============================================
function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function formatCEP(value) {
  let v = value.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
  return v;
}

// ============================================
// RENDERIZACAO DE PRODUTOS
// ============================================
function renderProductCard(product) {
  const isFavorite = FavoritesManager.isFavorite(product.id);
  return `
    <div class="product-card" onclick="openProductPage(${product.id})">
      <div class="product-card-image">
        <span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="product-favorite-btn" data-favorite-btn data-product-id="${product.id}" onclick="event.stopPropagation(); FavoritesManager.toggleFavorite(${product.id})">
          <svg viewBox="0 0 24 24" style="fill: ${isFavorite ? 'var(--red)' : 'var(--gray-300)'}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
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
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="oferta-card-info">
        <p class="oferta-card-price-old">${formatPrice(product.oldPrice)}</p>
        <p class="oferta-card-price">${formatPrice(product.price)}</p>
      </div>
    </div>
  `;
}

// ============================================
// INICIALIZACAO DOS CARROSEIS
// ============================================
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

// ============================================
// FILTRO DE PRODUTOS POR CATEGORIA
// ============================================
function filterProducts(category) {
  currentCategory = category;
  const filtered = category === 'todos' ? products : products.filter(p => p.category === category);

  const lancamentos = document.getElementById('lancamentosCarousel');
  const maisVendidos = document.getElementById('maisVendidosCarousel');

  // Atualiza categorias ativas
  document.querySelectorAll('.category-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.category === category) {
      item.classList.add('active');
    }
  });

  if (lancamentos) {
    lancamentos.innerHTML = filtered.slice(0, 6).map(renderProductCard).join('');
  }

  if (maisVendidos) {
    maisVendidos.innerHTML = filtered.slice(0, 6).map(renderProductCard).join('');
  }
}

// ============================================
// PAGINA DO PRODUTO
// ============================================
function openProductPage(id) {
  selectedProduct = products.find(p => p.id === id);
  if (!selectedProduct) return;

  document.getElementById('productPageImage').src = selectedProduct.image;
  document.getElementById('productPageName').textContent = selectedProduct.name;
  document.getElementById('productPageTeam').textContent = selectedProduct.team;
  document.getElementById('productPageOldPrice').textContent = formatPrice(selectedProduct.oldPrice);
  document.getElementById('productPagePrice').textContent = formatPrice(selectedProduct.price);
  document.getElementById('productPageInstallment').textContent = 'ou 12x de ' + formatPrice(selectedProduct.price / 12) + ' sem juros';

  // Atualiza icone de favorito
  FavoritesManager.updateFavoriteIcons();

  // Reseta tamanho selecionado
  selectedSize = 'G';
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.size === 'G');
  });

  document.getElementById('productPage').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductPage() {
  document.getElementById('productPage').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// SELECAO DE TAMANHO
// ============================================
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

// ============================================
// ADICIONAR AO CARRINHO
// ============================================
function addToCart() {
  if (!selectedProduct) return;
  CartManager.addItem(selectedProduct.id, selectedSize);
}

// ============================================
// CHECKOUT
// ============================================
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

  FormValidator.clearAllErrors();
}

function closeCheckout(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('checkoutOverlay').classList.remove('active');
}

function finalizePurchase() {
  FormValidator.clearAllErrors();

  const name = document.getElementById('inputName').value;
  const cep = document.getElementById('inputCep').value;
  const address = document.getElementById('inputAddress').value;
  const city = document.getElementById('inputCity').value;
  const state = document.getElementById('inputState').value;

  let hasErrors = false;

  if (!FormValidator.validateName(name)) {
    FormValidator.showError('inputName', 'Digite seu nome completo');
    hasErrors = true;
  }

  if (!FormValidator.validateCEP(cep)) {
    FormValidator.showError('inputCep', 'CEP invalido');
    hasErrors = true;
  }

  if (!FormValidator.validateAddress(address)) {
    FormValidator.showError('inputAddress', 'Endereco invalido');
    hasErrors = true;
  }

  if (!FormValidator.validateCity(city)) {
    FormValidator.showError('inputCity', 'Cidade invalida');
    hasErrors = true;
  }

  if (!FormValidator.validateState(state)) {
    FormValidator.showError('inputState', 'Selecione o estado');
    hasErrors = true;
  }

  if (hasErrors) return;

  // Limpa carrinho apos compra
  CartManager.clearCart();

  document.getElementById('checkoutForm').style.display = 'none';
  document.getElementById('successMessage').classList.add('active');
}

// ============================================
// MASCARA E BUSCA DE CEP
// ============================================
function initCepInput() {
  const cepInput = document.getElementById('inputCep');
  if (!cepInput) return;

  cepInput.addEventListener('input', function(e) {
    e.target.value = formatCEP(e.target.value);
    FormValidator.clearError('inputCep');
  });

  cepInput.addEventListener('blur', async function(e) {
    const cep = e.target.value;
    if (FormValidator.validateCEP(cep)) {
      const addressData = await fetchCEP(cep);
      if (addressData) {
        const addressInput = document.getElementById('inputAddress');
        const cityInput = document.getElementById('inputCity');
        const stateSelect = document.getElementById('inputState');

        if (addressData.address && addressInput) {
          addressInput.value = addressData.address;
        }
        if (addressData.city && cityInput) {
          cityInput.value = addressData.city;
        }
        if (addressData.state && stateSelect) {
          stateSelect.value = addressData.state;
        }
      }
    }
  });
}

// ============================================
// SCROLL PARA PRODUTOS
// ============================================
function scrollToProducts() {
  const carousel = document.querySelector('.products-carousel');
  if (carousel) {
    carousel.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================
// NAVEGACAO INFERIOR
// ============================================
function initBottomNav() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const action = this.dataset.action;

      // Remove active de todos
      navItems.forEach(nav => nav.classList.remove('active'));

      switch(action) {
        case 'home':
          this.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'search':
          SearchManager.open();
          break;
        case 'favorites':
          this.classList.add('active');
          showFavoritesPage();
          break;
        case 'profile':
          this.classList.add('active');
          CartManager.showNotification('Perfil em breve!');
          break;
      }
    });
  });
}

// ============================================
// PAGINA DE FAVORITOS
// ============================================
function showFavoritesPage() {
  const favorites = FavoritesManager.getFavorites();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const favoritesPage = document.getElementById('favoritesPage');
  const favoritesContainer = document.getElementById('favoritesContainer');

  if (!favoritesPage || !favoritesContainer) return;

  if (favoriteProducts.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="empty-favorites">
        <svg viewBox="0 0 24 24" width="64" height="64"><path fill="var(--gray-300)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <h3>Nenhum favorito ainda</h3>
        <p>Adicione produtos aos favoritos tocando no coracao</p>
      </div>
    `;
  } else {
    favoritesContainer.innerHTML = favoriteProducts.map(renderProductCard).join('');
  }

  favoritesPage.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFavoritesPage() {
  const favoritesPage = document.getElementById('favoritesPage');
  if (favoritesPage) {
    favoritesPage.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Volta para home na navegacao
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  document.querySelector('.nav-item[data-action="home"]')?.classList.add('active');
}

// ============================================
// PAGINA DO CARRINHO
// ============================================
function showCartPage() {
  const cart = CartManager.getCart();
  const cartPage = document.getElementById('cartPage');
  const cartContainer = document.getElementById('cartContainer');
  const cartTotal = document.getElementById('cartTotal');

  if (!cartPage || !cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <svg viewBox="0 0 24 24" width="64" height="64"><path fill="var(--gray-300)" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
        <h3>Carrinho vazio</h3>
        <p>Adicione produtos ao carrinho para continuar</p>
      </div>
    `;
    if (cartTotal) cartTotal.style.display = 'none';
  } else {
    cartContainer.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return '';
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="cart-item-info">
            <p class="cart-item-name">${product.name}</p>
            <p class="cart-item-size">Tamanho: ${item.size}</p>
            <p class="cart-item-price">${formatPrice(product.price)}</p>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="updateCartItem(${product.id}, '${item.size}', ${item.quantity - 1})">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartItem(${product.id}, '${item.size}', ${item.quantity + 1})">+</button>
          </div>
        </div>
      `;
    }).join('');

    if (cartTotal) {
      cartTotal.style.display = 'block';
      cartTotal.innerHTML = `
        <div class="cart-total-row">
          <span>Subtotal</span>
          <span>${formatPrice(CartManager.getTotal())}</span>
        </div>
        <div class="cart-total-row">
          <span>Frete</span>
          <span class="free-shipping">Gratis</span>
        </div>
        <div class="cart-total-row total">
          <span>Total</span>
          <span>${formatPrice(CartManager.getTotal())}</span>
        </div>
        <button class="checkout-btn" onclick="closeCartPage(); openCheckoutFromCart()">FINALIZAR COMPRA</button>
      `;
    }
  }

  cartPage.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartPage() {
  const cartPage = document.getElementById('cartPage');
  if (cartPage) {
    cartPage.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateCartItem(productId, size, quantity) {
  if (quantity <= 0) {
    CartManager.removeItem(productId, size);
  } else {
    CartManager.updateQuantity(productId, size, quantity);
  }
  showCartPage(); // Atualiza a visualizacao
}

function openCheckoutFromCart() {
  const cart = CartManager.getCart();
  if (cart.length === 0) return;

  // Pega o primeiro item do carrinho para mostrar no checkout
  const firstItem = cart[0];
  selectedProduct = products.find(p => p.id === firstItem.productId);
  selectedSize = firstItem.size;

  if (selectedProduct) {
    openCheckout();
    // Atualiza o total para todo o carrinho
    document.getElementById('checkoutSubtotal').textContent = formatPrice(CartManager.getTotal());
    document.getElementById('checkoutTotal').textContent = formatPrice(CartManager.getTotal());
  }
}

// ============================================
// LAZY LOADING DE IMAGENS
// ============================================
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// INICIALIZACAO DA APLICACAO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initCarousels();
  initSizeSelection();
  initCepInput();
  initBottomNav();
  initLazyLoading();

  // Atualiza badges
  CartManager.updateCartBadge();
  FavoritesManager.updateFavoritesBadge();

  // Event listener para busca
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => SearchManager.search(e.target.value));
  }

  // Event listener para fechar busca com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (SearchManager.isOpen) SearchManager.close();
    }
  });

  // Event listeners para inputs do formulario
  const formInputs = ['inputName', 'inputAddress', 'inputCity'];
  formInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', () => FormValidator.clearError(inputId));
    }
  });

  const stateSelect = document.getElementById('inputState');
  if (stateSelect) {
    stateSelect.addEventListener('change', () => FormValidator.clearError('inputState'));
  }
});
