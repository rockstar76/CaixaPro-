const form = document.getElementById("form");
const lista = document.getElementById("lista");
const saldoEl = document.getElementById("saldo");

const modal = document.getElementById("modal");
const cancelar = document.getElementById("cancelar");
const confirmar = document.getElementById("confirmar");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let editIndex = null;
let excluirIndex = null;

function formatarDataHora(data) {
  return new Date(data).toLocaleString("pt-BR");
}

function atualizarTela() {
  lista.innerHTML = "";
  let saldo = 0;
  
  transacoes.forEach((t, index) => {
    const totalProduto = t.preco * t.quantidade;
    saldo += t.tipo === "entrada" ? totalProduto : -totalProduto;
    
    const li = document.createElement("li");
    li.className = t.tipo;
    
    li.innerHTML = `
      <div>
        <strong>${t.descricao}</strong><br>
        ${t.quantidade} × R$ ${t.preco.toFixed(2)}<br>
        <strong>Total: R$ ${totalProduto.toFixed(2)}</strong><br>
        <small>${formatarDataHora(t.data)}</small>
      </div>

      <div class="actions">
        <button onclick="editar(${index})">✏️</button>
        <button onclick="abrirModal(${index})">🗑️</button>
      </div>
    `;
    
    lista.appendChild(li);
  });
  
  saldoEl.innerText = `R$ ${saldo.toFixed(2)}`;
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function editar(index) {
  const t = transacoes[index];
  document.getElementById("descricao").value = t.descricao;
  document.getElementById("preco").value = t.preco;
  document.getElementById("quantidade").value = t.quantidade;
  document.getElementById("tipo").value = t.tipo;
  editIndex = index;
}

function abrirModal(index) {
  excluirIndex = index;
  modal.classList.remove("hidden");
}

cancelar.onclick = () => {
  modal.classList.add("hidden");
  excluirIndex = null;
};

confirmar.onclick = () => {
  transacoes.splice(excluirIndex, 1);
  modal.classList.add("hidden");
  excluirIndex = null;
  atualizarTela();
};

form.addEventListener("submit", e => {
  e.preventDefault();
  
  const descricao = document.getElementById("descricao").value;
  const preco = Number(document.getElementById("preco").value);
  const quantidade = Number(document.getElementById("quantidade").value);
  const tipo = document.getElementById("tipo").value;
  
  const novo = {
    descricao,
    preco,
    quantidade,
    tipo,
    data: new Date().toISOString()
  };
  
  if (editIndex !== null) {
    novo.data = transacoes[editIndex].data; // mantém a data original
    transacoes[editIndex] = novo;
    editIndex = null;
  } else {
    transacoes.push(novo);
  }
  
  form.reset();
  atualizarTela();
});

atualizarTela();