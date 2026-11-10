const initial = [
  {
    id: "CTO-001",
    name: "Centro · Rua Principal",
    seal: "LC-1042",
    capacity: 16,
    confidence: "verified",
    x: 24,
    y: 25,
    ports: [
      "used",
      "used",
      "free",
      "used",
      "free",
      "used",
      "free",
      "used",
      "used",
      "free",
      "free",
      "used",
      "free",
      "used",
      "free",
      "free",
    ],
    clients: {
      1: "Ana Paula",
      2: "Carlos Mendes",
      4: "João Ribeiro",
      6: "Marina Alves",
      8: "Pedro Costa",
      9: "Luciana Souza",
      12: "Rafael Lima",
      14: "Beatriz Rocha",
    },
  },
  {
    id: "CTO-002",
    name: "Centro · Praça da Matriz",
    seal: "LC-1088",
    capacity: 16,
    confidence: "verified",
    x: 48,
    y: 31,
    ports: [
      "used",
      "used",
      "used",
      "used",
      "used",
      "free",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
    ],
    clients: {
      1: "Bruno Santos",
      2: "Marcos Silva",
      3: "Julia Martins",
      4: "Fernanda Reis",
      5: "Paulo Nunes",
      7: "Lara Gomes",
      8: "Diego Freitas",
      9: "Camila Dias",
      10: "André Lopes",
      11: "Sofia Castro",
      12: "Tiago Melo",
      13: "Renata Lima",
      14: "Lucas Pires",
      15: "Clara Alves",
      16: "Vitor Souza",
    },
  },
  {
    id: "CTO-003",
    name: "Vila Nova · Rua das Flores",
    seal: "LC-1110",
    capacity: 8,
    confidence: "partial",
    x: 70,
    y: 22,
    ports: [
      "used",
      "free",
      "unknown",
      "used",
      "free",
      "used",
      "free",
      "unknown",
    ],
    clients: {
      1: "Gabriel Costa",
      4: "Patrícia Lima",
      6: "Eduardo Reis",
    },
  },
  {
    id: "CTO-004",
    name: "Bairro São José · Av. Brasil",
    seal: "LC-1197",
    capacity: 16,
    confidence: "verified",
    x: 31,
    y: 68,
    ports: [
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
      "used",
    ],
    clients: {
      1: "Roberto Alves",
      2: "Amanda Souza",
      3: "Felipe Rocha",
      4: "Isabela Dias",
      5: "Thiago Castro",
      6: "Bruna Melo",
      7: "Gustavo Pires",
      8: "Laura Nunes",
      9: "Daniel Lima",
      10: "Carla Freitas",
      11: "Vinicius Reis",
      12: "Aline Gomes",
      13: "Marcelo Santos",
      14: "Letícia Costa",
      15: "Igor Martins",
      16: "Bianca Lopes",
    },
  },
  {
    id: "CTO-005",
    name: "Bairro Industrial · Galpão",
    seal: "LC-1234",
    capacity: 8,
    confidence: "verified",
    x: 77,
    y: 62,
    ports: ["free", "used", "free", "free", "used", "free", "free", "free"],
    clients: { 2: "Márcio Tavares", 5: "Elisa Ferreira" },
  },
  {
    id: "CTO-006",
    name: "Jardim das Acácias · Rua 2",
    seal: "LC-1280",
    capacity: 16,
    confidence: "pending",
    x: 54,
    y: 77,
    ports: Array(16).fill("unknown"),
    clients: {},
  },
  {
    id: "CTO-007",
    name: "São Pedro · Avenida Norte",
    seal: "LC-1311",
    capacity: 8,
    confidence: "verified",
    x: 13,
    y: 48,
    ports: ["used", "free", "used", "free", "used", "free", "free", "used"],
    clients: {
      1: "Nicolas Barros",
      3: "Débora Martins",
      5: "Samuel Rocha",
      8: "Luiz Fernando",
    },
  },
  {
    id: "CTO-008",
    name: "Santa Tereza · Rua do Comércio",
    seal: "LC-1355",
    capacity: 16,
    confidence: "partial",
    x: 87,
    y: 39,
    ports: [
      "used",
      "free",
      "unknown",
      "used",
      "free",
      "free",
      "used",
      "free",
      "used",
      "unknown",
      "free",
      "used",
      "free",
      "free",
      "used",
      "free",
    ],
    clients: {
      1: "Michele Costa",
      4: "Caio Nunes",
      7: "Eliane Souza",
      9: "Arthur Dias",
      12: "Priscila Melo",
      15: "Renan Pires",
    },
  },
];
let pendingLocation = null;
let ctos;
try {
  ctos = JSON.parse(localStorage.getItem("fibracontrol_demo_ctos")) || initial;
} catch (e) {
  ctos = initial;
}
ctos = ctos.map((c) => ({
  ...c,
  clientCount: Number(
    c.clientCount ??
      Object.values(c.ports || []).filter((p) => p === "used").length,
  ),
  maxClients: Number(c.maxClients ?? c.capacity ?? 16),
  notes: c.notes || "",
}));
let selected = ctos[0]?.id || null,
  editingId = null,
  view = "dashboard";
const $ = (id) => document.getElementById(id);
const save = () => {
  try {
    localStorage.setItem("fibracontrol_demo_ctos", JSON.stringify(ctos));
  } catch (e) {}
};
const counts = (c) => ({
  free: c.ports.filter((p) => p === "free").length,
  used: c.ports.filter((p) => p === "used").length,
  unknown: c.ports.filter((p) => p === "unknown").length,
});
function badgeFor(c) {
  if (c.confidence === "pending" || counts(c).unknown)
    return ["A verificar", "warn"];
  let n = counts(c);
  if (!n.free) return ["Lotada", "bad"];
  if (c.confidence === "partial") return ["Parcial", "warn"];
  return ["Verificada", "ok"];
}
function mapClass(c) {
  let n = counts(c);
  if (n.unknown) return "mid";
  if (n.free === 0) return "full";
  return n.free <= 2 ? "mid" : "free";
}
function renderStats() {
  let all = ctos.reduce(
    (a, c) => {
      let n = counts(c);
      a.free += n.free;
      a.used += n.used;
      a.unknown += n.unknown;
      return a;
    },
    { free: 0, used: 0, unknown: 0 },
  );
  $("statCtos").textContent = ctos.length;
  $("statFree").textContent = all.free;
  $("statUsed").textContent = all.used;
  $("statUnknown").textContent = all.unknown;
}
let leafletMap = null,
  markerLayer = null;
const cityCenter = [-21.4561, -43.5523]; // Centro aproximado de Santos Dumont, MG
function initMap() {
  if (!window.L) {
    $("map").innerHTML =
      '<div class="empty">Não foi possível carregar o mapa. Confira sua conexão e recarregue a página.</div>';
    return;
  }
  if (leafletMap) return;
  leafletMap = L.map("map", { scrollWheelZoom: true }).setView(cityCenter, 15);
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
  // Try the standard OSM tile server first, then fall back if its tiles are blocked.
  let activeTiles = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution,
      subdomains: "abc",
    },
  ).addTo(leafletMap);
  let fallbackUsed = false;
  activeTiles.on("tileerror", () => {
    if (fallbackUsed) return;
    fallbackUsed = true;
    leafletMap.removeLayer(activeTiles);
    activeTiles = L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution,
    }).addTo(leafletMap);
    activeTiles.on("tileerror", () => {
      const msg = document.getElementById("mapFallback");
      if (msg) msg.style.display = "block";
    });
  });
  markerLayer = L.layerGroup().addTo(leafletMap);
  leafletMap.on("click", (e) => {
    pendingLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
    openModal();
  });
  setTimeout(() => leafletMap.invalidateSize(), 250);
}
function renderMap() {
  initMap();
  if (!leafletMap || !markerLayer) return;
  markerLayer.clearLayers();
  ctos.forEach((c, i) => {
    // Demo coordinates: approximate offsets around downtown, NOT actual company CTO locations.
    const lat = Number.isFinite(c.lat)
      ? c.lat
      : cityCenter[0] + ((c.y - 50) / 50) * 0.012;
    const lng = Number.isFinite(c.lng)
      ? c.lng
      : cityCenter[1] + ((c.x - 50) / 50) * 0.016;
    const cls = mapClass(c),
      color =
        cls === "free" ? "#15966a" : cls === "full" ? "#d84a5a" : "#d59a22";
    const icon = L.divIcon({
      className: "",
      html: `<div style="background:${color};color:#fff;border:2px solid white;border-radius:12px 12px 12px 3px;padding:6px 8px;box-shadow:0 2px 8px #14243a55;font-weight:800;font-size:10px;white-space:nowrap;${c.id === selected ? "outline:3px solid #1d3b70;outline-offset:2px;" : ""}">${esc(c.id.replace("CTO-", ""))}</div>`,
      iconSize: [48, 30],
      iconAnchor: [12, 28],
    });
    const marker = L.marker([lat, lng], { icon }).bindPopup(
      `<b>${esc(c.id)}</b><br>${esc(c.name)}<br>Clientes: ${Number(c.clientCount || 0)} / ${Number(c.maxClients || c.capacity || 0)}<br>${esc(c.notes || "Sem observações")}`,
    );
    marker.on("click", () => {
      selected = c.id;
      renderList();
      renderDetail();
      renderStats();
      renderMap();
    });
    marker.addTo(markerLayer);
  });
}
function renderList() {
  let q = $("search").value.toLowerCase().trim(),
    f = $("statusFilter").value;
  let rows = ctos
    .filter((c) => {
      let alltext = [c.id, c.name, c.seal, ...Object.values(c.clients || {})]
        .join(" ")
        .toLowerCase();
      if (q && !alltext.includes(q)) return false;
      let n = counts(c);
      if (f === "free" && n.free === 0) return false;
      if (f === "full" && n.free > 0) return false;
      if (f === "unknown" && n.unknown === 0 && c.confidence === "verified")
        return false;
      return true;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  $("ctoList").innerHTML = "";
  if (!rows.length) {
    $("ctoList").innerHTML = '<div class="empty">Nenhuma CTO encontrada.</div>';
    return;
  }
  rows.forEach((c) => {
    let n = counts(c),
      st = badgeFor(c);
    let el = document.createElement("div");
    el.className = "ctrow" + (c.id === selected ? " selected" : "");
    el.innerHTML = `<div class="ctsymbol">⌖</div><div class="ctinfo"><b>${esc(c.id)} <span class="badge ${st[1]}">${st[0]}</span></b><span>${esc(c.name)} · ${Number(c.clientCount ?? n.used)}/${Number(c.maxClients ?? c.capacity)} clientes</span></div><div class="ctmeta"><b>${Math.max(0, Number(c.maxClients ?? c.capacity) - Number(c.clientCount ?? n.used))} vagas</b><span>${Number(c.clientCount ?? n.used)} clientes</span></div>`;
    el.onclick = () => selectCto(c.id);
    $("ctoList").appendChild(el);
  });
}
function renderDetail() {
  let c = ctos.find((x) => x.id === selected);
  if (!c) {
    $("detailBody").innerHTML = '<div class="empty">Selecione uma CTO.</div>';
    return;
  }
  let n = counts(c),
    st = badgeFor(c),
    current = Number(c.clientCount ?? n.used),
    max = Number(c.maxClients ?? c.capacity),
    remaining = Math.max(0, max - current),
    pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  $("detailBody").innerHTML =
    `<div class="detailtop"><div><h3>${esc(c.id)} <span class="badge ${st[1]}">${st[0]}</span></h3><p>${esc(c.name)} · Lacre: <b>${esc(c.seal || "Não informado")}</b></p></div><button class="btn small" id="detailEdit">✎ Editar</button></div><div class="minis"><div class="mini"><span>Clientes atuais</span><b>${current}</b></div><div class="mini"><span>Capacidade de clientes</span><b>${max}</b></div><div class="mini"><span>Vagas restantes</span><b style="color:var(--green)">${remaining}</b></div></div><div style="height:8px;background:#e8edf5;border-radius:9px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${pct >= 100 ? "#d84a5a" : pct >= 75 ? "#d59a22" : "#15966a"}"></div></div><p class="muted" style="font-size:11px;margin:6px 0 10px">${pct}% da capacidade informada · ${esc(c.notes || "Sem observações registradas")}</p><div class="sectiontitle">Portas (controle técnico) <span class="muted" style="font-weight:500">Toque em uma porta para alterar</span></div><div class="sectiontitle">Portas <span class="muted" style="font-weight:500">Toque em uma porta para alterar</span></div><div class="ports">${c.ports.map((p, i) => `<button class="port ${p}" data-port="${i}" title="Clique para alterar"><b>${String(i + 1).padStart(2, "0")}</b><span>${p === "free" ? "Livre" : p === "used" ? "Ocupada" : "Verificar"}</span>${p === "used" && c.clients[i + 1] ? `<span>${esc(c.clients[i + 1])}</span>` : ""}</button>`).join("")}</div><div class="detailactions"><button class="btn" id="markAllBtn">Marcar todas como desconhecidas</button><button class="primary" id="newClientBtn">＋ Registrar cliente</button></div>`;
  $("detailEdit").onclick = () => openModal(c.id);
  document
    .querySelectorAll("[data-port]")
    .forEach(
      (el) => (el.onclick = () => cyclePort(c, Number(el.dataset.port))),
    );
  $("markAllBtn").onclick = () => {
    if (confirm("Marcar todas as portas desta CTO como desconhecidas?")) {
      c.ports = c.ports.map(() => "unknown");
      c.clients = {};
      c.confidence = "pending";
      save();
      logAction(c.id, "Todas as portas marcadas como desconhecidas");
      render();
    }
  };
  $("newClientBtn").onclick = () => openClientModal(c);
}
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch],
  );
}
function render() {
  renderStats();
  renderMap();
  renderList();
  renderDetail();
  $("editBtn").disabled = !selected;
}
function selectCto(id) {
  selected = id;
  render();
}
function cyclePort(c, i) {
  let p = c.ports[i];
  if (p === "free") {
    let name = prompt("Nome do cliente que ocupará a porta " + (i + 1) + ":");
    if (name === null) return;
    if (!name.trim()) {
      toast("Informe um nome para registrar o cliente.");
      return;
    }
    c.ports[i] = "used";
    c.clients[i + 1] = name.trim();
    c.clientCount = Math.min(
      Number(c.maxClients ?? c.capacity),
      Number(c.clientCount ?? 0) + 1,
    );
    logAction(c.id, `Porta ${i + 1} ocupada por ${name.trim()}`);
  } else if (p === "used") {
    if (
      !confirm(
        "Marcar porta " +
          (i + 1) +
          " como livre e remover o cliente vinculado?",
      )
    )
      return;
    let old = c.clients[i + 1];
    delete c.clients[i + 1];
    c.ports[i] = "free";
    c.clientCount = Math.max(0, Number(c.clientCount ?? 0) - 1);
    logAction(c.id, `Porta ${i + 1} liberada${old ? " (" + old + ")" : ""}`);
  } else {
    let choice = prompt(
      "Situação da porta " +
        (i + 1) +
        ": digite L para livre, O para ocupada ou V para continuar a verificar.",
      "L",
    );
    if (!choice) return;
    choice = choice.toLowerCase();
    if (choice === "l") {
      c.ports[i] = "free";
      delete c.clients[i + 1];
      logAction(c.id, `Porta ${i + 1} marcada livre`);
    } else if (choice === "o") {
      let name = prompt("Nome do cliente (ou identificação):");
      if (name === null) return;
      c.ports[i] = "used";
      if (name.trim()) c.clients[i + 1] = name.trim();
      c.clientCount = Math.min(
        Number(c.maxClients ?? c.capacity),
        Number(c.clientCount ?? 0) + 1,
      );
      logAction(c.id, `Porta ${i + 1} marcada ocupada`);
    } else if (choice === "v") {
      c.ports[i] = "unknown";
      delete c.clients[i + 1];
    } else {
      toast("Opção inválida.");
      return;
    }
  }
  if (c.ports.every((p) => p !== "unknown")) c.confidence = "verified";
  save();
  render();
}
function openModal(id = null) {
  editingId = id;
  let c = ctos.find((x) => x.id === id);
  $("modalTitle").textContent = c
    ? "Editar " + c.id
    : pendingLocation
      ? "Nova CTO — ponto escolhido no mapa"
      : "Nova CTO";
  $("fId").value = c
    ? c.id
    : "CTO-" +
      String(
        Math.max(0, ...ctos.map((x) => parseInt(x.id.split("-")[1]) || 0)) + 1,
      ).padStart(3, "0");
  $("fId").disabled = !!c;
  $("fName").value = c ? c.name : "";
  $("fSeal").value = c ? c.seal : "";
  $("fCapacity").value = c ? c.capacity : 16;
  $("fConfidence").value = c ? c.confidence : "pending";
  $("fClients").value = c ? Number(c.clientCount ?? 0) : 0;
  $("fMaxClients").value = c ? Number(c.maxClients ?? c.capacity ?? 16) : 16;
  $("fNotes").value = c ? c.notes || "" : "";
  $("modalBack").classList.add("show");
}
function closeModal() {
  $("modalBack").classList.remove("show");
  $("fId").disabled = false;
  pendingLocation = null;
}
$("ctoForm").onsubmit = (e) => {
  e.preventDefault();
  let id = $("fId").value.trim().toUpperCase(),
    name = $("fName").value.trim(),
    seal = $("fSeal").value.trim(),
    cap = Number($("fCapacity").value),
    confidence = $("fConfidence").value,
    clientCount = Number($("fClients").value),
    maxClients = Number($("fMaxClients").value),
    notes = $("fNotes").value.trim();
  if (!editingId && ctos.some((c) => c.id === id)) {
    toast("Já existe uma CTO com esse identificador.");
    return;
  }
  if (
    !Number.isInteger(clientCount) ||
    clientCount < 0 ||
    !Number.isInteger(maxClients) ||
    maxClients < 1
  ) {
    toast("Confira a quantidade de clientes e a capacidade máxima.");
    return;
  }
  if (editingId) {
    let c = ctos.find((c) => c.id === editingId);
    let oldcap = c.capacity;
    c.name = name;
    c.seal = seal;
    c.confidence = confidence;
    c.clientCount = clientCount;
    c.maxClients = maxClients;
    c.notes = notes;
    if (cap > oldcap) c.ports.push(...Array(cap - oldcap).fill("unknown"));
    if (cap < oldcap) {
      if (
        !confirm("Reduzir a capacidade removerá as últimas portas. Confirmar?")
      )
        return;
      c.ports = c.ports.slice(0, cap);
      Object.keys(c.clients).forEach((k) => {
        if (Number(k) > cap) delete c.clients[k];
      });
    }
    c.capacity = cap;
    logAction(c.id, "Cadastro da CTO atualizado");
  } else {
    let loc = pendingLocation;
    let c = {
      id,
      name,
      seal,
      capacity: cap,
      confidence,
      x: 12 + Math.random() * 76,
      y: 16 + Math.random() * 68,
      lat: loc?.lat,
      lng: loc?.lng,
      clientCount,
      maxClients,
      notes,
      ports: Array(cap).fill("unknown"),
      clients: {},
    };
    ctos.push(c);
    selected = id;
    logAction(
      id,
      "CTO cadastrada" +
        (loc
          ? " com localização escolhida no mapa"
          : "; localização aproximada de demonstração"),
    );
  }
  save();
  closeModal();
  render();
  toast("CTO salva neste navegador.");
};
function openClientModal(c) {
  let free = c.ports
    .map((p, i) => (p === "free" ? i + 1 : null))
    .filter(Boolean);
  if (!free.length) {
    toast("Não há portas confirmadas como livres nesta CTO.");
    return;
  }
  let port = prompt(
    "Portas livres: " + free.join(", ") + ". Digite o número da porta:",
  );
  if (port === null) return;
  let n = Number(port);
  if (!free.includes(n)) {
    toast("Porta inválida ou não está livre.");
    return;
  }
  let name = prompt("Nome/identificação do cliente:");
  if (!name || !name.trim()) return;
  c.ports[n - 1] = "used";
  c.clients[n] = name.trim();
  c.clientCount = Math.min(
    Number(c.maxClients ?? c.capacity),
    Number(c.clientCount ?? 0) + 1,
  );
  if (c.ports.every((p) => p !== "unknown")) c.confidence = "verified";
  logAction(c.id, `Cliente ${name.trim()} cadastrado na porta ${n}`);
  save();
  render();
  toast("Cliente vinculado à porta " + n);
}
let history = [];
try {
  history = JSON.parse(localStorage.getItem("fibracontrol_demo_history")) || [];
} catch (e) {}
function logAction(id, action) {
  history.unshift({
    time: new Date().toLocaleString("pt-BR"),
    id,
    action,
  });
  history = history.slice(0, 100);
  try {
    localStorage.setItem("fibracontrol_demo_history", JSON.stringify(history));
  } catch (e) {}
}
function toast(s) {
  $("toast").textContent = s;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2600);
}
$("addBtn").onclick = () => openModal();
$("editBtn").onclick = () => selected && openModal(selected);
$("closeModal").onclick = closeModal;
$("cancelModal").onclick = closeModal;
$("modalBack").onclick = (e) => {
  if (e.target === $("modalBack")) closeModal();
};
$("search").oninput = renderList;
$("statusFilter").onchange = renderList;
$("resetBtn").onclick = () => {
  if (leafletMap) leafletMap.setView(cityCenter, 15);
  selected = ctos[0]?.id || null;
  render();
};
$("exportBtn").onclick = () => {
  let rows = [
    [
      "CTO",
      "Referência",
      "Lacre",
      "Clientes atuais",
      "Capacidade de clientes",
      "Observações",
      "Porta",
      "Situação",
      "Cliente",
    ],
  ];
  ctos.forEach((c) =>
    c.ports.forEach((p, i) =>
      rows.push([
        c.id,
        c.name,
        c.seal,
        c.clientCount ?? "",
        c.maxClients ?? "",
        c.notes || "",
        i + 1,
        p === "free" ? "Livre" : p === "used" ? "Ocupada" : "Desconhecida",
        c.clients[i + 1] || "",
      ]),
    ),
  );
  let csv = rows
    .map((r) =>
      r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";"),
    )
    .join("\r\n");
  let a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  a.download = "fibracontrol-inventario-demo.csv";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("CSV exportado.");
};
document.querySelectorAll(".nav button").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".nav button")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      view = b.dataset.view;
      const isInfra = view === "infra";
      $("mainView").classList.toggle("hide", isInfra);
      $("infraView").classList.toggle("show", isInfra);
      if (isInfra) {
        renderInfra();
        return;
      }
      $("pageTitle").textContent = {
        dashboard: "Visão geral da rede",
        ctos: "CTOs e portas",
        clients: "Clientes",
        history: "Histórico de alterações",
      }[view];
      if (view === "clients") {
        $("listTitle").textContent = "Clientes cadastrados";
        $("listSubtitle").textContent = "Clientes vinculados a portas ocupadas";
        $("search").placeholder = "Buscar cliente, CTO ou região…";
        renderClients();
      } else if (view === "history") {
        $("listTitle").textContent = "Histórico de alterações";
        $("listSubtitle").textContent =
          "Atividades registradas nesta demonstração";
        renderHistory();
      } else {
        $("listTitle").textContent =
          view === "ctos" ? "Todas as CTOs" : "CTOs recentes";
        $("listSubtitle").textContent =
          "Selecione uma CTO para ver suas portas";
        $("search").placeholder = "Buscar CTO, lacre ou cliente…";
        renderList();
      }
    }),
);
function renderClients() {
  let q = $("search").value.toLowerCase();
  let arr = [];
  ctos.forEach((c) =>
    Object.entries(c.clients || {}).forEach(([p, n]) => arr.push({ c, p, n })),
  );
  arr = arr.filter((x) =>
    (x.n + " " + x.c.id + " " + x.c.name).toLowerCase().includes(q),
  );
  $("ctoList").innerHTML = arr.length
    ? arr
        .map(
          (x) =>
            `<div class="ctrow" onclick="selectCto('${x.c.id}')"><div class="ctsymbol">♙</div><div class="ctinfo"><b>${esc(x.n)}</b><span>${esc(x.c.id)} · ${esc(x.c.name)}</span></div><div class="ctmeta"><b>Porta ${x.p}</b><span>Conectado</span></div></div>`,
        )
        .join("")
    : '<div class="empty">Nenhum cliente encontrado.</div>';
}
function renderHistory() {
  let q = $("search").value.toLowerCase();
  let arr = history.filter((x) =>
    (x.id + " " + x.action).toLowerCase().includes(q),
  );
  $("ctoList").innerHTML = arr.length
    ? arr
        .map(
          (x) =>
            `<div class="ctrow"><div class="ctsymbol">↻</div><div class="ctinfo"><b>${esc(x.action)}</b><span>${esc(x.id)} · ${esc(x.time)}</span></div></div>`,
        )
        .join("")
    : '<div class="empty">Ainda não há alterações registradas.</div>';
}
render();
renderInfra();
window.addEventListener("resize", () => {
  if (leafletMap) leafletMap.invalidateSize();
});

const infraSeed = {
  projects: [
    {
      id: "INF-001",
      name: "Expansão Centro",
      region: "Centro · Av. Central até Praça",
      owner: "Equipe A",
      status: "Em andamento",
      date: "2026-11-15",
    },
    {
      id: "INF-002",
      name: "Derivação Vila Nova",
      region: "Vila Nova · Rua das Flores",
      owner: "Equipe B",
      status: "Planejamento",
      date: "2026-11-22",
    },
    {
      id: "INF-003",
      name: "Regularização de rota AS",
      region: "São José · trecho norte",
      owner: "Equipe C",
      status: "Pendente de vistoria",
      date: "2026-11-08",
    },
    {
      id: "INF-004",
      name: "Ampliação Jardim das Acácias",
      region: "Jardim das Acácias",
      owner: "Equipe A",
      status: "Concluído",
      date: "2026-10-20",
    },
  ],
  boxes: [
    {
      id: "CE-001",
      place: "Centro · poste 18",
      type: "Domo",
      fibers: "24F · 2 tubos em uso",
      project: "INF-001",
    },
    {
      id: "CE-002",
      place: "Vila Nova · esquina Rua 2",
      type: "Inline",
      fibers: "12F · conferir fusões",
      project: "INF-002",
    },
    {
      id: "CE-003",
      place: "São José · poste 41",
      type: "Domo",
      fibers: "48F · documentação parcial",
      project: "INF-003",
    },
    {
      id: "CE-004",
      place: "Jardim das Acácias · poste 7",
      type: "Inline",
      fibers: "24F · validada",
      project: "INF-004",
    },
  ],
  cables: [
    {
      id: "AS-012F-001",
      route: "Centro → CE-001",
      capacity: "12 fibras",
      status: "Em operação",
    },
    {
      id: "AS-024F-004",
      route: "CE-001 → Vila Nova",
      capacity: "24 fibras",
      status: "Em levantamento",
    },
    {
      id: "AS-048F-002",
      route: "São José → CE-003",
      capacity: "48 fibras",
      status: "Em operação",
    },
    {
      id: "AS-012F-009",
      route: "Jardim → CE-004",
      capacity: "12 fibras",
      status: "Pendente de vistoria",
    },
  ],
};
const colorRows = [
  ["01", "Azul", "#1976d2"],
  ["02", "Laranja", "#f28c28"],
  ["03", "Verde", "#238b45"],
  ["04", "Marrom", "#80502b"],
  ["05", "Cinza", "#8b929b"],
  ["06", "Branco", "#ffffff"],
  ["07", "Vermelho", "#d93036"],
  ["08", "Preto", "#222222"],
  ["09", "Amarelo", "#f4d03f"],
  ["10", "Violeta", "#8e44ad"],
  ["11", "Rosa", "#e879b9"],
  ["12", "Aqua", "#31b8bd"],
];
let infraData;
try {
  infraData =
    JSON.parse(localStorage.getItem("fibracontrol_infra_demo")) || infraSeed;
} catch (e) {
  infraData = JSON.parse(JSON.stringify(infraSeed));
}
function saveInfra() {
  try {
    localStorage.setItem("fibracontrol_infra_demo", JSON.stringify(infraData));
  } catch (e) {}
}
function statusBadge(s) {
  let cl =
    s === "Concluído" || s === "Em operação"
      ? "ok"
      : s === "Em andamento"
        ? "warn"
        : s === "Pendente de vistoria"
          ? "bad"
          : "warn";
  return `<span class="badge ${cl}">${esc(s)}</span>`;
}
function renderInfra() {
  $("ipActive").textContent = infraData.projects.filter(
    (p) => p.status === "Em andamento" || p.status === "Planejamento",
  ).length;
  $("ipBoxes").textContent = infraData.boxes.length;
  $("ipCables").textContent = infraData.cables.length;
  $("ipFibers").textContent = infraData.cables.reduce(
    (sum, c) => sum + (parseInt(c.capacity) || 0),
    0,
  );
  const q = ($("projectSearch")?.value || "").toLowerCase(),
    f = $("projectFilter")?.value || "all";
  const projects = infraData.projects.filter(
    (p) =>
      (f === "all" || p.status === f) &&
      [p.id, p.name, p.region, p.owner, p.status]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
  $("projectsBody").innerHTML =
    projects
      .map(
        (p) =>
          `<tr><td><b>${esc(p.id)}</b><br>${esc(p.name)}</td><td>${esc(p.region)}</td><td>${esc(p.owner)}</td><td>${statusBadge(p.status)}</td><td>${esc(p.date || "—")}</td><td><button class="btn small" onclick="editProject('${esc(p.id)}')">Editar</button></td></tr>`,
      )
      .join("") || '<tr><td colspan="6">Nenhum projeto encontrado.</td></tr>';
  const bq = ($("boxSearch")?.value || "").toLowerCase().trim(),
    bt = $("boxTypeFilter")?.value || "all";
  const boxes = infraData.boxes.filter(
    (b) =>
      (bt === "all" ||
        b.type === bt ||
        (bt === "Outro" && !["Domo", "Inline"].includes(b.type))) &&
      [b.id, b.place, b.type, b.fibers, b.project, b.notes]
        .join(" ")
        .toLowerCase()
        .includes(bq),
  );
  $("boxesBody").innerHTML =
    boxes
      .map(
        (b) =>
          `<tr><td><b>${esc(b.id)}</b><br>${esc(b.place)}${b.notes ? `<br><span class="muted">${esc(b.notes)}</span>` : ""}</td><td>${esc(b.type)}</td><td>${esc(b.fibers)}</td><td>${esc(b.project)}</td><td><div class="row-actions"><button class="btn" onclick="editBox('${esc(b.id)}')">Editar</button><button class="btn" onclick="deleteBox('${esc(b.id)}')">Excluir</button></div></td></tr>`,
      )
      .join("") || '<tr><td colspan="5">Nenhuma caixa encontrada.</td></tr>';
  const cq = ($("cableSearch")?.value || "").toLowerCase().trim(),
    cs = $("cableStatusFilter")?.value || "all";
  const cables = infraData.cables.filter(
    (c) =>
      (cs === "all" || c.status === cs) &&
      [c.id, c.route, c.capacity, c.status, c.notes]
        .join(" ")
        .toLowerCase()
        .includes(cq),
  );
  $("cablesBody").innerHTML =
    cables
      .map(
        (c) =>
          `<tr><td><b>${esc(c.id)}</b>${c.notes ? `<br><span class="muted">${esc(c.notes)}</span>` : ""}</td><td>${esc(c.route)}</td><td>${esc(c.capacity)}</td><td>${statusBadge(c.status)}</td><td><div class="row-actions"><button class="btn" onclick="editCable('${esc(c.id)}')">Editar</button><button class="btn" onclick="deleteCable('${esc(c.id)}')">Excluir</button></div></td></tr>`,
      )
      .join("") || '<tr><td colspan="5">Nenhum cabo encontrado.</td></tr>';
  $("colorsBody").innerHTML = colorRows
    .map(
      (r) =>
        `<tr><td>${r[0]}</td><td><span class="color-chip"><i style="background:${r[2]};${r[1] === "Branco" ? "border:1px solid #b9c1cc" : ""}"></i><b>${r[1]}</b></span></td><td><span style="display:inline-block;background:${r[2]};border:1px solid #cbd5e1;border-radius:4px;width:64px;height:13px;vertical-align:middle"></span></td><td>${Number(r[0]) <= 6 ? "Grupo 1" : "Grupo 2"}</td></tr>`,
    )
    .join("");
}
function editProject(id) {
  const p = infraData.projects.find((x) => x.id === id);
  if (!p) return;
  let status = prompt(
    "Status do projeto: Planejamento, Em andamento, Concluído ou Pendente de vistoria",
    p.status,
  );
  if (status === null) return;
  let valid = [
    "Planejamento",
    "Em andamento",
    "Concluído",
    "Pendente de vistoria",
  ];
  if (!valid.includes(status)) {
    toast("Status não reconhecido.");
    return;
  }
  p.status = status;
  saveInfra();
  renderInfra();
  logAction(id, "Status do projeto alterado para " + status);
  toast("Projeto atualizado.");
}
function addProject() {
  let id =
    "INF-" +
    String(
      Math.max(
        0,
        ...infraData.projects.map((p) => parseInt(p.id.split("-")[1]) || 0),
      ) + 1,
    ).padStart(3, "0");
  let name = prompt("Nome do projeto:");
  if (!name || !name.trim()) return;
  let region = prompt("Região / trecho:");
  if (!region || !region.trim()) return;
  let owner = prompt("Responsável / equipe:", "Equipe A") || "Não definido";
  let date = prompt("Previsão (AAAA-MM-DD):", "2026-12-01") || "";
  infraData.projects.push({
    id,
    name: name.trim(),
    region: region.trim(),
    owner,
    status: "Planejamento",
    date,
  });
  saveInfra();
  renderInfra();
  logAction(id, "Projeto de infraestrutura cadastrado");
  toast("Projeto cadastrado.");
}
function addBox() {
  let id =
    "CE-" +
    String(
      Math.max(
        0,
        ...infraData.boxes.map((b) => parseInt(b.id.split("-")[1]) || 0),
      ) + 1,
    ).padStart(3, "0");
  let place = prompt("Local / referência da caixa de emenda:");
  if (!place || !place.trim()) return;
  let type = prompt("Tipo (Domo, Inline ou outro):", "Domo") || "Domo";
  let fibers =
    prompt("Capacidade / situação das fibras:", "24F · conferir fusões") ||
    "A verificar";
  let project =
    prompt("Projeto relacionado (ex.: INF-001):", "") || "Sem projeto";
  let notes = prompt("Observações (opcional):", "") || "";
  infraData.boxes.push({
    id,
    place: place.trim(),
    type,
    fibers,
    project,
    notes,
  });
  saveInfra();
  renderInfra();
  logAction(id, "Caixa de emenda cadastrada");
  toast("Caixa de emenda cadastrada.");
}
function editBox(id) {
  let b = infraData.boxes.find((x) => x.id === id);
  if (!b) return;
  let place = prompt("Local / referência:", b.place);
  if (place === null) return;
  if (!place.trim()) {
    toast("O local é obrigatório.");
    return;
  }
  let type = prompt("Tipo:", b.type);
  if (type === null) return;
  let fibers = prompt("Capacidade / situação das fibras:", b.fibers);
  if (fibers === null) return;
  let project = prompt("Projeto relacionado:", b.project);
  if (project === null) return;
  let notes = prompt("Observações:", b.notes || "");
  if (notes === null) return;
  Object.assign(b, {
    place: place.trim(),
    type: type.trim() || "Outro",
    fibers: fibers.trim() || "A verificar",
    project: project.trim() || "Sem projeto",
    notes: notes.trim(),
  });
  saveInfra();
  renderInfra();
  logAction(id, "Caixa de emenda editada");
  toast("Caixa atualizada.");
}
function deleteBox(id) {
  if (!confirm("Excluir a caixa " + id + "? Esta ação não pode ser desfeita."))
    return;
  infraData.boxes = infraData.boxes.filter((b) => b.id !== id);
  saveInfra();
  renderInfra();
  logAction(id, "Caixa de emenda excluída");
  toast("Caixa excluída.");
}
function addCable() {
  let id = prompt("Identificação do cabo AS (ex.: AS-024F-005):");
  if (!id || !id.trim()) return;
  if (
    infraData.cables.some((c) => c.id.toLowerCase() === id.trim().toLowerCase())
  ) {
    toast("Já existe esse cabo.");
    return;
  }
  let route = prompt("Trecho / origem → destino:");
  if (!route || !route.trim()) return;
  let capacity =
    prompt("Capacidade (ex.: 24 fibras):", "24 fibras") || "A verificar";
  let status =
    prompt(
      "Status (Em operação, Em levantamento ou Pendente de vistoria):",
      "Em levantamento",
    ) || "Em levantamento";
  let notes = prompt("Observações (opcional):", "") || "";
  infraData.cables.push({
    id: id.trim().toUpperCase(),
    route: route.trim(),
    capacity,
    status,
    notes,
  });
  saveInfra();
  renderInfra();
  logAction(id, "Cabo AS cadastrado");
  toast("Cabo AS cadastrado.");
}
function editCable(id) {
  let c = infraData.cables.find((x) => x.id === id);
  if (!c) return;
  let route = prompt("Trecho / origem → destino:", c.route);
  if (route === null) return;
  if (!route.trim()) {
    toast("O trecho é obrigatório.");
    return;
  }
  let capacity = prompt("Capacidade:", c.capacity);
  if (capacity === null) return;
  let status = prompt(
    "Status (Em operação, Em levantamento ou Pendente de vistoria):",
    c.status,
  );
  if (status === null) return;
  let valid = ["Em operação", "Em levantamento", "Pendente de vistoria"];
  if (!valid.includes(status)) {
    toast("Status não reconhecido.");
    return;
  }
  let notes = prompt("Observações:", c.notes || "");
  if (notes === null) return;
  Object.assign(c, {
    route: route.trim(),
    capacity: capacity.trim() || "A verificar",
    status,
    notes: notes.trim(),
  });
  saveInfra();
  renderInfra();
  logAction(id, "Cabo AS editado");
  toast("Cabo atualizado.");
}
function deleteCable(id) {
  if (!confirm("Excluir o cabo " + id + "? Esta ação não pode ser desfeita."))
    return;
  infraData.cables = infraData.cables.filter((c) => c.id !== id);
  saveInfra();
  renderInfra();
  logAction(id, "Cabo AS excluído");
  toast("Cabo excluído.");
}
$("newProjectBtn")?.addEventListener("click", addProject);
$("newProjectBtn2")?.addEventListener("click", addProject);
$("newBoxBtn")?.addEventListener("click", addBox);
$("newCableBtn")?.addEventListener("click", addCable);
$("projectSearch")?.addEventListener("input", renderInfra);
$("projectFilter")?.addEventListener("change", renderInfra);
$("boxSearch")?.addEventListener("input", renderInfra);
$("boxTypeFilter")?.addEventListener("change", renderInfra);
$("cableSearch")?.addEventListener("input", renderInfra);
$("cableStatusFilter")?.addEventListener("change", renderInfra);
$("exportInfraBtn")?.addEventListener("click", () => {
  let rows = [
    ["ID", "Projeto", "Região", "Responsável", "Status", "Previsão"],
    ...infraData.projects.map((p) => [
      p.id,
      p.name,
      p.region,
      p.owner,
      p.status,
      p.date,
    ]),
  ];
  let csv = rows
    .map((r) =>
      r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";"),
    )
    .join("\r\n");
  let a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  a.download = "fibracontrol-projetos-infra.csv";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Projetos exportados para CSV.");
});
$("exportInventoryBtn")?.addEventListener("click", () => {
  const rows = [
    [
      "Categoria",
      "ID",
      "Local/trecho",
      "Tipo/capacidade",
      "Projeto/status",
      "Observações",
    ],
    ...infraData.boxes.map((b) => [
      "Caixa de emenda",
      b.id,
      b.place,
      b.type + " · " + b.fibers,
      b.project,
      b.notes || "",
    ]),
    ...infraData.cables.map((c) => [
      "Cabo AS",
      c.id,
      c.route,
      c.capacity,
      c.status,
      c.notes || "",
    ]),
    ...infraData.projects.map((p) => [
      "Projeto",
      p.id,
      p.region,
      p.name,
      p.status,
      (p.owner || "") + " · " + (p.date || ""),
    ]),
  ];
  const csv = rows
    .map((r) =>
      r.map((v) => '"' + String(v ?? "").replace(/"/g, '""') + '"').join(";"),
    )
    .join("\r\n");
  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fibracontrol-inventario-infra.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Inventário exportado para CSV.");
});
$("resetInfraBtn")?.addEventListener("click", () => {
  if (
    confirm(
      "Restaurar os exemplos iniciais? Isso substitui os dados de infraestrutura desta demonstração.",
    )
  ) {
    infraData = JSON.parse(JSON.stringify(infraSeed));
    saveInfra();
    renderInfra();
    toast("Exemplos restaurados.");
  }
});
