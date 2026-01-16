# SpaceFut - Materiais Esportivos

E-commerce de camisas de futebol e materiais esportivos.

## 📁 Estrutura do Projeto

```
spacefut/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   └── main.js         # JavaScript
├── images/             # Imagens (logo, favicon, produtos)
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Este arquivo
```

## 🚀 Deploy

### Vercel
1. Conecte o repositório GitHub ao Vercel
2. Framework Preset: `Other`
3. Build Command: (deixe vazio)
4. Output Directory: `./`
5. Clique em Deploy

### GitHub Pages
1. Vá em Settings > Pages
2. Source: `main` branch
3. Folder: `/ (root)`

## 🛠️ Desenvolvimento

Este é um projeto estático (HTML/CSS/JS puro). Para desenvolver localmente:

1. Clone o repositório
2. Abra `index.html` no navegador
3. Ou use um servidor local: `npx serve`

## 📝 Personalização

### Adicionar Produtos
Edite o array `products` em `js/main.js`:

```javascript
const products = [
  {
    id: 1,
    name: 'Nome do Produto',
    team: 'Time',
    category: 'selecao', // selecao, clubes, europeus, retro, acessorios
    oldPrice: 449.90,
    price: 349.90,
    badge: '-22%', // ou 'Novo', 'Retrô'
    badgeClass: '', // ou 'green' para badge verde
    image: 'url-da-imagem'
  },
  // ... mais produtos
];
```

### Alterar Logo
Substitua `images/logo.png` pela sua logo.

### Alterar Cores
Edite as variáveis CSS em `css/style.css`:

```css
:root {
  --primary: #009739;      /* Cor principal */
  --primary-dark: #006B2B; /* Cor principal escura */
  --yellow: #FEDD00;       /* Amarelo */
  /* ... */
}
```

## 📱 Features

- ✅ Design responsivo (mobile-first)
- ✅ Carrossel de produtos
- ✅ Filtro por categoria
- ✅ Página de produto
- ✅ Seleção de tamanho
- ✅ Checkout com formulário
- ✅ Múltiplas formas de pagamento

## 📄 Licença

Projeto privado - Todos os direitos reservados.
