-- Ajuste paleta da versão amarela: teal escuro no fill, teal vibrante na borda
update products
set
  text_color = '#0F4F4A',
  accent_hex = '#2EC4B6'
where color = 'Amarelo Estádio';
