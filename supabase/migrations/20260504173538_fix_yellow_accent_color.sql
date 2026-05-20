-- Ajuste cor do contorno do número na versão amarela
-- Era #009C3B (verde Brasil vibrante) → #137A4F (verde mais escuro/musgo)
update products
set accent_hex = '#137A4F'
where color = 'Amarelo Estádio';
