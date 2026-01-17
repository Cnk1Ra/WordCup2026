// SpaceFut - E-commerce Copa 2026
// JavaScript Completo com todas as funcionalidades

// ============================================
// CONFIGURACOES
// ============================================
const CONFIG = {
  // Sua localizacao (Sabara-MG)
  origin: {
    city: 'Sabara',
    state: 'MG',
    cep: '34505-000'
  },
  // Frete - APENAS Sabara e BH tem entrega local
  shipping: {
    sabara: { price: 5, name: 'Pronta Entrega', time: '1-2 dias uteis', allowDeliveryPayment: true },
    bh: { price: 30, name: 'Entrega em BH', time: '2-3 dias uteis', allowDeliveryPayment: false }
  },
  // CEPs de Sabara (frete R$5 + pagamento na entrega disponivel)
  sabaraCeps: ['34505', '34500', '34501', '34502', '34503', '34504', '34506', '34507', '34508', '34510', '34515', '34520'],
  // CEPs de BH (frete R$30, SEM pagamento na entrega)
  bhCeps: ['30', '31', '32'],  // Prefixos de CEP de BH e regiao metropolitana
  // Cartpanda
  cartpanda: {
    checkoutUrl: 'https://pay.cartpanda.com.br/', // Substituir pela URL real
    enabled: true
  },
  // WhatsApp para pedidos
  whatsapp: '5531999999999' // Substituir pelo numero real
};

// ============================================
// DADOS DOS PRODUTOS
// ============================================
const products = [
  {
    id: 1,
    name: 'Camisa Selecao Brasileira I 2026',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 449.90,
    price: 349.90,
    badge: '-22%',
    color: '#FEDD00',
    emoji: '🇧🇷',
    images: ['🇧🇷', '⚽', '🏆'],
    rating: 4.9,
    reviews: 234,
    sold: 1247,
    description: 'Camisa oficial da Selecao Brasileira para a Copa do Mundo 2026. Tecido Dri-FIT de alta performance, que mantem voce seco e confortavel. Design inspirado na rica tradicao do futebol brasileiro.',
    features: ['Tecido Dri-FIT', 'Gola em V', 'Brasao bordado', 'Escudo CBF oficial']
  },
  {
    id: 2,
    name: 'Camisa Selecao Brasileira II 2026',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 449.90,
    price: 349.90,
    badge: 'Novo',
    badgeClass: 'green',
    color: '#002776',
    emoji: '🇧🇷',
    images: ['🇧🇷', '⚽', '🏆'],
    rating: 4.8,
    reviews: 189,
    sold: 892,
    description: 'Camisa reserva da Selecao Brasileira na cor azul tradicional. Ideal para torcer com estilo nos jogos da copa.',
    features: ['Tecido Dri-FIT', 'Gola careca', 'Brasao bordado', 'Escudo CBF oficial']
  },
  {
    id: 3,
    name: 'Camisa Goleiro Brasil 2026',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 399.90,
    price: 319.90,
    badge: 'Novo',
    badgeClass: 'green',
    color: '#00875f',
    emoji: '🧤',
    images: ['🧤', '🇧🇷', '⚽'],
    rating: 4.7,
    reviews: 87,
    sold: 342,
    description: 'Camisa de goleiro da Selecao Brasileira. Na tradicional cor verde, perfeita para quem defende o gol.',
    features: ['Tecido acolchoado nos cotovelos', 'Protecao UV', 'Brasao bordado']
  },
  {
    id: 4,
    name: 'Camisa Flamengo I 2025',
    team: 'Flamengo',
    category: 'clubes',
    oldPrice: 349.90,
    price: 279.90,
    badge: '-20%',
    color: '#E53935',
    emoji: '🔴⚫',
    images: ['🔴⚫', '⚽', '🏆'],
    rating: 4.9,
    reviews: 456,
    sold: 2341,
    description: 'Camisa oficial do Flamengo temporada 2025. O manto sagrado rubro-negro para a Nacao.',
    features: ['Tecido leve', 'Listras tradicionais', 'Escudo bordado']
  },
  {
    id: 5,
    name: 'Camisa Corinthians I 2025',
    team: 'Corinthians',
    category: 'clubes',
    oldPrice: 329.90,
    price: 269.90,
    badge: '-18%',
    color: '#1a1a1a',
    emoji: '⚫⚪',
    images: ['⚫⚪', '⚽', '🏆'],
    rating: 4.8,
    reviews: 312,
    sold: 1567,
    description: 'Camisa oficial do Corinthians. O alvinegro mais querido do Brasil.',
    features: ['Tecido respiravel', 'Design classico', 'Escudo bordado']
  },
  {
    id: 6,
    name: 'Camisa Palmeiras I 2025',
    team: 'Palmeiras',
    category: 'clubes',
    oldPrice: 349.90,
    price: 289.90,
    badge: '-17%',
    color: '#009739',
    emoji: '💚',
    images: ['💚', '⚽', '🏆'],
    rating: 4.8,
    reviews: 278,
    sold: 1234,
    description: 'Camisa oficial do Palmeiras. O Verdao para a torcida mais apaixonada.',
    features: ['Tecido premium', 'Verde tradicional', 'Escudo bordado']
  },
  {
    id: 7,
    name: 'Camisa Real Madrid I 2025',
    team: 'Real Madrid',
    category: 'europeus',
    oldPrice: 499.90,
    price: 399.90,
    badge: '-20%',
    color: '#ffffff',
    emoji: '⚪',
    images: ['⚪', '⚽', '🏆'],
    rating: 4.9,
    reviews: 198,
    sold: 876,
    description: 'Camisa oficial do Real Madrid. O clube mais vitorioso da historia.',
    features: ['Tecido importado', 'Design elegante', 'Escudo bordado']
  },
  {
    id: 8,
    name: 'Camisa Barcelona I 2025',
    team: 'Barcelona',
    category: 'europeus',
    oldPrice: 499.90,
    price: 389.90,
    badge: '-22%',
    color: '#A50044',
    emoji: '🔵🔴',
    images: ['🔵🔴', '⚽', '🏆'],
    rating: 4.8,
    reviews: 167,
    sold: 743,
    description: 'Camisa oficial do Barcelona. As listras blaugrana mais famosas do mundo.',
    features: ['Tecido premium', 'Listras tradicionais', 'Escudo bordado']
  },
  {
    id: 9,
    name: 'Camisa Brasil Retro 1970',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 299.90,
    price: 249.90,
    badge: 'Retro',
    badgeClass: 'green',
    color: '#FFD700',
    emoji: '🏆',
    images: ['🏆', '🇧🇷', '⚽'],
    rating: 4.9,
    reviews: 156,
    sold: 567,
    description: 'Camisa retro da Selecao Brasileira de 1970. O time mais vitorioso da historia das copas.',
    features: ['Design vintage', 'Algodao premium', 'Edicao limitada']
  },
  {
    id: 10,
    name: 'Camisa Argentina I 2026',
    team: 'Argentina',
    category: 'selecao',
    oldPrice: 449.90,
    price: 349.90,
    badge: '-22%',
    color: '#75AADB',
    emoji: '🇦🇷',
    images: ['🇦🇷', '⚽', '🏆'],
    rating: 4.7,
    reviews: 123,
    sold: 432,
    description: 'Camisa oficial da Selecao Argentina. La Albiceleste para a Copa 2026.',
    features: ['Tecido Dri-FIT', 'Listras tradicionais', 'Escudo bordado']
  }
];

// ============================================
// COMBOS ESPECIAIS
// ============================================
const combos = [
  {
    id: 101,
    name: 'Combo Casal Brasil',
    description: '2 Camisas da Selecao (Masculina + Feminina)',
    products: [1, 2],
    oldPrice: 699.80,
    price: 549.90,
    badge: 'Mais Vendido',
    savings: 'Economia de R$ 149,90'
  },
  {
    id: 102,
    name: 'Compre 2 Leve 3',
    description: '3 Camisas da Selecao pelo preco de 2',
    products: [1, 2, 3],
    oldPrice: 1019.70,
    price: 699.80,
    badge: 'Super Oferta',
    savings: 'Ganhe 1 camisa gratis!'
  },
  {
    id: 103,
    name: 'Combo Time do Coracao',
    description: 'Camisa da Selecao + Camisa do seu time',
    products: [1],
    oldPrice: 629.80,
    price: 499.90,
    badge: 'Exclusivo',
    savings: 'Economia de R$ 129,90'
  },
  {
    id: 104,
    name: 'Combo Goleiro',
    description: 'Camisa Principal + Camisa de Goleiro',
    products: [1, 3],
    oldPrice: 669.80,
    price: 529.90,
    badge: 'Novidade',
    savings: 'Economia de R$ 139,90'
  }
];

// ============================================
// AVALIACOES (Prova Social)
// ============================================
const reviews = [
  {
    name: 'Carlos M.',
    avatar: 'CM',
    rating: 5,
    date: 'ha 2 dias',
    text: 'Camisa de otima qualidade! Chegou rapido e bem embalada. Recomendo demais!',
    verified: true
  },
  {
    name: 'Ana Paula S.',
    avatar: 'AS',
    rating: 5,
    date: 'ha 5 dias',
    text: 'Comprei o combo casal e adorei! Material excelente, igual a original. Entrega super rapida.',
    verified: true
  },
  {
    name: 'Roberto F.',
    avatar: 'RF',
    rating: 5,
    date: 'ha 1 semana',
    text: 'Ja e a terceira vez que compro. Qualidade impecavel e preco justo. Loja de confianca!',
    verified: true
  },
  {
    name: 'Julia R.',
    avatar: 'JR',
    rating: 4,
    date: 'ha 1 semana',
    text: 'Gostei muito da camisa, tecido confortavel. So achei que poderia ter mais opcoes de tamanho.',
    verified: true
  },
  {
    name: 'Marcos V.',
    avatar: 'MV',
    rating: 5,
    date: 'ha 2 semanas',
    text: 'Produto de primeira! Vou usar na copa com orgulho. Atendimento excelente tambem.',
    verified: true
  }
];

// ============================================
// ESTADO DA APLICACAO
// ============================================
let selectedProduct = null;
let selectedSize = 'G';
let selectedCombo = null;
let currentCategory = 'todos';
let currentGalleryIndex = 0;
let checkoutData = {
  cep: '',
  city: '',
  state: '',
  shipping: null,
  payment: null,
  isLocal: false
};

// ============================================
// UTILITARIOS
// ============================================
function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

function formatCEP(value) {
  let v = value.replace(/\D/g, '');
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
  return v;
}

function formatPhone(value) {
  let v = value.replace(/\D/g, '');
  if (v.length > 0) v = '(' + v;
  if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3);
  if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10, 15);
  return v;
}

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SF${timestamp}${random}`;
}

function getStars(rating) {
  let stars = '';
  const full = Math.floor(rating);
  for (let i = 0; i < 5; i++) {
    const fill = i < full ? 'var(--orange)' : 'var(--gray-300)';
    stars += `<svg viewBox="0 0 24 24" width="12" height="12" style="fill: ${fill}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  return stars;
}

// ============================================
// NOTIFICACOES
// ============================================
function showNotification(message) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.classList.add('active');
    setTimeout(() => notification.classList.remove('active'), 2500);
  }
}

// ============================================
// GERENCIADOR DE CARRINHO
// ============================================
const CartManager = {
  STORAGE_KEY: 'spacefut_cart',

  getCart() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },

  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.updateBadge();
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
    showNotification('Produto adicionado ao carrinho!');
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

  getCount() {
    return this.getCart().reduce((count, item) => count + item.quantity, 0);
  },

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateBadge();
  },

  updateBadge() {
    const count = this.getCount();
    // Header badge
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
    // Nav badge
    const navBadge = document.getElementById('navCartBadge');
    if (navBadge) {
      navBadge.textContent = count > 99 ? '99+' : count;
      navBadge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
};

// ============================================
// GERENCIADOR DE FAVORITOS
// ============================================
const FavoritesManager = {
  STORAGE_KEY: 'spacefut_favorites',

  get() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },

  save(favorites) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.updateBadge();
  },

  toggle(productId) {
    const favorites = this.get();
    const index = favorites.indexOf(productId);

    if (index > -1) {
      favorites.splice(index, 1);
      showNotification('Removido dos favoritos');
    } else {
      favorites.push(productId);
      showNotification('Adicionado aos favoritos!');
    }

    this.save(favorites);
    this.updateIcons();
  },

  isFavorite(productId) {
    return this.get().includes(productId);
  },

  updateBadge() {
    const count = this.get().length;
    const badge = document.getElementById('favoritesBadge');
    if (badge) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  updateIcons() {
    const favorites = this.get();
    document.querySelectorAll('[data-favorite-btn]').forEach(btn => {
      const productId = parseInt(btn.dataset.productId);
      const icon = btn.querySelector('svg');
      if (icon) {
        icon.style.fill = favorites.includes(productId) ? 'var(--red)' : 'var(--gray-300)';
      }
    });

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
// GERENCIADOR DE BUSCA
// ============================================
const SearchManager = {
  isOpen: false,

  open() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    if (overlay) {
      overlay.classList.add('active');
      this.isOpen = true;
      setTimeout(() => input?.focus(), 100);
    }
  },

  close() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (overlay) {
      overlay.classList.remove('active');
      this.isOpen = false;
      if (input) input.value = '';
      if (results) results.innerHTML = '<p class="search-hint">Digite pelo menos 2 caracteres...</p>';
    }
  },

  search(query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (query.length < 2) {
      resultsContainer.innerHTML = '<p class="search-hint">Digite pelo menos 2 caracteres...</p>';
      return;
    }

    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const results = products.filter(product => {
      const normalizedName = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedTeam = product.team.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalizedName.includes(normalizedQuery) || normalizedTeam.includes(normalizedQuery);
    });

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p class="search-no-results">Nenhum produto encontrado</p>';
      return;
    }

    resultsContainer.innerHTML = results.map(product => {
      const border = product.color === '#ffffff' ? 'border: 1px solid #ddd;' : '';
      return `
        <div class="search-result-item" onclick="SearchManager.close(); openProductPage(${product.id})">
          <div class="search-result-image" style="background: ${product.color}; ${border}">
            <span style="font-size: 28px;">${product.emoji}</span>
          </div>
          <div class="search-result-info">
            <p class="search-result-name">${product.name}</p>
            <p class="search-result-team">${product.team}</p>
            <p class="search-result-price">${formatPrice(product.price)}</p>
          </div>
        </div>
      `;
    }).join('');
  }
};

// ============================================
// GERENCIADOR DE FRETE
// ============================================
const FreteManager = {
  // Verifica se CEP e de Sabara
  isSabara(cep) {
    const prefix = cep.substring(0, 5);
    return CONFIG.sabaraCeps.includes(prefix);
  },

  // Verifica se CEP e de BH ou regiao metropolitana
  isBH(cep) {
    const prefix2 = cep.substring(0, 2);
    return CONFIG.bhCeps.includes(prefix2);
  },

  async calcular() {
    const cepInput = document.getElementById('cepInput');
    const cep = cepInput?.value.replace(/\D/g, '');

    if (!cep || cep.length !== 8) {
      showNotification('Digite um CEP valido');
      return;
    }

    const resultContainer = document.getElementById('freteResult');
    resultContainer.innerHTML = '<p style="text-align: center; color: var(--gray-500);">Calculando...</p>';

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        resultContainer.innerHTML = '<p class="frete-unavailable">CEP nao encontrado</p>';
        return;
      }

      checkoutData.cep = cep;
      checkoutData.city = data.localidade;
      checkoutData.state = data.uf;

      // Verifica a regiao
      const isSabara = this.isSabara(cep);
      const isBH = this.isBH(cep);

      checkoutData.isSabara = isSabara;
      checkoutData.isBH = isBH;
      checkoutData.isLocal = isSabara || isBH;
      checkoutData.allowDeliveryPayment = isSabara; // So Sabara tem pagamento na entrega

      this.showOptions(data.localidade, data.uf, isSabara, isBH);

    } catch (error) {
      resultContainer.innerHTML = '<p class="frete-unavailable">Erro ao buscar CEP. Tente novamente.</p>';
    }
  },

  showOptions(city, state, isSabara, isBH) {
    const resultContainer = document.getElementById('freteResult');

    // Se nao e Sabara nem BH, redireciona para checkout padrao (Cartpanda)
    if (!isSabara && !isBH) {
      resultContainer.innerHTML = `
        <p style="text-align: center; margin-bottom: 12px; font-size: 13px;">
          <strong>${city} - ${state}</strong>
        </p>
        <div style="text-align: center; padding: 20px; background: var(--gray-50); border-radius: 12px;">
          <p style="font-size: 14px; color: var(--gray-700); margin-bottom: 12px;">
            📦 Para sua regiao, o envio sera pelos Correios.
          </p>
          <p style="font-size: 13px; color: var(--gray-500); margin-bottom: 16px;">
            O frete sera calculado no checkout.
          </p>
        </div>
        <button class="btn-primary" style="margin-top: 16px;" onclick="FreteManager.redirectToCartpanda()">IR PARA CHECKOUT</button>
      `;
      checkoutData.shipping = { type: 'correios', price: 0 };
      return;
    }

    let options = [];

    if (isSabara) {
      // Sabara: R$5 + pagamento na entrega disponivel
      options.push({
        type: 'sabara',
        name: '🏠 Pronta Entrega em Sabara',
        time: '1-2 dias uteis',
        price: CONFIG.shipping.sabara.price,
        extra: '+ Opcao de pagar na entrega!'
      });
    } else if (isBH) {
      // BH: R$30, SEM pagamento na entrega
      options.push({
        type: 'bh',
        name: '🚚 Entrega em BH',
        time: '2-3 dias uteis',
        price: CONFIG.shipping.bh.price,
        extra: ''
      });
    }

    resultContainer.innerHTML = `
      <p style="text-align: center; margin-bottom: 12px; font-size: 13px;">
        <strong>${city} - ${state}</strong>
      </p>
      ${options.map((opt, index) => `
        <div class="frete-option ${index === 0 ? 'selected' : ''}" onclick="FreteManager.selectOption(this, '${opt.type}', ${opt.price})">
          <div class="frete-option-info">
            <span class="frete-option-name">${opt.name}</span>
            <span class="frete-option-time">${opt.time}</span>
            ${opt.extra ? `<span style="color: var(--primary); font-size: 11px; font-weight: 600;">${opt.extra}</span>` : ''}
          </div>
          <span class="frete-option-price">${formatPrice(opt.price)}</span>
        </div>
      `).join('')}
      <button class="btn-primary" style="margin-top: 16px;" onclick="FreteManager.confirm()">CONTINUAR</button>
    `;

    // Seleciona primeira opcao por padrao
    checkoutData.shipping = { type: options[0].type, price: options[0].price };
  },

  selectOption(element, type, price) {
    document.querySelectorAll('.frete-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    checkoutData.shipping = { type, price };
  },

  confirm() {
    closeCepModal();
    openCheckout();
  },

  redirectToCartpanda() {
    // Redireciona para checkout Cartpanda
    if (CONFIG.cartpanda.enabled && CONFIG.cartpanda.checkoutUrl) {
      // Monta URL com dados do produto
      const params = new URLSearchParams();
      if (selectedProduct) {
        params.set('product', selectedProduct.id);
        params.set('size', selectedSize);
      }
      params.set('cep', checkoutData.cep);

      // Abre checkout Cartpanda
      window.location.href = CONFIG.cartpanda.checkoutUrl + '?' + params.toString();
    } else {
      // Fallback: abre checkout interno
      closeCepModal();
      openCheckout();
    }
  }
};

// ============================================
// GERENCIADOR DE RASTREAMENTO
// ============================================
const TrackingManager = {
  track() {
    const code = document.getElementById('trackingCode')?.value.toUpperCase().trim();
    const resultContainer = document.getElementById('trackingResult');

    if (!code || code.length < 10) {
      showNotification('Digite um codigo de rastreio valido');
      return;
    }

    // Simulacao de rastreamento
    resultContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; background: var(--primary-light); border-radius: 12px; margin-bottom: 20px;">
        <p style="font-size: 12px; color: var(--gray-600);">Codigo de Rastreio</p>
        <p style="font-size: 16px; font-weight: 700; font-family: monospace;">${code}</p>
      </div>
      <div class="tracking-timeline">
        <div class="tracking-step completed">
          <p class="tracking-step-date">15/01/2026 - 14:32</p>
          <p class="tracking-step-status">Pedido confirmado</p>
          <p class="tracking-step-location">Loja SpaceFut</p>
        </div>
        <div class="tracking-step completed">
          <p class="tracking-step-date">15/01/2026 - 16:45</p>
          <p class="tracking-step-status">Pedido enviado</p>
          <p class="tracking-step-location">Sabara - MG</p>
        </div>
        <div class="tracking-step current">
          <p class="tracking-step-date">16/01/2026 - 08:20</p>
          <p class="tracking-step-status">Em transito</p>
          <p class="tracking-step-location">Centro de Distribuicao BH - MG</p>
        </div>
        <div class="tracking-step">
          <p class="tracking-step-date">Previsao: 17/01/2026</p>
          <p class="tracking-step-status">Saiu para entrega</p>
          <p class="tracking-step-location">-</p>
        </div>
        <div class="tracking-step">
          <p class="tracking-step-date">Previsao: 17/01/2026</p>
          <p class="tracking-step-status">Entregue</p>
          <p class="tracking-step-location">-</p>
        </div>
      </div>
    `;
  }
};

// ============================================
// RENDERIZACAO DE PRODUTOS
// ============================================
function getTeamInitials(team) {
  const words = team.split(' ');
  if (words.length === 1) return team.substring(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
}

function renderProductCard(product) {
  const isFavorite = FavoritesManager.isFavorite(product.id);
  const border = product.color === '#ffffff' ? 'border: 1px solid #ddd;' : '';
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  const isPopular = product.sold > 1000;
  const initials = getTeamInitials(product.team);

  return `
    <div class="product-card" onclick="openProductPage(${product.id})">
      <div class="product-card-image" style="background: ${product.color}; ${border}">
        <span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>
        ${isPopular ? '<span class="product-popular-badge">Popular</span>' : ''}
        <span class="product-initials">${initials}</span>
        <button class="product-favorite-btn" data-favorite-btn data-product-id="${product.id}" onclick="event.stopPropagation(); FavoritesManager.toggle(${product.id})">
          <svg viewBox="0 0 24 24" style="fill: ${isFavorite ? 'var(--red)' : 'var(--gray-300)'}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
      <div class="product-card-info">
        <p class="product-card-name">${product.name}</p>
        <div class="product-card-rating">
          <span class="stars">${getStars(product.rating)}</span>
          <span class="count">(${product.reviews})</span>
        </div>
        <p class="product-card-sold">${product.sold}+ vendidos</p>
        <div class="product-card-prices">
          <p class="product-card-price">${formatPrice(product.price)}</p>
          <span class="product-card-discount">-${discount}%</span>
        </div>
        <p class="product-card-price-old">${formatPrice(product.oldPrice)}</p>
        <p class="product-card-installment">ou 12x de ${formatPrice(product.price / 12)}</p>
        <button class="product-card-buy-btn" onclick="event.stopPropagation(); quickAddToCart(${product.id})">
          COMPRAR
        </button>
      </div>
    </div>
  `;
}

function quickAddToCart(productId) {
  CartManager.addItem(productId, 'G', 1);
}

function renderProductListItem(product) {
  const border = product.color === '#ffffff' ? 'border: 1px solid #eee;' : '';
  const initials = getTeamInitials(product.team);

  return `
    <div class="list-item" onclick="openProductPage(${product.id})">
      <div class="list-item-img" style="background: ${product.color}; ${border}">
        <span class="list-item-initials">${initials}</span>
      </div>
      <div class="list-item-content">
        <p class="list-item-title">${product.name}</p>
        <p class="list-item-subtitle">${product.team}</p>
        <p class="list-item-sold">${product.sold}+ vendidos</p>
        <p class="list-item-price">${formatPrice(product.price)}</p>
        <p class="list-item-old">${formatPrice(product.oldPrice)}</p>
      </div>
      <button class="list-item-btn" onclick="event.stopPropagation(); quickAddToCart(${product.id})">
        <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0-3l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1v2h2l3.6 7.59L3.62 17H19v-2H7z"/></svg>
      </button>
    </div>
  `;
}

function renderComboCard(combo) {
  return `
    <div class="combo-card" onclick="openComboPage(${combo.id})">
      <span class="combo-badge">${combo.badge}</span>
      <h3 class="combo-title">${combo.name}</h3>
      <p class="combo-description">${combo.description}</p>
      <div class="combo-price-container">
        <span class="combo-old-price">${formatPrice(combo.oldPrice)}</span>
        <span class="combo-price">${formatPrice(combo.price)}</span>
      </div>
      <p class="combo-savings">${combo.savings}</p>
    </div>
  `;
}

function renderStarsSVG(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    const fill = i < rating ? 'var(--orange)' : 'var(--gray-300)';
    stars += `<svg viewBox="0 0 24 24" width="14" height="14" style="fill: ${fill}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  return stars;
}

function renderReviewCard(review) {
  return `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${review.avatar}</div>
        <div class="review-info">
          <p class="review-name">${review.name}</p>
          <p class="review-date">${review.date}</p>
        </div>
        <span class="review-stars">${renderStarsSVG(review.rating)}</span>
      </div>
      <p class="review-text">${review.text}</p>
      ${review.verified ? '<p class="review-verified"><svg viewBox="0 0 24 24" width="14" height="14" style="fill: var(--primary); vertical-align: middle; margin-right: 4px;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Compra verificada</p>' : ''}
    </div>
  `;
}

// ============================================
// INICIALIZACAO DOS GRIDS E CARROSEIS
// ============================================
const HOME_PRODUCTS_LIMIT = 8;

function initCarousels() {
  const combosGrid = document.getElementById('combosGrid');
  const lancamentosGrid = document.getElementById('lancamentosGrid');
  const maisVendidosList = document.getElementById('maisVendidosList');
  const clubesGrid = document.getElementById('clubesGrid');
  const reviewsCarousel = document.getElementById('reviewsCarousel');

  if (combosGrid) {
    combosGrid.innerHTML = combos.map(renderComboCard).join('');
  }

  if (lancamentosGrid) {
    const newProducts = products.filter(p => p.badgeClass === 'green');
    const productsToShow = newProducts.length > 0 ? newProducts : products;
    lancamentosGrid.innerHTML = productsToShow.slice(0, HOME_PRODUCTS_LIMIT).map(renderProductCard).join('');
  }

  // Mais Vendidos em formato lista (empilhado)
  if (maisVendidosList) {
    const sorted = [...products].sort((a, b) => b.sold - a.sold);
    maisVendidosList.innerHTML = sorted.slice(0, 5).map(renderProductListItem).join('');
  }

  if (clubesGrid) {
    const clubes = products.filter(p => p.category === 'clubes');
    clubesGrid.innerHTML = clubes.slice(0, HOME_PRODUCTS_LIMIT).map(renderProductCard).join('');
  }

  if (reviewsCarousel) {
    reviewsCarousel.innerHTML = reviews.map(renderReviewCard).join('');
  }
}

// ============================================
// PAGINA DE COLECAO
// ============================================
let currentCollectionFilter = 'todos';

function openCollectionPage(category) {
  currentCollectionFilter = category || 'todos';

  // Atualiza filtros
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentCollectionFilter);
  });

  // Renderiza produtos
  renderCollectionProducts();

  // Abre pagina
  document.getElementById('collectionPage').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCollectionPage() {
  document.getElementById('collectionPage').classList.remove('active');
  document.body.style.overflow = '';
}

function filterCollection(category) {
  currentCollectionFilter = category;

  // Atualiza filtros
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  // Renderiza produtos filtrados
  renderCollectionProducts();
}

function renderCollectionProducts() {
  const grid = document.getElementById('collectionGrid');
  const title = document.getElementById('collectionTitle');

  if (!grid || !title) return;

  // Filtra produtos
  let filtered;
  let titleText;

  switch(currentCollectionFilter) {
    case 'selecao':
      filtered = products.filter(p => p.category === 'selecao');
      titleText = 'Selecoes';
      break;
    case 'clubes':
      filtered = products.filter(p => p.category === 'clubes');
      titleText = 'Clubes Brasileiros';
      break;
    case 'europeus':
      filtered = products.filter(p => p.category === 'europeus');
      titleText = 'Clubes Europeus';
      break;
    default:
      filtered = products;
      titleText = 'Todos os Produtos';
  }

  title.textContent = titleText;
  grid.innerHTML = filtered.map(renderProductCard).join('');

  // Atualiza icones de favoritos
  FavoritesManager.updateIcons();
}

// ============================================
// FILTRO POR CATEGORIA
// ============================================
function filterProducts(category) {
  currentCategory = category;

  const filtered = category === 'todos' ? products :
                   category === 'combos' ? [] :
                   products.filter(p => p.category === category);

  document.querySelectorAll('.category-item').forEach(item => {
    item.classList.toggle('active', item.dataset.category === category);
  });

  const lancamentosGrid = document.getElementById('lancamentosGrid');
  const maisVendidosList = document.getElementById('maisVendidosList');
  const clubesGrid = document.getElementById('clubesGrid');
  const combosSection = document.querySelector('.combos-section');

  if (category === 'combos') {
    if (combosSection) combosSection.style.display = 'block';
    if (lancamentosGrid) lancamentosGrid.innerHTML = '';
    if (maisVendidosList) maisVendidosList.innerHTML = '';
    if (clubesGrid) clubesGrid.innerHTML = '';
  } else {
    if (combosSection) combosSection.style.display = category === 'todos' ? 'block' : 'none';
    if (lancamentosGrid) lancamentosGrid.innerHTML = filtered.slice(0, HOME_PRODUCTS_LIMIT).map(renderProductCard).join('');
    if (maisVendidosList) {
      const sorted = [...filtered].sort((a, b) => b.sold - a.sold);
      maisVendidosList.innerHTML = sorted.slice(0, 5).map(renderProductListItem).join('');
    }
    if (clubesGrid) {
      const clubes = filtered.filter(p => p.category === 'clubes');
      clubesGrid.innerHTML = clubes.slice(0, HOME_PRODUCTS_LIMIT).map(renderProductCard).join('');
    }
  }

  // Atualiza icones de favoritos
  FavoritesManager.updateIcons();
}

// ============================================
// PAGINA DO PRODUTO
// ============================================
function openProductPage(id) {
  selectedProduct = products.find(p => p.id === id);
  if (!selectedProduct) return;

  currentGalleryIndex = 0;
  updateGallery();

  document.getElementById('productPageTeam').textContent = selectedProduct.team;
  document.getElementById('productPageName').textContent = selectedProduct.name;
  document.getElementById('productStars').innerHTML = getStars(selectedProduct.rating);
  document.getElementById('productRatingCount').textContent = `(${selectedProduct.reviews} avaliacoes)`;
  document.getElementById('productSold').innerHTML = `<svg class="sold-icon" viewBox="0 0 24 24" width="16" height="16"><path fill="var(--orange)" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg><span>${selectedProduct.sold} vendidos</span>`;
  document.getElementById('productPageOldPrice').textContent = formatPrice(selectedProduct.oldPrice);
  document.getElementById('productPagePrice').textContent = formatPrice(selectedProduct.price);
  document.getElementById('productPageInstallment').textContent = `ou 12x de ${formatPrice(selectedProduct.price / 12)} sem juros`;

  const discount = Math.round((1 - selectedProduct.price / selectedProduct.oldPrice) * 100);
  document.getElementById('discountBadge').textContent = `-${discount}%`;

  // Descricao
  const descriptionContent = document.querySelector('.description-content');
  if (descriptionContent && selectedProduct.description) {
    descriptionContent.innerHTML = `
      <p>${selectedProduct.description}</p>
      ${selectedProduct.features ? `
        <ul>
          ${selectedProduct.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      ` : ''}
    `;
  }

  FavoritesManager.updateIcons();

  selectedSize = 'G';
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.size === 'G');
  });

  document.getElementById('productPage').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateGallery() {
  if (!selectedProduct) return;

  const mainContainer = document.getElementById('galleryMain');
  const thumbsContainer = document.getElementById('galleryThumbs');
  const initials = getTeamInitials(selectedProduct.team);
  const images = selectedProduct.images || [initials];
  const border = selectedProduct.color === '#ffffff' ? 'border-bottom: 1px solid #ddd;' : '';

  mainContainer.style.background = selectedProduct.color;
  mainContainer.style.cssText += border;
  mainContainer.innerHTML = `<span class="gallery-initials">${initials}</span>`;

  thumbsContainer.innerHTML = images.map((img, index) => `
    <div class="gallery-thumb ${index === currentGalleryIndex ? 'active' : ''}"
         onclick="selectGalleryImage(${index})"
         style="background: ${selectedProduct.color};">
      <span class="thumb-initials">${initials}</span>
    </div>
  `).join('');
}

function selectGalleryImage(index) {
  currentGalleryIndex = index;
  updateGallery();
}

function closeProductPage() {
  document.getElementById('productPage').classList.remove('active');
  document.body.style.overflow = '';
}

function toggleProductFavorite() {
  if (selectedProduct) {
    FavoritesManager.toggle(selectedProduct.id);
  }
}

function shareProduct() {
  if (navigator.share && selectedProduct) {
    navigator.share({
      title: selectedProduct.name,
      text: `Confira esta camisa incrivel: ${selectedProduct.name} por apenas ${formatPrice(selectedProduct.price)}!`,
      url: window.location.href
    });
  } else {
    showNotification('Link copiado!');
  }
}

// ============================================
// COMBO PAGE
// ============================================
function openComboPage(comboId) {
  selectedCombo = combos.find(c => c.id === comboId);
  if (!selectedCombo) return;

  // Por simplicidade, abre o primeiro produto do combo
  if (selectedCombo.products.length > 0) {
    openProductPage(selectedCombo.products[0]);
  }
}

// ============================================
// CARRINHO
// ============================================
function addToCart() {
  if (!selectedProduct) return;
  CartManager.addItem(selectedProduct.id, selectedSize);
}

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
        <p>Adicione produtos ao carrinho</p>
      </div>
    `;
    if (cartTotal) cartTotal.style.display = 'none';
  } else {
    cartContainer.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return '';
      const border = product.color === '#ffffff' ? 'border: 1px solid #ddd;' : '';
      return `
        <div class="cart-item">
          <div class="cart-item-image" style="background: ${product.color}; ${border}">${product.emoji}</div>
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
        <div class="checkout-total-row">
          <span>Subtotal</span>
          <span>${formatPrice(CartManager.getTotal())}</span>
        </div>
        <div class="checkout-total-row">
          <span>Frete</span>
          <span style="color: var(--gray-500);">Calcular no checkout</span>
        </div>
        <div class="checkout-total-row total">
          <span>Total</span>
          <span>${formatPrice(CartManager.getTotal())}</span>
        </div>
        <button class="checkout-btn" onclick="closeCartPage(); openCepModal();">FINALIZAR COMPRA</button>
      `;
    }
  }

  cartPage.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartPage() {
  document.getElementById('cartPage').classList.remove('active');
  document.body.style.overflow = '';
}

function updateCartItem(productId, size, quantity) {
  if (quantity <= 0) {
    CartManager.removeItem(productId, size);
  } else {
    CartManager.updateQuantity(productId, size, quantity);
  }
  showCartPage();
}

// ============================================
// FAVORITOS
// ============================================
function showFavoritesPage() {
  const favorites = FavoritesManager.get();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const favoritesPage = document.getElementById('favoritesPage');
  const favoritesContainer = document.getElementById('favoritesContainer');

  if (!favoritesPage || !favoritesContainer) return;

  if (favoriteProducts.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="empty-favorites">
        <svg viewBox="0 0 24 24" width="64" height="64"><path fill="var(--gray-300)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <h3>Nenhum favorito ainda</h3>
        <p>Toque no coracao para favoritar</p>
      </div>
    `;
  } else {
    favoritesContainer.innerHTML = favoriteProducts.map(renderProductCard).join('');
  }

  favoritesPage.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFavoritesPage() {
  document.getElementById('favoritesPage').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// RASTREAMENTO
// ============================================
function showTrackingPage() {
  const trackingPage = document.getElementById('trackingPage');
  if (trackingPage) {
    trackingPage.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeTrackingPage() {
  document.getElementById('trackingPage').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('trackingResult').innerHTML = '';
  document.getElementById('trackingCode').value = '';
}

// ============================================
// MODAIS
// ============================================
function openCepModal() {
  document.getElementById('cepModal').classList.add('active');
}

function closeCepModal() {
  document.getElementById('cepModal').classList.remove('active');
  document.getElementById('freteResult').innerHTML = '';
}

function showSizeGuide() {
  document.getElementById('sizeGuideModal').classList.add('active');
}

function closeSizeGuide() {
  document.getElementById('sizeGuideModal').classList.remove('active');
}

// ============================================
// CHECKOUT
// ============================================
function openCheckout() {
  if (!selectedProduct && CartManager.getCount() === 0) {
    showNotification('Adicione produtos ao carrinho');
    return;
  }

  // Preenche dados do produto
  const productContainer = document.getElementById('checkoutProductContainer');
  if (selectedProduct) {
    const border = selectedProduct.color === '#ffffff' ? 'border: 1px solid #ddd;' : '';
    productContainer.innerHTML = `
      <div class="checkout-product-image" style="background: ${selectedProduct.color}; ${border}">${selectedProduct.emoji}</div>
      <div class="checkout-product-info">
        <h4>${selectedProduct.name}</h4>
        <p>Tamanho: ${selectedSize}</p>
        <span class="price">${formatPrice(selectedProduct.price)}</span>
      </div>
    `;
  }

  // Preenche CEP
  if (checkoutData.cep) {
    document.getElementById('inputCep').value = formatCEP(checkoutData.cep);
    document.getElementById('inputCity').value = checkoutData.city;
    document.getElementById('inputState').value = checkoutData.state;
  }

  // Opcoes de entrega
  renderShippingOptions();

  // Opcoes de pagamento
  renderPaymentOptions();

  // Atualiza totais
  updateCheckoutTotals();

  document.getElementById('checkoutOverlay').classList.add('active');
  document.getElementById('checkoutForm').style.display = 'block';
  document.getElementById('successMessage').classList.remove('active');
}

function renderShippingOptions() {
  const container = document.getElementById('shippingOptions');
  let options = [];

  if (checkoutData.isLocal) {
    options.push({
      value: 'local',
      name: 'Entrega Local',
      desc: '1-2 dias uteis',
      price: CONFIG.shipping.local.price
    });
  }

  options.push({
    value: 'correios',
    name: 'Correios (PAC)',
    desc: '5-10 dias uteis',
    price: checkoutData.shipping?.price || 15
  });

  container.innerHTML = options.map((opt, index) => `
    <label class="shipping-option">
      <input type="radio" name="shipping" value="${opt.value}" ${index === 0 ? 'checked' : ''} onchange="updateCheckoutTotals()">
      <div class="shipping-radio"></div>
      <div class="shipping-info">
        <strong>${opt.name}</strong>
        <span>${opt.desc}</span>
      </div>
      <span class="shipping-price">${formatPrice(opt.price)}</span>
    </label>
  `).join('');
}

function renderPaymentOptions() {
  const container = document.getElementById('paymentOptions');
  let options = [
    { value: 'pix', name: 'PIX', desc: 'Aprovacao imediata', icon: '📱' },
    { value: 'credit', name: 'Cartao de Credito', desc: 'Em ate 12x sem juros', icon: '💳' },
    { value: 'boleto', name: 'Boleto', desc: 'Vencimento em 3 dias', icon: '📄' }
  ];

  // Adiciona opcao de pagamento na entrega APENAS para Sabara
  if (checkoutData.allowDeliveryPayment) {
    options.push({ value: 'delivery', name: 'Pagar na Entrega', desc: 'Dinheiro ou cartao', icon: '🏠' });
  }

  container.innerHTML = options.map((opt, index) => `
    <label class="payment-option">
      <input type="radio" name="payment" value="${opt.value}" ${index === 0 ? 'checked' : ''}>
      <div class="payment-radio"></div>
      <div class="payment-info">
        <strong>${opt.name}</strong>
        <span>${opt.desc}</span>
      </div>
      <span class="payment-icon">${opt.icon}</span>
    </label>
  `).join('');
}

function updateCheckoutTotals() {
  const subtotal = selectedProduct ? selectedProduct.price : CartManager.getTotal();
  const shippingInput = document.querySelector('input[name="shipping"]:checked');
  let shippingPrice = checkoutData.shipping?.price || 0;

  // Atualiza preco do frete baseado na selecao
  if (shippingInput?.value === 'sabara') {
    shippingPrice = CONFIG.shipping.sabara.price;
  } else if (shippingInput?.value === 'bh') {
    shippingPrice = CONFIG.shipping.bh.price;
  }

  const total = subtotal + shippingPrice;

  document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('checkoutFrete').textContent = formatPrice(shippingPrice);
  document.getElementById('checkoutTotal').textContent = formatPrice(total);
}

function closeCheckout(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('checkoutOverlay').classList.remove('active');
}

function finalizePurchase() {
  // Validacao
  const name = document.getElementById('inputName').value.trim();
  const phone = document.getElementById('inputPhone').value.trim();
  const address = document.getElementById('inputAddress').value.trim();
  const neighborhood = document.getElementById('inputNeighborhood').value.trim();

  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  document.querySelectorAll('.error-message').forEach(el => el.remove());

  let hasErrors = false;

  if (!name || name.length < 3 || !name.includes(' ')) {
    showFieldError('inputName', 'Nome completo obrigatorio');
    hasErrors = true;
  }

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    showFieldError('inputPhone', 'Telefone obrigatorio');
    hasErrors = true;
  }

  if (!address || address.length < 5) {
    showFieldError('inputAddress', 'Endereco obrigatorio');
    hasErrors = true;
  }

  if (!neighborhood || neighborhood.length < 2) {
    showFieldError('inputNeighborhood', 'Bairro obrigatorio');
    hasErrors = true;
  }

  if (hasErrors) return;

  // Gera numero do pedido
  const orderNumber = generateOrderNumber();

  // Limpa carrinho
  CartManager.clear();

  // Exibe sucesso
  document.getElementById('checkoutForm').style.display = 'none';
  document.getElementById('orderNumber').textContent = `Pedido: ${orderNumber}`;
  document.getElementById('successMessage').classList.add('active');

  // Aqui poderia redirecionar para Cartpanda ou enviar para WhatsApp
  // if (CONFIG.cartpanda.enabled) {
  //   window.location.href = CONFIG.cartpanda.checkoutUrl + orderNumber;
  // }
}

function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.classList.add('input-error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  input.parentElement.appendChild(errorDiv);
}

// ============================================
// NAVEGACAO INFERIOR
// ============================================
function initBottomNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      const action = this.dataset.action;

      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

      switch(action) {
        case 'home':
          this.classList.add('active');
          closeProductPage();
          closeFavoritesPage();
          closeCartPage();
          closeTrackingPage();
          closeCollectionPage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'search':
          SearchManager.open();
          break;
        case 'cart':
          this.classList.add('active');
          showCartPage();
          break;
        case 'tracking':
          this.classList.add('active');
          showTrackingPage();
          break;
        case 'favorites':
          this.classList.add('active');
          showFavoritesPage();
          break;
      }
    });
  });
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
// MASCARAS DE INPUT
// ============================================
function initInputMasks() {
  const cepInput = document.getElementById('cepInput');
  if (cepInput) {
    cepInput.addEventListener('input', function(e) {
      e.target.value = formatCEP(e.target.value);
    });
    cepInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        FreteManager.calcular();
      }
    });
  }

  const phoneInput = document.getElementById('inputPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      e.target.value = formatPhone(e.target.value);
    });
  }
}

// ============================================
// HERO CAROUSEL
// ============================================
let currentSlide = 0;
let heroCarouselInterval;

function initHeroCarousel() {
  startHeroCarousel();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');

  if (slides.length === 0) return;

  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  currentSlide = index;
  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');

  // Restart timer
  restartHeroCarousel();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startHeroCarousel() {
  heroCarouselInterval = setInterval(nextSlide, 4000);
}

function restartHeroCarousel() {
  clearInterval(heroCarouselInterval);
  startHeroCarousel();
}

// ============================================
// INICIALIZACAO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initCarousels();
  initSizeSelection();
  initBottomNav();
  initInputMasks();
  initHeroCarousel();

  // Atualiza badges
  CartManager.updateBadge();
  FavoritesManager.updateBadge();

  // Event listener para busca
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => SearchManager.search(e.target.value));
  }

  // Fecha busca com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (SearchManager.isOpen) SearchManager.close();
    }
  });

  // Limpa erros ao digitar
  const formInputs = ['inputName', 'inputPhone', 'inputAddress', 'inputNeighborhood'];
  formInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', function() {
        this.classList.remove('input-error');
        const error = this.parentElement.querySelector('.error-message');
        if (error) error.remove();
      });
    }
  });
});
