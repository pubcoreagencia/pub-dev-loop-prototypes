// ====== Menu (dados) ======
const menuData = {
  cafes: [
    { name: "Espresso Aroma", price: "R$ 7,00", desc: "Extraído na hora, encorpado e com notas de chocolate.", tag: "Clássico" },
    { name: "Cappuccino Cremoso", price: "R$ 12,00", desc: "Espresso, leite vaporizado e espuma aveludada.", tag: "Mais pedido" },
    { name: "Latte de Caramelo", price: "R$ 14,50", desc: "Espresso com leite e calda de caramelo artesanal.", tag: "Docinho" },
    { name: "Cold Brew", price: "R$ 13,00", desc: "Café extraído a frio por 16h, suave e refrescante.", tag: "Gelado" },
    { name: "Mocha Brasileiro", price: "R$ 15,00", desc: "Espresso, chocolate meio amargo e leite cremoso.", tag: "Especial" },
    { name: "Café Coado (500ml)", price: "R$ 10,00", desc: "Método V60, grãos do dia, sabor delicado.", tag: "Single origin" },
  ],
  doces: [
    { name: "Bolo de Cenoura", price: "R$ 11,00", desc: "Massa fofinha com cobertura generosa de chocolate.", tag: "Caseiro" },
    { name: "Cheesecake de Frutas Vermelhas", price: "R$ 16,00", desc: "Creme suave com calda artesanal de frutas.", tag: "Favorito" },
    { name: "Brownie Quente", price: "R$ 12,50", desc: "Servido com sorvete de creme e calda quente.", tag: "Quentinho" },
    { name: "Pão de Queijo", price: "R$ 5,00", desc: "Receita mineira, crocante por fora e macio por dentro.", tag: "Mineiro" },
    { name: "Croissant de Amêndoas", price: "R$ 10,50", desc: "Folhado amanteigado com creme de amêndoas.", tag: "Francês" },
  ],
  salgados: [
    { name: "Sanduíche de Presunto e Queijo", price: "R$ 14,00", desc: "Pão ciabatta, queijo gruyère e presunto parma.", tag: "Clássico" },
    { name: "Tosta de Frango com Catupiry", price: "R$ 16,50", desc: "Pão integral, frango desfiado e catupiry original.", tag: "Brasileiro" },
    { name: "Quiche de Espinafre", price: "R$ 15,00", desc: "Massa amanteigada recheada com espinafre e ricota.", tag: "Vegetariano" },
    { name: "Bauru da Casa", price: "R$ 17,00", desc: "Pão francês, rosbife, queijo e tomate fresco.", tag: "Da casa" },
  ],
  bebidas: [
    { name: "Suco Verde Detox", price: "R$ 13,00", desc: "Couve, limão, gengibre, maçã e hortelã.", tag: "Saudável" },
    { name: "Chá de Hibisco Gelado", price: "R$ 9,50", desc: "Refrescante, levemente ácido e aromático.", tag: "Natural" },
    { name: "Chocolate Quente Cremoso", price: "R$ 12,00", desc: "Chocolate belga derretido no leite integral.", tag: "Quentinho" },
    { name: "Limonada Siciliana", price: "R$ 10,00", desc: "Limão siciliano, hortelã e um toque de mel.", tag: "Refrescante" },
  ],
};

// ====== Render do Menu ======
const grid = document.getElementById("menu-grid");
const tabButtons = document.querySelectorAll(".tab-btn");

function renderMenu(category) {
  const items = menuData[category] || [];
  grid.innerHTML = items
    .map(
      (item) => `
      <article class="menu-item">
        <div class="menu-item-head">
          <h3>${item.name}</h3>
          <span class="price">${item.price}</span>
        </div>
        <p>${item.desc}</p>
        <span class="tag">${item.tag}</span>
      </article>
    `
    )
    .join("");
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    renderMenu(btn.dataset.tab);
  });
});

// Inicializa
renderMenu("cafes");

// ====== Ano no footer ======
document.getElementById("year").textContent = new Date().getFullYear();

// ====== Reserva (fake) ======
function reservar(form) {
  const nome = form.nome.value.trim();
  const data = form.data.value;
  const pessoas = form.pessoas.value;
  const msg = document.getElementById("reserve-msg");
  if (!nome || !data || !pessoas) {
    msg.textContent = "Preencha todos os campos para reservar.";
    return;
  }
  const dataBR = new Date(data + "T00:00").toLocaleDateString("pt-BR");
  msg.textContent = `Reserva confirmada para ${nome} — ${pessoas} pessoa(s) em ${dataBR}. Te esperamos! ☕`;
  form.reset();
}
