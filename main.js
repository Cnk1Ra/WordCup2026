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
    sku: 'BRA-I-2026',
    name: 'Camisa Seleção Brasileira I 2026',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 199.90,
    price: 157.90,
    badge: '-21%',
    color: '#FEDD00',
    emoji: '🇧🇷',
    images: ['/images/brasil-i-2026-frente.jpg', '/images/brasil-i-2026-costas.jpg', '/images/brasil-i-2026-detalhe.jpg'],
    rating: 4.9,
    reviews: 234,
    sold: 1247,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Vista a amarelinha e entre em campo com a Seleção! Camisa oficial da Seleção Brasileira para a Copa do Mundo 2026. Confeccionada em tecido Dri-FIT de alta performance com tecnologia de absorção de suor. Escudo da CBF bordado no peito, gola V clássica com detalhes em verde, e o icônico amarelo ouro que representa nossa nação.',
    features: ['Tecido Dri-FIT', 'Gola V clássica', 'Escudo CBF bordado', 'Absorção de suor'],
    destaque: true
  },
  {
    id: 2,
    sku: 'BRA-II-2026',
    name: 'Camisa Seleção Brasileira II 2026',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 199.90,
    price: 157.90,
    badge: '-21%',
    color: '#002776',
    emoji: '🇧🇷',
    images: ['/images/brasil-ii-2026-frente.jpg', '/images/brasil-ii-2026-costas.jpg', '/images/brasil-ii-2026-detalhe.jpg'],
    rating: 4.8,
    reviews: 189,
    sold: 892,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'A força do azul brasileiro! Camisa reserva da Seleção Brasileira para a Copa do Mundo 2026. Design moderno em azul royal com detalhes em amarelo e verde. Tecido Dri-FIT respirável que mantém você seco e confortável.',
    features: ['Tecido Dri-FIT', 'Gola redonda', 'Escudo CBF bordado', 'Design moderno'],
    destaque: true
  },
  {
    id: 3,
    sku: 'BRA-GK-2026',
    name: 'Camisa Goleiro Seleção Brasileira 2026',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 219.90,
    price: 167.90,
    badge: '-24%',
    color: '#00875f',
    emoji: '🧤',
    images: ['/images/brasil-goleiro-2026-frente.jpg', '/images/brasil-goleiro-2026-costas.jpg', '/images/brasil-goleiro-2026-detalhe.jpg'],
    rating: 4.7,
    reviews: 87,
    sold: 342,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Defenda como os grandes! Camisa oficial de goleiro da Seleção Brasileira para a Copa 2026. Design exclusivo em verde vibrante com detalhes em amarelo. Tecido acolchoado nos cotovelos para proteção extra em defesas.',
    features: ['Tecido acolchoado nos cotovelos', 'Corte amplo', 'Verde vibrante', 'Proteção extra'],
    destaque: false
  },
  {
    id: 4,
    sku: 'BRA-FEM-2026',
    name: 'Camisa Seleção Brasileira Feminina 2026',
    team: 'Brasil',
    category: 'selecao',
    oldPrice: 199.90,
    price: 157.90,
    badge: '-21%',
    color: '#FEDD00',
    emoji: '🇧🇷',
    images: ['/images/brasil-fem-2026-frente.jpg', '/images/brasil-fem-2026-costas.jpg', '/images/brasil-fem-2026-detalhe.jpg'],
    rating: 4.9,
    reviews: 156,
    sold: 678,
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    description: 'Força feminina em campo! Camisa oficial feminina da Seleção Brasileira para a Copa 2026. Modelagem especial que valoriza o corpo feminino com corte mais ajustado na cintura. Mesmo tecido Dri-FIT de alta performance.',
    features: ['Modelagem feminina', 'Corte ajustado', 'Tecido Dri-FIT', 'Escudo CBF bordado'],
    destaque: true
  },
  {
    id: 5,
    sku: 'FLA-I-2025',
    name: 'Camisa Flamengo I 2025',
    team: 'Flamengo',
    category: 'clubes',
    oldPrice: 179.90,
    price: 139.90,
    badge: '-22%',
    color: '#E53935',
    emoji: '🔴⚫',
    images: ['/images/flamengo-i-2025-frente.jpg', '/images/flamengo-i-2025-costas.jpg', '/images/flamengo-i-2025-detalhe.jpg'],
    rating: 4.9,
    reviews: 456,
    sold: 2341,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Uma vez Flamengo, sempre Flamengo! Camisa oficial do Mengão para a temporada 2025. As tradicionais listras em rubro-negro que fazem a maior torcida do Brasil vibrar. Tecido de alta performance com tecnologia de ventilação.',
    features: ['Listras tradicionais', 'Escudo bordado', 'Tecido ventilado', 'Patrocínios atualizados'],
    destaque: true
  },
  {
    id: 6,
    sku: 'COR-I-2025',
    name: 'Camisa Corinthians I 2025',
    team: 'Corinthians',
    category: 'clubes',
    oldPrice: 179.90,
    price: 139.90,
    badge: '-22%',
    color: '#1a1a1a',
    emoji: '⚫⚪',
    images: ['/images/corinthians-i-2025-frente.jpg', '/images/corinthians-i-2025-costas.jpg', '/images/corinthians-i-2025-detalhe.jpg'],
    rating: 4.8,
    reviews: 312,
    sold: 1567,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Vai Corinthians! Camisa oficial do Timão para a temporada 2025. O clássico preto e branco que representa a fiel torcida. Tecido respirável de alta qualidade, escudo bordado.',
    features: ['Design clássico', 'Escudo bordado', 'Tecido respirável', 'Preto e branco'],
    destaque: false
  },
  {
    id: 7,
    sku: 'PAL-I-2025',
    name: 'Camisa Palmeiras I 2025',
    team: 'Palmeiras',
    category: 'clubes',
    oldPrice: 179.90,
    price: 139.90,
    badge: '-22%',
    color: '#009739',
    emoji: '💚',
    images: ['/images/palmeiras-i-2025-frente.jpg', '/images/palmeiras-i-2025-costas.jpg', '/images/palmeiras-i-2025-detalhe.jpg'],
    rating: 4.8,
    reviews: 278,
    sold: 1234,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Avanti Palestra! Camisa oficial do Palmeiras para a temporada 2025. O verde alviverde que carrega mais de um século de glórias. Tecido premium com tecnologia de absorção.',
    features: ['Verde alviverde', 'Escudo bordado', 'Tecido premium', 'Maior campeão brasileiro'],
    destaque: false
  },
  {
    id: 8,
    sku: 'SAO-I-2025',
    name: 'Camisa São Paulo I 2025',
    team: 'São Paulo',
    category: 'clubes',
    oldPrice: 179.90,
    price: 139.90,
    badge: '-22%',
    color: '#ffffff',
    emoji: '🔴⚪⚫',
    images: ['/images/saopaulo-i-2025-frente.jpg', '/images/saopaulo-i-2025-costas.jpg', '/images/saopaulo-i-2025-detalhe.jpg'],
    rating: 4.8,
    reviews: 198,
    sold: 876,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Soberano! Camisa oficial do São Paulo FC para a temporada 2025. O tradicional branco com as faixas tricolores que representam décadas de conquistas. Tecido de alta performance.',
    features: ['Faixas tricolores', 'Escudo bordado', 'Tecido premium', 'Design clássico'],
    destaque: false
  },
  {
    id: 9,
    sku: 'FLU-I-2025',
    name: 'Camisa Fluminense I 2025',
    team: 'Fluminense',
    category: 'clubes',
    oldPrice: 179.90,
    price: 139.90,
    badge: '-22%',
    color: '#8B0000',
    emoji: '🔴⚪💚',
    images: ['/images/fluminense-i-2025-frente.jpg', '/images/fluminense-i-2025-costas.jpg', '/images/fluminense-i-2025-detalhe.jpg'],
    rating: 4.7,
    reviews: 167,
    sold: 654,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Time de Guerreiros! Camisa oficial do Fluminense para a temporada 2025. O tricolor grená, branco e verde que encanta o mundo. Tecido respirável de alta qualidade.',
    features: ['Tricolor tradicional', 'Escudo bordado', 'Tecido respirável', 'Atual campeão'],
    destaque: false
  },
  {
    id: 10,
    sku: 'BOT-I-2025',
    name: 'Camisa Botafogo I 2025',
    team: 'Botafogo',
    category: 'clubes',
    oldPrice: 179.90,
    price: 139.90,
    badge: '-22%',
    color: '#1a1a1a',
    emoji: '⭐⚫⚪',
    images: ['/images/botafogo-i-2025-frente.jpg', '/images/botafogo-i-2025-costas.jpg', '/images/botafogo-i-2025-detalhe.jpg'],
    rating: 4.7,
    reviews: 145,
    sold: 543,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Botafogo! Camisa oficial do Glorioso para a temporada 2025. As listras preto e branco que representam a estrela solitária. Tecido premium com tecnologia avançada.',
    features: ['Listras tradicionais', 'Estrela solitária', 'Escudo bordado', 'Tecido premium'],
    destaque: false
  },
  {
    id: 11,
    sku: 'VAS-I-2025',
    name: 'Camisa Vasco I 2025',
    team: 'Vasco',
    category: 'clubes',
    oldPrice: 179.90,
    price: 139.90,
    badge: '-22%',
    color: '#1a1a1a',
    emoji: '⚪⚫✝️',
    images: ['/images/vasco-i-2025-frente.jpg', '/images/vasco-i-2025-costas.jpg', '/images/vasco-i-2025-detalhe.jpg'],
    rating: 4.7,
    reviews: 134,
    sold: 487,
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
    description: 'Vascaíno! Camisa oficial do Vasco da Gama para a temporada 2025. A tradicional faixa diagonal com a cruz de malta que representa um gigante. Tecido de alta performance.',
    features: ['Faixa diagonal', 'Cruz de Malta', 'Escudo bordado', 'Gigante da Colina'],
    destaque: false
  },
  {
    id: 12,
    sku: 'KIT-INF-BRA',
    name: 'Camisa Infantil Brasil Copa 2026',
    team: 'Brasil',
    category: 'infantil',
    oldPrice: 149.90,
    price: 119.90,
    badge: '-20%',
    color: '#FEDD00',
    emoji: '👶🇧🇷',
    images: ['/images/brasil-infantil.jpg', '/images/brasil-infantil-2.jpg', '/images/brasil-infantil-3.jpg'],
    rating: 4.9,
    reviews: 98,
    sold: 456,
    sizes: ['2', '4', '6', '8', '10', '12', '14'],
    description: 'Pequeno torcedor! Camisa oficial infantil da Seleção Brasileira para a Copa 2026. Modelagem especial para crianças com tecido macio e confortável. Escudo CBF bordado, acabamento seguro.',
    features: ['Modelagem infantil', 'Tecido macio', 'Escudo CBF bordado', 'Acabamento seguro'],
    destaque: true
  }
];

// ============================================
// COMBOS ESPECIAIS (KITS)
// ============================================
const combos = [
  // KITS BRASIL
  {
    id: 101,
    sku: 'KIT-DUPLA-BRA',
    name: 'Kit Dupla Brasil Copa 2026',
    description: '2 camisas da Seleção (pode escolher cores)',
    composicao: '2x Camisas Brasil',
    category: 'kits-brasil',
    oldPrice: 315.80,
    price: 279.90,
    badge: 'Mais Vendido',
    badgeClass: '',
    savings: 'Economia de R$ 35,90',
    destaque: true,
    color: '#FEDD00',
    emoji: '🇧🇷🇧🇷'
  },
  {
    id: 102,
    sku: 'KIT-FAMILIA-BRA',
    name: 'Kit Família Brasil Copa 2026',
    description: '3 camisas para toda família torcer junta',
    composicao: '3x Camisas Brasil',
    category: 'kits-brasil',
    oldPrice: 473.70,
    price: 399.90,
    badge: 'Kit Família',
    badgeClass: 'green',
    savings: 'Economia de R$ 73,80',
    destaque: true,
    color: '#FEDD00',
    emoji: '👨‍👩‍👧🇧🇷'
  },
  {
    id: 103,
    sku: 'KIT-TORCIDA-BRA',
    name: 'Kit Torcida Brasil Copa 2026',
    description: '4 camisas para a galera toda',
    composicao: '4x Camisas Brasil',
    category: 'kits-brasil',
    oldPrice: 631.60,
    price: 499.90,
    badge: '-21%',
    badgeClass: '',
    savings: 'Economia de R$ 131,70',
    destaque: true,
    color: '#FEDD00',
    emoji: '🎉🇧🇷'
  },
  // KITS CASAL
  {
    id: 104,
    sku: 'KIT-CASAL-BRA',
    name: 'Kit Casal Brasil Copa 2026',
    description: '1 camisa masculina + 1 feminina',
    composicao: '1x Masc + 1x Fem',
    category: 'kits-casal',
    oldPrice: 315.80,
    price: 289.90,
    badge: 'Casal',
    badgeClass: 'green',
    savings: 'Economia de R$ 25,90',
    destaque: true,
    color: '#FEDD00',
    emoji: '💑🇧🇷'
  },
  {
    id: 105,
    sku: 'KIT-CASAL-COMP',
    name: 'Kit Casal Completo Brasil 2026',
    description: '2 masculinas + 2 femininas',
    composicao: '2x Masc + 2x Fem',
    category: 'kits-casal',
    oldPrice: 631.60,
    price: 529.90,
    badge: '-16%',
    badgeClass: '',
    savings: 'Economia de R$ 101,70',
    destaque: false,
    color: '#FEDD00',
    emoji: '💕🇧🇷'
  },
  // KITS BRASIL + CLUBE
  {
    id: 106,
    sku: 'KIT-PAIXAO',
    name: 'Kit Paixão Nacional',
    description: '1 Brasil + 1 do seu time do coração',
    composicao: '1x Brasil + 1x Clube',
    category: 'kits-misto',
    oldPrice: 297.80,
    price: 269.90,
    badge: 'Exclusivo',
    badgeClass: 'green',
    savings: 'Economia de R$ 27,90',
    destaque: true,
    color: '#009739',
    emoji: '🇧🇷❤️'
  },
  {
    id: 107,
    sku: 'KIT-RAIZ',
    name: 'Kit Torcedor Raiz',
    description: '2 Brasil + 1 do seu clube',
    composicao: '2x Brasil + 1x Clube',
    category: 'kits-misto',
    oldPrice: 455.70,
    price: 389.90,
    badge: '-14%',
    badgeClass: '',
    savings: 'Economia de R$ 65,80',
    destaque: false,
    color: '#009739',
    emoji: '🇧🇷⚽'
  },
  {
    id: 108,
    sku: 'KIT-COLEC',
    name: 'Kit Colecionador',
    description: '1 Brasil + 2 clubes à escolha',
    composicao: '1x Brasil + 2x Clubes',
    category: 'kits-misto',
    oldPrice: 437.70,
    price: 399.90,
    badge: 'Coleção',
    badgeClass: 'green',
    savings: 'Economia de R$ 37,80',
    destaque: false,
    color: '#009739',
    emoji: '🏆⚽'
  },
  // KITS PROMOCIONAIS
  {
    id: 109,
    sku: 'KIT-LEVE3-PAGUE2',
    name: 'Leve 3 Pague 2 - Super Promo',
    description: 'Compre 2 Brasil e GANHE 1 do clube',
    composicao: '2x Brasil + 1x Clube GRÁTIS',
    category: 'kits-promo',
    oldPrice: 437.70,
    price: 315.80,
    badge: 'GRÁTIS',
    badgeClass: 'green',
    savings: 'Economia de R$ 121,90',
    destaque: true,
    color: '#E53935',
    emoji: '🎁🔥'
  },
  {
    id: 110,
    sku: 'KIT-SUPER-COPA',
    name: 'Super Kit Copa 2026',
    description: '3 Brasil + 1 clube de brinde',
    composicao: '3x Brasil + 1x Clube GRÁTIS',
    category: 'kits-promo',
    oldPrice: 613.60,
    price: 449.90,
    badge: 'SUPER',
    badgeClass: 'green',
    savings: 'Economia de R$ 163,70',
    destaque: true,
    color: '#E53935',
    emoji: '🏆🎁'
  },
  {
    id: 111,
    sku: 'KIT-REVENDEDOR',
    name: 'Kit Revendedor Inicial',
    description: '5 camisas mistas para revenda',
    composicao: '5x Camisas Mistas',
    category: 'kits-promo',
    oldPrice: 788.50,
    price: 599.90,
    badge: '-24%',
    badgeClass: '',
    savings: 'Economia de R$ 188,60',
    destaque: false,
    color: '#1976D2',
    emoji: '💰📦'
  },
  {
    id: 112,
    sku: 'KIT-MEGA-TORCIDA',
    name: 'Kit Mega Torcida',
    description: '6 camisas Brasil (3 amarela + 3 azul)',
    composicao: '3x Amarela + 3x Azul',
    category: 'kits-promo',
    oldPrice: 947.40,
    price: 799.90,
    badge: 'MEGA',
    badgeClass: 'green',
    savings: 'Economia de R$ 147,50',
    destaque: false,
    color: '#FEDD00',
    emoji: '🎊🇧🇷'
  },
  // KIT FAMÍLIA COMPLETA
  {
    id: 113,
    sku: 'KIT-FAMILIA-COMP',
    name: 'Kit Família Completa Copa 2026',
    description: 'Pai + Mãe + Filho vestindo a amarelinha',
    composicao: '1x Masc + 1x Fem + 1x Infantil',
    category: 'kits-familia',
    oldPrice: 477.70,
    price: 399.90,
    badge: 'Família',
    badgeClass: 'green',
    savings: 'Economia de R$ 77,80',
    destaque: true,
    color: '#FEDD00',
    emoji: '👨‍👩‍👦🇧🇷'
  }
];

// ============================================
// AVALIACOES (Prova Social) - Com erros realistas
// ============================================
const reviews = [
  {
    name: 'Carlos M.',
    avatar: 'CM',
    rating: 5,
    date: 'há 2 dias',
    text: 'Camisa mtooo boa!! chegou rapido e bem embalada. super recomendo 👍',
    verified: true
  },
  {
    name: 'Ana Paula S.',
    avatar: 'AS',
    rating: 5,
    date: 'há 5 dias',
    text: 'ameiiii demais!! comprei o combo casal e ficou perfeito, material igualzinho a original',
    verified: true
  },
  {
    name: 'Roberto F.',
    avatar: 'RF',
    rating: 5,
    date: 'há 1 semana',
    text: 'ja é a terceira vez q compro aqui, qualidade sempre top! recomendo msm',
    verified: true
  },
  {
    name: 'Júlia R.',
    avatar: 'JR',
    rating: 4,
    date: 'há 1 semana',
    text: 'gostei mto da camisa, tecido confortavel.. só achei q demorou um pouco pra chegar mas veio certinho',
    verified: true
  },
  {
    name: 'Marcos V.',
    avatar: 'MV',
    rating: 5,
    date: 'há 2 semanas',
    text: 'produto show de bola! vou usar na copa kkk atendimento pelo whats foi otimo tbm',
    verified: true
  },
  {
    name: 'Fernanda L.',
    avatar: 'FL',
    rating: 5,
    date: 'há 3 dias',
    text: 'meu marido amouuu o presente, camisa linda e de ótima qualidade. entrega foi bem rapida',
    verified: true
  },
  {
    name: 'João Pedro',
    avatar: 'JP',
    rating: 5,
    date: 'há 4 dias',
    text: 'camisa top dms, material bom msm. comprei a do brasil e ja to querendo a do flamengo kkk',
    verified: true
  },
  {
    name: 'Luciana Costa',
    avatar: 'LC',
    rating: 4,
    date: 'há 6 dias',
    text: 'bonita a camisa, só o tamanho q ficou um pouco grande.. mas a qualidade é boa sim',
    verified: true
  },
  {
    name: 'Thiago S.',
    avatar: 'TS',
    rating: 5,
    date: 'há 1 semana',
    text: 'comprei 3 camisas no combo e todas vieram perfeitas!! preço muito bom comparado c outras lojas',
    verified: true
  },
  {
    name: 'Patrícia Almeida',
    avatar: 'PA',
    rating: 5,
    date: 'há 5 dias',
    text: 'entrega super rapida aqui em BH, camisa igualzinha da foto. amei!! ja indiquei p minhas amigas',
    verified: true
  }
];

// Comentários específicos por produto (com erros realistas de digitação)
const productComments = {
  1: [ // Brasil I
    { name: 'Ricardo M.', text: 'amarelinha lindaaa, qualidade top msm', rating: 5, date: 'há 2 dias' },
    { name: 'Camila F.', text: 'chegou antes do prazo, amei!! vai ser sucesso na copa', rating: 5, date: 'há 4 dias' },
    { name: 'Bruno S.', text: 'material mto bom, parece a original msm. recomendo', rating: 5, date: 'há 1 semana' },
    { name: 'Juliana R.', text: 'camisa perfeita!! meu marido amou o presente kkk', rating: 5, date: 'há 3 dias' },
    { name: 'Thiago P.', text: 'top demais!! ja to pronto pra copa 🇧🇷', rating: 5, date: 'há 5 dias' },
    { name: 'Fernanda A.', text: 'tecido de otima qualidade, nao desbota msm', rating: 5, date: 'há 1 semana' },
    { name: 'Marcos L.', text: 'entrega rapida dms, embalagem perfeita. nota 10!', rating: 5, date: 'há 2 semanas' },
    { name: 'Lucia S.', text: 'comprei 3 pro pessoal de casa, todo mundo amou kk', rating: 5, date: 'há 4 dias' },
    { name: 'Roberto C.', text: 'essa loja é seria msm, recomendo mto!!', rating: 5, date: 'há 6 dias' },
    { name: 'Ana Paula', text: 'demorou um pouquinho mas chegou certinha', rating: 4, date: 'há 1 semana' }
  ],
  2: [ // Brasil II (Azul)
    { name: 'Felipe A.', text: 'azul lindo dms, comprei pra mim e pro meu pai', rating: 5, date: 'há 3 dias' },
    { name: 'Mariana L.', text: 'tecido confortavel, nao esquenta. perfeita pro verao', rating: 5, date: 'há 5 dias' },
    { name: 'Pedro H.', text: 'camisa reserva mto bonita, material excelente tbm', rating: 5, date: 'há 1 semana' },
    { name: 'Carolina M.', text: 'amei o azul!! diferente e muito elegante msm', rating: 5, date: 'há 2 dias' },
    { name: 'Gustavo F.', text: 'qualidade igual a amarela, show de bola', rating: 5, date: 'há 4 dias' },
    { name: 'Isabela R.', text: 'presente pro namorado, ele ficou mto feliz kkk', rating: 5, date: 'há 6 dias' },
    { name: 'Lucas T.', text: 'ja lavei varias vezes e continua nova', rating: 5, date: 'há 2 semanas' },
    { name: 'Renato S.', text: 'tecido respiravel dms, otimo p usar no calor', rating: 5, date: 'há 1 semana' },
    { name: 'Beatriz L.', text: 'tamanho veio um pouco grande mas ta otimo', rating: 4, date: 'há 5 dias' }
  ],
  3: [ // Goleiro Brasil
    { name: 'Marcos A.', text: 'camisa de goleiro mto linda, verde perfeito!', rating: 5, date: 'há 2 dias' },
    { name: 'Lucas F.', text: 'comprei p jogar pelada kk material resistente', rating: 5, date: 'há 4 dias' },
    { name: 'Gustavo R.', text: 'tecido acolchoado nos cotovelos é show!! proteção top', rating: 5, date: 'há 6 dias' },
    { name: 'Rafael M.', text: 'uso pra jogar society, qualidade excelente msm', rating: 5, date: 'há 3 dias' },
    { name: 'Anderson L.', text: 'verde mto bonito, diferente das outras', rating: 5, date: 'há 1 semana' },
    { name: 'Bruno T.', text: 'comprei pra colecao, ficou top no quadro kk', rating: 5, date: 'há 5 dias' },
    { name: 'Diego S.', text: 'meu filho ama ser goleiro, ele adorou!!', rating: 5, date: 'há 4 dias' },
    { name: 'Carla P.', text: 'presente pro meu irmao q joga no gol, amou dms', rating: 5, date: 'há 2 semanas' }
  ],
  4: [ // Brasil Feminina
    { name: 'Amanda S.', text: 'modelagem feminina perfeita!! finalmente uma q serve bem', rating: 5, date: 'há 2 dias' },
    { name: 'Carla M.', text: 'ameiiii!! tecido leve e nao marca nada', rating: 5, date: 'há 4 dias' },
    { name: 'Patricia L.', text: 'comprei pra mim e pra minha mae, as duas amaram!!', rating: 5, date: 'há 1 semana' },
    { name: 'Juliana F.', text: 'finalmente uma camisa q valoriza o corpo feminino!!', rating: 5, date: 'há 3 dias' },
    { name: 'Fernanda R.', text: 'caimento perfeito!! super recomendo msm', rating: 5, date: 'há 5 dias' },
    { name: 'Bianca T.', text: 'comprei P e ficou perfeita no corpo, amei', rating: 5, date: 'há 6 dias' },
    { name: 'Lucia A.', text: 'vou usar em todos os jogos da copa 🇧🇷🇧🇷', rating: 5, date: 'há 4 dias' },
    { name: 'Maria Clara', text: 'tecido macio e fresquinho dms, amei', rating: 5, date: 'há 2 semanas' },
    { name: 'Renata M.', text: 'cor amarelo mto vivo, linda!! recomendo', rating: 5, date: 'há 1 semana' },
    { name: 'Gabriela S.', text: 'achei q ia ser grande mas ficou justa certinho', rating: 4, date: 'há 5 dias' }
  ],
  5: [ // Flamengo
    { name: 'Diego R.', text: 'mengooo!! manto sagrado chegou perfeito 🔴⚫', rating: 5, date: 'há 2 dias' },
    { name: 'Rafaela C.', text: 'presente pro meu namorado, ele amou! qualidade otima', rating: 5, date: 'há 6 dias' },
    { name: 'Anderson P.', text: 'ja comprei 2 camisas do mengão aqui, sempre vem perfeita', rating: 5, date: 'há 1 semana' },
    { name: 'Thiago M.', text: 'manto do mengao lindo dms!! vou usar na libertadores', rating: 5, date: 'há 3 dias' },
    { name: 'Bruno F.', text: 'sou flamengo doente e amei essa camisa kkkk', rating: 5, date: 'há 4 dias' },
    { name: 'Carla S.', text: 'listras perfeitas, escudo bordado de vdd', rating: 5, date: 'há 5 dias' },
    { name: 'Felipe L.', text: 'nacao vai pirar com essa qualidade!! top dms', rating: 5, date: 'há 2 semanas' },
    { name: 'Mariana R.', text: 'comprei pro meu pai flamenguista, chorou de emocao kk', rating: 5, date: 'há 1 semana' },
    { name: 'Pedro H.', text: 'vai mengão!! camisa top, entrega rapida tbm', rating: 5, date: 'há 4 dias' },
    { name: 'Lucia T.', text: 'tecido bom mas achei um pouco quente', rating: 4, date: 'há 6 dias' }
  ],
  6: [ // Corinthians
    { name: 'Leandro F.', text: 'timãooo!! camisa linda, material de primeira', rating: 5, date: 'há 3 dias' },
    { name: 'Tatiane M.', text: 'comprei pro meu filho, ele adorou. tamanho certinho', rating: 5, date: 'há 4 dias' },
    { name: 'Roberto S.', text: 'vai corintia!! camisa top dms, vou comprar outra', rating: 5, date: 'há 1 semana' },
    { name: 'Marcos P.', text: 'fiel ate morrer!! camisa perfeita msm', rating: 5, date: 'há 2 dias' },
    { name: 'Amanda L.', text: 'preto e branco lindo, escudo bordado show', rating: 5, date: 'há 5 dias' },
    { name: 'Carlos H.', text: 'todo jogo do timao eu uso essa camisa agora kk', rating: 5, date: 'há 6 dias' },
    { name: 'Fernanda R.', text: 'presente pro sogro corinthiano kkkk amou dms', rating: 5, date: 'há 2 semanas' },
    { name: 'Lucas M.', text: 'qualidade excelente msm, recomendo a loja', rating: 5, date: 'há 4 dias' },
    { name: 'Patricia A.', text: 'tecido confortavel dms, uso ate pra dormir kkk', rating: 5, date: 'há 1 semana' }
  ],
  7: [ // Palmeiras
    { name: 'Gustavo H.', text: 'verdão representado!! camisa show de bola', rating: 5, date: 'há 2 dias' },
    { name: 'Daniela S.', text: 'amei a qualidade, ja é a segunda q compro. super recomendo', rating: 5, date: 'há 5 dias' },
    { name: 'Henrique L.', text: 'porcooo!! camisa linda, entrega foi rapida tbm', rating: 5, date: 'há 4 dias' },
    { name: 'Felipe M.', text: 'avanti palestra!! verde lindo dms', rating: 5, date: 'há 3 dias' },
    { name: 'Carla R.', text: 'camisa do maior campeao brasileiro!! amei', rating: 5, date: 'há 6 dias' },
    { name: 'Bruno T.', text: 'tecido respiravel dms, otimo pra jogo', rating: 5, date: 'há 1 semana' },
    { name: 'Amanda F.', text: 'escudo bordado perfeito, detalhes top msm', rating: 5, date: 'há 2 semanas' },
    { name: 'Rafael S.', text: 'comprei G e ficou perfeito no corpo', rating: 5, date: 'há 5 dias' },
    { name: 'Lucia P.', text: 'meu marido palmeirense amou o presente kk', rating: 5, date: 'há 4 dias' }
  ],
  8: [ // São Paulo
    { name: 'Gabriel R.', text: 'tricolor paulista lindoooo!! qualidade top', rating: 5, date: 'há 2 dias' },
    { name: 'Amanda F.', text: 'camisa do spfc perfeita, faixas lindas dms', rating: 5, date: 'há 5 dias' },
    { name: 'Lucas M.', text: 'soberano!! camisa chegou rapido e mto bem embalada', rating: 5, date: 'há 1 semana' },
    { name: 'Fernanda L.', text: 'sao paulo ate morrer!! camisa maravilhosa', rating: 5, date: 'há 3 dias' },
    { name: 'Carlos T.', text: 'branco elegante, faixas tricolores perfeitas', rating: 5, date: 'há 4 dias' },
    { name: 'Bianca S.', text: 'presente pro meu pai sao paulino, ele amou!!', rating: 5, date: 'há 6 dias' },
    { name: 'Marcos R.', text: 'qualidade excelente msm, valeu cada centavo', rating: 5, date: 'há 2 semanas' },
    { name: 'Patricia M.', text: 'tecido de primeira, nao transparece nada', rating: 5, date: 'há 5 dias' },
    { name: 'Thiago A.', text: 'escudo bordado lindo, acabamento perfeito', rating: 5, date: 'há 4 dias' }
  ],
  9: [ // Fluminense
    { name: 'Fernando L.', text: 'tricolor das laranjeiras!! camisa mto linda', rating: 5, date: 'há 2 dias' },
    { name: 'Sandra M.', text: 'flu campeão!! qualidade incrivel da camisa', rating: 5, date: 'há 6 dias' },
    { name: 'Antonio R.', text: 'time de guerreiros!! material excelente msm', rating: 5, date: 'há 1 semana' },
    { name: 'Carla F.', text: 'tricolor carioca no peito!! amei dms', rating: 5, date: 'há 3 dias' },
    { name: 'Bruno T.', text: 'cores lindas, grena branco e verde perfeitos', rating: 5, date: 'há 4 dias' },
    { name: 'Lucia S.', text: 'meu filho é fluminense roxo, presente perfeito kk', rating: 5, date: 'há 5 dias' },
    { name: 'Rafael M.', text: 'camisa de campeao!! qualidade nota 10', rating: 5, date: 'há 2 semanas' },
    { name: 'Amanda L.', text: 'tecido macio e confortavel dms, uso direto', rating: 5, date: 'há 4 dias' },
    { name: 'Pedro H.', text: 'escudo do flu bordado lindamente, amei', rating: 5, date: 'há 6 dias' }
  ],
  10: [ // Botafogo
    { name: 'Eduardo P.', text: 'botafogooo!! estrela solitária representada', rating: 5, date: 'há 3 dias' },
    { name: 'Bianca S.', text: 'glorioso dms!! camisa chegou perfeita', rating: 5, date: 'há 5 dias' },
    { name: 'Rafael M.', text: 'material excelente msm, listras lindas', rating: 5, date: 'há 4 dias' },
    { name: 'Marcos L.', text: 'tempo bom!! camisa top do fogao', rating: 5, date: 'há 2 dias' },
    { name: 'Amanda R.', text: 'preto e branco classico, amei demais', rating: 5, date: 'há 6 dias' },
    { name: 'Carlos T.', text: 'estrela solitaria linda no peito!!', rating: 5, date: 'há 1 semana' },
    { name: 'Fernanda S.', text: 'presente pro meu tio botafoguense, chorou kk', rating: 5, date: 'há 2 semanas' },
    { name: 'Lucas F.', text: 'qualidade surpreendente pelo preco msm', rating: 5, date: 'há 4 dias' },
    { name: 'Patricia A.', text: 'tecido respiravel dms, otimo pro verao', rating: 5, date: 'há 5 dias' }
  ],
  11: [ // Vasco
    { name: 'Carlos V.', text: 'vascoooo!! cruz de malta no peito, emocionante', rating: 5, date: 'há 2 dias' },
    { name: 'Juliana G.', text: 'gigante da colina!! camisa linda dms', rating: 5, date: 'há 5 dias' },
    { name: 'Marcos R.', text: 'qualidade top!! faixa diagonal perfeita msm', rating: 5, date: 'há 1 semana' },
    { name: 'Amanda S.', text: 'vasco da gama no coracao!! amei a camisa', rating: 5, date: 'há 3 dias' },
    { name: 'Bruno L.', text: 'cruz de malta bordada linda, detalhes perfeitos', rating: 5, date: 'há 4 dias' },
    { name: 'Fernanda T.', text: 'presente pro meu sogro vascaino, ele adorou kk', rating: 5, date: 'há 6 dias' },
    { name: 'Lucas M.', text: 'camisa do gigante!! material de primeira', rating: 5, date: 'há 2 semanas' },
    { name: 'Patricia F.', text: 'faixa diagonal iconica, mto bonita', rating: 5, date: 'há 5 dias' },
    { name: 'Rafael A.', text: 'tecido confortavel dms, uso em todo jogo', rating: 5, date: 'há 4 dias' }
  ],
  12: [ // Infantil Brasil
    { name: 'Patricia M.', text: 'meu filho amouuuu!! tecido bem macio', rating: 5, date: 'há 2 dias' },
    { name: 'Renata S.', text: 'tamanho certinho, acabamento seguro p criança', rating: 5, date: 'há 4 dias' },
    { name: 'Ana L.', text: 'comprei pros meus 2 filhos, os dois ficaram lindos!!', rating: 5, date: 'há 6 dias' },
    { name: 'Mariana F.', text: 'meu pequeno torcedor ficou lindo!! amei dms', rating: 5, date: 'há 3 dias' },
    { name: 'Carla R.', text: 'tecido nao irrita a pele da criança, otimo msm', rating: 5, date: 'há 5 dias' },
    { name: 'Fernanda T.', text: 'presente pro sobrinho, ele usa todo dia kkk', rating: 5, date: 'há 1 semana' },
    { name: 'Lucia S.', text: 'modelagem infantil perfeita, nao fica largo', rating: 5, date: 'há 2 semanas' },
    { name: 'Amanda P.', text: 'meu filho de 6 anos amou, ja quer outra kk', rating: 5, date: 'há 4 dias' },
    { name: 'Bruno M.', text: 'comprei tamanho 8 e ficou perfeito no meu filho', rating: 5, date: 'há 5 dias' },
    { name: 'Juliana A.', text: 'qualidade excelente msm, vale mto a pena', rating: 5, date: 'há 6 dias' }
  ]
};

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

function getRandomReview(productId) {
  // Primeiro tenta pegar um comentario especifico do produto
  if (productComments[productId] && productComments[productId].length > 0) {
    const comments = productComments[productId];
    return comments[Math.floor(Math.random() * comments.length)];
  }
  // Senao, pega da lista geral de reviews
  return reviews[Math.floor(Math.random() * reviews.length)];
}

function renderProductCard(product) {
  const isFavorite = FavoritesManager.isFavorite(product.id);
  const border = product.color === '#ffffff' ? 'border: 1px solid #ddd;' : '';
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  const isPopular = product.sold > 1000;
  const initials = getTeamInitials(product.team);
  const recentBuyers = Math.floor(Math.random() * 15) + 5;
  const randomReview = getRandomReview(product.id);

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
        <div class="product-card-social-proof">
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="var(--orange)" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>
          <span>${product.sold}+ vendidos</span>
          <span class="social-proof-dot">•</span>
          <span class="social-proof-recent">${recentBuyers} compraram hoje</span>
        </div>
        <div class="product-card-review">
          <span class="review-quote">"${randomReview.text.substring(0, 60)}${randomReview.text.length > 60 ? '...' : ''}"</span>
          <span class="review-author">- ${randomReview.name}</span>
        </div>
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
  const badgeClass = combo.badgeClass ? combo.badgeClass : '';
  return `
    <div class="combo-card" onclick="openComboPage(${combo.id})" style="border-top: 4px solid ${combo.color || '#009739'}">
      <span class="combo-badge ${badgeClass}">${combo.badge}</span>
      <div class="combo-emoji">${combo.emoji || '🎁'}</div>
      <h3 class="combo-title">${combo.name}</h3>
      <p class="combo-description">${combo.description}</p>
      <p class="combo-composicao">${combo.composicao || ''}</p>
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
    // Mostra apenas os combos em destaque na home
    const featuredCombos = combos.filter(c => c.destaque);
    combosGrid.innerHTML = featuredCombos.slice(0, 6).map(renderComboCard).join('');
  }

  if (lancamentosGrid) {
    // Mostra produtos em destaque primeiro
    const featuredProducts = products.filter(p => p.destaque);
    const productsToShow = featuredProducts.length > 0 ? featuredProducts : products;
    lancamentosGrid.innerHTML = productsToShow.slice(0, 6).map(renderProductCard).join('');
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
    case 'infantil':
      filtered = products.filter(p => p.category === 'infantil');
      titleText = 'Infantil';
      break;
    case 'kits':
      // Para kits, mostra os combos convertidos em cards
      filtered = [];
      titleText = 'Kits e Combos';
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
// PAGINAS DE POLITICAS
// ============================================
const policyContent = {
  delivery: {
    title: 'Política de Entrega',
    content: `
      <h2>Política de Entrega</h2>
      <h3>Regiões Atendidas</h3>
      <p>Realizamos entregas para todo o Brasil através de transportadoras parceiras. Para a região de Sabará-MG, oferecemos entrega local com frete reduzido.</p>

      <h3>Prazos de Entrega</h3>
      <ul>
        <li><strong>Sabará-MG:</strong> 1-2 dias úteis - Frete R$5,00</li>
        <li><strong>Belo Horizonte-MG:</strong> 2-3 dias úteis - Frete R$30,00</li>
        <li><strong>Demais regiões:</strong> Calculado no checkout conforme CEP</li>
      </ul>

      <h3>Rastreamento</h3>
      <p>Após o envio, você receberá o código de rastreio por WhatsApp para acompanhar sua entrega em tempo real.</p>

      <h3>Problemas na Entrega</h3>
      <p>Em caso de problemas com a entrega, entre em contato conosco imediatamente pelo WhatsApp ou email.</p>
    `
  },
  privacy: {
    title: 'Política de Privacidade',
    content: `
      <h2>Política de Privacidade</h2>
      <h3>Coleta de Dados</h3>
      <p>Coletamos apenas os dados necessários para processar seu pedido: nome, endereço, telefone e email.</p>

      <h3>Uso dos Dados</h3>
      <p>Seus dados são utilizados exclusivamente para:</p>
      <ul>
        <li>Processar e entregar seu pedido</li>
        <li>Enviar atualizações sobre o status do pedido</li>
        <li>Contato em caso de dúvidas sobre o pedido</li>
      </ul>

      <h3>Proteção dos Dados</h3>
      <p>Não compartilhamos seus dados com terceiros, exceto transportadoras para realização da entrega.</p>

      <h3>Seus Direitos</h3>
      <p>Você pode solicitar a exclusão dos seus dados a qualquer momento entrando em contato conosco.</p>
    `
  },
  terms: {
    title: 'Termos de Uso',
    content: `
      <h2>Termos de Uso</h2>
      <h3>Aceitação dos Termos</h3>
      <p>Ao utilizar nosso site e realizar compras, você concorda com estes termos de uso.</p>

      <h3>Produtos</h3>
      <p>Todos os produtos vendidos são de alta qualidade. As imagens são ilustrativas e podem apresentar pequenas variações de cor.</p>

      <h3>Preços e Pagamento</h3>
      <p>Os preços podem ser alterados sem aviso prévio. Aceitamos pagamento via PIX, cartão de crédito e boleto bancário.</p>

      <h3>Trocas e Devoluções</h3>
      <p>Aceitamos trocas em até 7 dias após o recebimento, desde que o produto esteja em perfeitas condições, com etiquetas e embalagem original.</p>

      <h3>Contato</h3>
      <p>Para dúvidas ou problemas, entre em contato pelo WhatsApp (31) 99999-9999 ou email contato@spacefut.shop</p>
    `
  }
};

function openPolicyPage(type) {
  const policy = policyContent[type];
  if (!policy) return;

  document.getElementById('policyPageTitle').textContent = policy.title;
  document.getElementById('policyContent').innerHTML = policy.content;
  document.getElementById('policyPage').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePolicyPage() {
  document.getElementById('policyPage').classList.remove('active');
  document.body.style.overflow = '';
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
  document.getElementById('productRatingCount').textContent = `(${selectedProduct.reviews} avaliações)`;
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
// FUNCOES AUXILIARES DE NAVEGACAO
// ============================================
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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
// ANNOUNCEMENT BAR (Rotating Messages)
// ============================================
const announcementMessages = [
  'Frete R$5 para Sabará - Entrega Rápida',
  'Parcele em até 12x sem juros',
  'Copa 2026 - Garanta sua camisa!',
  'Qualidade Premium - Material Oficial',
  'Atendimento via WhatsApp'
];

let currentAnnouncementIndex = 0;

function initAnnouncementBar() {
  setInterval(() => {
    currentAnnouncementIndex = (currentAnnouncementIndex + 1) % announcementMessages.length;
    const textElement = document.getElementById('announcementText');
    if (textElement) {
      textElement.style.opacity = '0';
      setTimeout(() => {
        textElement.textContent = announcementMessages[currentAnnouncementIndex];
        textElement.style.opacity = '1';
      }, 300);
    }
  }, 4000);
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
  initAnnouncementBar();

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
