const form = document.getElementById("form");
const lista = document.getElementById("lista");
const saldoEl = document.getElementById("saldo");

const modal = document.getElementById("modal");
const btnCancelar = document.getElementById("cancelar");
const btnConfirmar = document.getElementById("confirmar");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || 0;
let editIndex = null;
let indexParaExcluir = null;

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR");
}

function atualizarTela() {
  lista.innerHTML = "";
  let saldo = 0;
  
  transacoes.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = t.tipo;
    
    li.innerHTML = `
      <div>
        <strong>${t.descricao}</strong><br>
        <span class="data">${formatarData(t.data)}</span><br>
        <span>Qtd: ${t.quantidade}</span>
      </div>

      <div>
        R$ ${t.valor.toFixed(2)}
        <div class="actions">
          <button class="editar" data-index="${index}">✏️</button>
          <button class="excluir" data-index="${index}">🗑️</button>
        </div>
      </div>
    `;
    
    lista.appendChild(li);
    
    saldo += t.tipo === "entrada" ? t.valor : -t.valor;
  });
  
  saldoEl.innerText = `R$ ${saldo.toFixed(2)}`;
  
  document.querySelectorAll(".editar").forEach(btn => {
    btn.onclick = () => editar(btn.dataset.index);
  });
  
  document.querySelectorAll(".excluir").forEach(btn => {
    btn.onclick = () => abrirModal(btn.dataset.index);
  });
}

function editar(index) {
  index = Number(index);
  const t = transacoes[index];
  
  document.getElementById("descricao").value = t.descricao;
  document.getElementById("valor").value = t.valor;
  document.getElementById("quantidade").value = t.quantidade;
  document.getElementById("tipo").value = t.tipo;
  
  editIndex = index;
}

function abrirModal(index) {
  indexParaExcluir = Number(index);
  modal.classList.remove("hidden");
}

btnCancelar.onclick = () => {
  indexParaExcluir = null;
  modal.classList.add("hidden");
};

btnConfirmar.onclick = () => {
  const t = transacoes[indexParaExcluir];
  estoque += t.tipo === "entrada" ? -t.quantidade : t.quantidade;
  transacoes.splice(indexParaExcluir, 1);
  modal.classList.add("hidden");
  indexParaExcluir = null;
  salvar();
};

function salvar() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarTela();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const descricao = document.getElementById("descricao").value;
  const valor = Number(document.getElementById("valor").value);
  const quantidade = Number(document.getElementById("quantidade").value);
  const tipo = document.getElementById("tipo").value;
  const data = new Date().toISOString();
  
  if (tipo === "saida" && quantidade > estoque && editIndex === null) {
    alert("⚠️ Estoque insuficiente!");
    return;
  }
  
  if (editIndex !== null) {
    const antigo = transacoes[editIndex];
    estoque += antigo.tipo === "entrada" ? -antigo.quantidade : antigo.quantidade;
    transacoes[editIndex] = { descricao, valor, quantidade, tipo, data };
    editIndex = null;
  } else {
    transacoes.push({ descricao, valor, quantidade, tipo, data });
  }
  
  estoque += tipo === "entrada" ? quantidade : -quantidade;
  form.reset();
  salvar();
});

atualizarTela();