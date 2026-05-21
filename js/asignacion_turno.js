const tableBody = document.querySelector("#table-body");
const infoContainer = document.querySelector("#info-container");
const rightColumn = document.querySelector(".right-column");

let idTienda = null;
let lineales = 1;
let linealActual = 1;
let turnoId = 1;

async function loadAsignaciones() {
  const response = await fetch(
    "https://proyecto-bancosol.onrender.com/api/asignacionTurnos/",
  );

  if (!response.ok) {
    console.error("Error al cargar las asignaciones:", response.statusText);
    return;
  }

  const data = await response.json();

  data.forEach((tienda) => {
    const tr = document.createElement("tr");
    tr.dataset.id = tienda.idTiendaCampanya;
    tr.dataset.li = tienda.lineales;
    tr.innerHTML = `
		<td class="font-medium text-blue">${tienda.tienda}</td>
		<td>${tienda.domicilio}</td>
		<td>${tienda.localidad}</td>
		<td>${tienda.capitan || ""}</td>
		<td class="small-td">${tienda.viernesManana || ""}</td>
		<td class="small-td">${tienda.viernesTarde || ""}</td>
		<td class="small-td">${tienda.sabadoManana || ""}</td>
		<td class="small-td">${tienda.sabadoTarde || ""}</td>
	`;
    tableBody.appendChild(tr);
  });
}

async function fetchTurnoData() {
  if (!idTienda) return;

  const responseTienda = await fetch(
    `https://proyecto-bancosol.onrender.com/api/tiendas/buscarTiendaCampanya/${idTienda}`,
  );

  if (!responseTienda.ok) {
    console.error("Error al cargar la tienda:", responseTienda.statusText);
    return;
  }

  const tiendaData = await responseTienda.json();

  const responseTurno = await fetch(
    `https://proyecto-bancosol.onrender.com/api/asignacionTurnos/buscarTurno/${idTienda}/${turnoId}/${linealActual}`,
  );

  if (responseTurno.ok) {
    const textData = await responseTurno.text();

    if (textData) {
      turnoData = JSON.parse(textData);
    } else {
      turnoData = null;
    }
  } else {
    console.error("Error al cargar el turno:", responseTurno.statusText);
    turnoData = null;
  }

  renderSidePanel(tiendaData, turnoData);
}

function renderSidePanel(tienda, turno) {
  const nombreTienda = tienda?.tienda?.nombre || "Seleccione una tienda";
  const domicilioTienda = tienda?.tienda?.domicilio || "";

  let html = `
	<div id="volunteer-container">
		<div id="volunteer-localization">
			<div><p id="lbl-tienda">${nombreTienda}</p></div>
			<div><p id="lbl-domicilio">${domicilioTienda}</p></div>
		</div>
		<div id="volunteer-schedule">
			<label><input type="radio" name="schedule" value="1" ${turnoId == 1 ? "checked" : ""}> Viernes Mañana</label>
			<label><input type="radio" name="schedule" value="2" ${turnoId == 2 ? "checked" : ""}> Viernes Tarde</label>
			<label><input type="radio" name="schedule" value="3" ${turnoId == 3 ? "checked" : ""}> Sábado Mañana</label>
			<label><input type="radio" name="schedule" value="4" ${turnoId == 4 ? "checked" : ""}> Sábado Tarde</label>
		</div>
	`;

  if (lineales > 1) {
    html += `<div id="volunteer-lineal">`;
    for (let i = 1; i <= lineales; i++) {
      html += `<label><input type="radio" name="lineal" value="${i}" ${linealActual == i ? "checked" : ""}> L${i}</label>`;
    }
    html += `</div>`;
  }

  if (turno) {
    html += `
		<div id="volunteer-info">
			<div id="volunteer-name">
				<div><p id="lbl-capitan">${turno.colaborador?.nombre}</p></div>
				<div class="volunteer-date"><div>COMIENZO</div><div>${turno.horaInicio ? turno.horaInicio.substring(0, 5) : "--:--"}</div></div>
				<div class="volunteer-date"><div>FIN</div><div>${turno.horaFin ? turno.horaFin.substring(0, 5) : "--:--"}</div></div>
			</div>
			<div id="volunteer-observations"><p>${turno.observaciones || ""}</p></div>
		</div>
	`;
  } else {
    html += `
		<div id="volunteer-info">
			<div id="volunteer-name">
				<div><p id="lbl-capitan" style="color: gray; font-style: italic;">Sin asignar</p></div>
				<div class="volunteer-date"><div>COMIENZO</div><div>--:--</div></div>
				<div class="volunteer-date"><div>FIN</div><div>--:--</div></div>
			</div>
			<div id="volunteer-observations"><p style="color: gray; font-style: italic;">No hay información.</p></div>
		</div>
	`;
  }

  html += `
		</div>
		<div id="button-container">
			<button id="create-button">${turno ? "Editar" : "Crear"}</button>
			<button id="cancel-button">Cancelar</button>
			<button id="export-button">Exportar</button>
		</div>
	`;

  infoContainer.innerHTML = html;
}

tableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  if (row.classList.contains("selected")) {
    row.classList.remove("selected");
    rightColumn.classList.remove("open");
    idTienda = null;
    return;
  }

  idTienda = row.dataset.id;
  lineales = parseInt(row.dataset.li);
  turnoId = 1;
  linealActual = 1;

  tableBody
    .querySelectorAll("tr")
    .forEach((r) => r.classList.remove("selected"));
  row.classList.add("selected");
  rightColumn.classList.add("open");

  fetchTurnoData();
});

infoContainer.addEventListener("change", (e) => {
  if (e.target.name === "schedule") {
    turnoId = e.target.value;
    fetchTurnoData();
  } else if (e.target.name === "lineal") {
    linealActual = e.target.value;
    fetchTurnoData();
  }
});

infoContainer.addEventListener("click", (e) => {
  if (e.target.id === "create-button") {
    if (idTienda && turnoId && linealActual) {
      const params = new URLSearchParams({
        id: idTienda,
        turno: turnoId,
        lineal: linealActual,
      });
      window.location.href = `/html/formulario_turno.html?${params.toString()}`;
    }
  } else if (e.target.id === "cancel-button") {
    e.preventDefault();
    rightColumn.classList.remove("open");
    setTimeout(() => (infoContainer.innerHTML = ""), 300);
    idTienda = null;
    tableBody
      .querySelectorAll("tr")
      .forEach((r) => r.classList.remove("selected"));
  }
});

loadAsignaciones();
