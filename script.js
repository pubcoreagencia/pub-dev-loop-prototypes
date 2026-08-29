/* =========================================
   Lotada.app — Lógica do protótipo
   ========================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const screens = {
  login:   $('#screen-login'),
  home:    $('#screen-home'),
  confirm: $('#screen-confirm'),
  trip:    $('#screen-trip'),
  rate:    $('#screen-rate'),
};

const tabbar = $('#tabbar');
const toastEl = $('#toast');

let state = {
  destination: '',
  category: 'lotada',
  categoryPrice: 'R$ 14,90',
  stars: 5,
  tip: 2,
};

/* -------- Navegação entre telas -------- */
function show(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  // Esconde tabbar na tela de login/avaliação
  tabbar.style.display = (name === 'login' || name === 'rate') ? 'none' : 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -------- Toast -------- */
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

/* -------- Login -------- */
$('#btnContinue').addEventListener('click', () => {
  const phone = $('#phoneInput').value.trim();
  if (phone.replace(/\D/g, '').length < 10) {
    toast('Digite um telefone válido');
    return;
  }
  toast(`Enviamos um código para +55 ${phone}`);
  setTimeout(() => { show('home'); }, 700);
});
$('#btnGoogle').addEventListener('click', () => {
  toast('Login com Google iniciado');
  setTimeout(() => show('home'), 700);
});

/* -------- Home: chips, sugestões e busca -------- */
$$('.chip').forEach(c => c.addEventListener('click', () => {
  $('#toInput').value = c.dataset.place;
  state.destination = c.dataset.place;
  goConfirm();
}));
$$('.suggestion').forEach(s => s.addEventListener('click', () => {
  const name = s.querySelector('strong').textContent;
  $('#toInput').value = name;
  state.destination = name;
  goConfirm();
}));
$('#toInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    state.destination = e.target.value || 'Destino escolhido';
    goConfirm();
  }
});

function goConfirm() {
  if (!$('#toInput').value.trim() && !state.destination) {
    toast('Digite um destino');
    return;
  }
  const dest = state.destination || $('#toInput').value;
  $('#confirmDest').textContent = dest;
  $('#tripDest').textContent = dest;
  show('confirm');
}

/* -------- Confirmar: categorias -------- */
$$('.cat').forEach(cat => {
  cat.addEventListener('click', () => {
    $$('.cat').forEach(x => x.classList.remove('active'));
    cat.classList.add('active');
    state.category = cat.dataset.cat;
    state.categoryPrice = cat.querySelector('.price').textContent;
    $('#confirmPrice').textContent = state.categoryPrice;
  });
});

/* -------- Botão "voltar" do topbar -------- */
$$('[data-back]').forEach(b => b.addEventListener('click', () => show('home')));

/* -------- Pedir Lotada -------- */
$('#btnRequest').addEventListener('click', () => {
  show('trip');
  startTripFlow();
});

function startTripFlow() {
  // Etapa 1: procurando
  $('#searchStatus').style.display = 'block';
  $('#driverCard').style.display = 'none';
  $('#tripProgress').style.display = 'none';
  $('#tripStatus').textContent = 'Procurando motorista…';
  $('#tripSub').textContent = 'Aguarde, estamos achando o melhor pra você';
  $('#btnCancelTrip').textContent = 'Cancelar viagem';

  setTimeout(() => {
    // Motorista encontrado
    $('#searchStatus').style.display = 'none';
    $('#driverCard').style.display = 'flex';
    $('#tripProgress').style.display = 'flex';
    $('#tripStatus').textContent = 'Motorista a caminho';
    $('#tripSub').textContent = 'Chega em ~3 minutos';
    activateStep(0);
    toast('Rafael aceitou sua corrida 🚗');
  }, 2400);

  setTimeout(() => {
    activateStep(1);
    $('#tripStatus').textContent = 'Embarque confirmado';
    $('#tripSub').textContent = 'Aguarde o motorista no ponto';
  }, 6000);

  setTimeout(() => {
    activateStep(2);
    $('#tripStatus').textContent = 'Em viagem';
    $('#tripSub').textContent = 'Boa viagem! 🎶';
  }, 9000);

  setTimeout(() => {
    activateStep(3);
    $('#tripStatus').textContent = 'Você chegou!';
    $('#tripSub').textContent = 'Obrigado por viajar com a Lotada';
    setTimeout(() => show('rate'), 800);
  }, 13000);
}

function activateStep(idx) {
  $$('.trip-progress .step').forEach((el, i) => {
    el.classList.toggle('active', i <= idx);
  });
}

$('#btnCancelTrip').addEventListener('click', () => {
  toast('Viagem cancelada');
  show('home');
});

/* -------- Avaliação -------- */
const emojis = ['😡','😕','😐','🙂','😄'];
$$('#stars button').forEach(b => {
  b.addEventListener('click', () => {
    state.stars = +b.dataset.v;
    $$('#stars button').forEach(x => x.classList.toggle('active', +x.dataset.v <= state.stars));
    $('#rateEmoji').textContent = emojis[state.stars - 1];
    $('#rateEmoji').style.transform = 'scale(1.15)';
    setTimeout(() => $('#rateEmoji').style.transform = 'scale(1)', 200);
  });
  // pré-seleciona 5 estrelas
  if (+b.dataset.v <= 5) b.classList.add('active');
});

$$('.tip-opts button').forEach(b => {
  b.addEventListener('click', () => {
    $$('.tip-opts button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    state.tip = +b.dataset.tip;
  });
});

$('#btnSubmitRate').addEventListener('click', () => {
  toast('Obrigado pela avaliação! 💚');
  setTimeout(() => {
    show('home');
    $('#toInput').value = '';
    state.destination = '';
  }, 900);
});

/* -------- Tab bar (cosmético) -------- */
$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  const tab = t.dataset.tab;
  if (tab === 'trips') toast('Histórico de viagens');
  if (tab === 'wallet') toast('Carteira: R$ 0,00');
  if (tab === 'profile') toast('Perfil em breve');
}));

/* -------- Inicial -------- */
show('login');
