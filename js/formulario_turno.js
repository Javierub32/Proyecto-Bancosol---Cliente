const urlParams = new URLSearchParams(window.location.search);
const tiendaId = urlParams.get("id");
const turnoId = urlParams.get("turno");
const lineal = urlParams.get("lineal");

const form = document.getElementById("turno-form");
const selectColaboradores = document.getElementById("input_colaboradores");
const colaboradorContainer = document.getElementById("colaborador_container");

let listaColaboradores = [];

async function initPage() {
  try {
	// Pedimos la lista de colaboradores
    const responseColaboradores = await fetch(
      "https://proyecto-bancosol.onrender.com/api/colaboradores/",
    );

    if (responseColaboradores.ok) {
      listaColaboradores = await responseColaboradores.json();

      listaColaboradores.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nombre;
        selectColaboradores.appendChild(opt);
      });
    } else {
      console.error("Error al cargar los colaboradores");
    }

	// Pedimos los datos del turno
    const responseTurno = await fetch(
      `https://proyecto-bancosol.onrender.com/api/asignacionTurnos/buscarTurno/${tiendaId}/${turnoId}/${lineal}`,
    );

    let turnoData = null;
    if (responseTurno.ok) {
      const textData = await responseTurno.text();
      if (textData) turnoData = JSON.parse(textData);
    } else {
      console.error("Error al cargar el turno:", responseTurno.statusText);
    }

	// Pedimos los datos de la tienda
    const responseTienda = await fetch(
      `https://proyecto-bancosol.onrender.com/api/tiendas/buscarTiendaCampanya/${tiendaId}`,
    );

    if (!responseTienda.ok) {
      console.error("Error al cargar la tienda:", responseTienda.statusText);
    }

    const tiendaData = await responseTienda.json();


	// Pedimos los datos del tipo de turno
    const responseTipoTurno = await fetch(
      `https://proyecto-bancosol.onrender.com/api/tipoTurno/${turnoId}`,
    );

    if (!responseTipoTurno.ok) {
      console.error(
        "Error al cargar el tipo de turno:",
        responseTipoTurno.statusText,
      );
    }
    const tipoTurnoData = await responseTipoTurno.json();

    const nombreTienda = tiendaData?.tienda?.nombre || "Tienda no encontrada";
    const domTienda = tiendaData?.tienda?.domicilio || "";
    const nombreTurno = tipoTurnoData?.nombre || "Turno " + turnoId;

	// Renderizamos el header con la info de tienda y turno
    renderHeaderInfo(nombreTienda, domTienda, nombreTurno, lineal);

    if (turnoData) {
      document.getElementById("turno_id").value = turnoData.id;
      selectColaboradores.value = turnoData.colaborador.id || 0;
      document.getElementById("input_num_voluntarios").value =
        turnoData.numVoluntarios || "";
      document.getElementById("input_hora_inicio").value =
        turnoData.horaInicio || "";
      document.getElementById("input_hora_fin").value = turnoData.horaFin || "";
      document.getElementById("input_observaciones").value =
        turnoData.observaciones || "";

      renderColaboradorInfo(turnoData.colaborador.id);
    } else {
      renderColaboradorInfo(0);
    }

    document.getElementById("tiendaCampanyaId").value = tiendaId;
    document.getElementById("tipoTurnoId").value = turnoId;
    document.getElementById("lineal").value = lineal;
  } catch (error) {
    console.error("Error crítico cargando la página:", error);
  }
}

selectColaboradores.addEventListener("change", (e) => {
  renderColaboradorInfo(e.target.value);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    idTurno: document.getElementById("turno_id").value,
    idTiendaCampanya: document.getElementById("tiendaCampanyaId").value,
    idTipoTurno: document.getElementById("tipoTurnoId").value,
    lineal: document.getElementById("lineal").value,
    idColaborador: selectColaboradores.value,
    numVoluntarios:
      document.getElementById("input_num_voluntarios").value || null,
    horaInicio: document.getElementById("input_hora_inicio").value || null,
    horaFin: document.getElementById("input_hora_fin").value || null,
    observaciones: document.getElementById("input_observaciones").value || null,
  };

  try {
    const response = await fetch(
      "https://proyecto-bancosol.onrender.com/api/asignacionTurnos/guardar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    window.location.href = "/html/asignacion_turno.html";
  } catch (error) {
    console.error("Error guardando el turno: ", error);
  }
});

function renderHeaderInfo(tienda, domicilio, turno, lineal) {
  document.getElementById("header-info").innerHTML = `
		<div class="turno-info-row">
			<span>${tienda} - <span class="text-mutex">${domicilio}</span></span>
			<span>${turno}</span>
		</div>
		<div class="turno-info-row">
			<span></span>
			<span>Lineal ${lineal}</span>
		</div>
	`;
}

function renderColaboradorInfo(idColaborador) {
  if (!idColaborador || idColaborador == 0) {
    colaboradorContainer.innerHTML =
      "<div style='color: gray; font-style: italic; text-align: center; margin-top: 20px;'>No hay colaborador seleccionado</div>";
    return;
  }

  const col = listaColaboradores.find((c) => c.id == idColaborador);

  if (!col) return;

  let contactosHtml = "";
  if (col.contactos && col.contactos.length > 0) {
    contactosHtml = col.contactos
      .map(
        (c) => `
			<div class="info-card">
				<div class="info-header">
					<div class="info-main">
						<p class="lbl-capitan">${c.nombre}</p>
					</div>
					<div class="info-side">
						<div>TELÉFONO</div>
						<div>${c.telefono || "--"}</div>
					</div>
				</div>
				<div class="info-body">
					<p><strong>Email: </strong>${c.email || "--"}</p>
				</div>
			</div>
		`,
      )
      .join("");
  } else {
    contactosHtml = `<p class="text-muted" style="font-size: 0.85rem;">No hay contactos registrados.</p>`;
  }

  colaboradorContainer.innerHTML = `
	<div id="colaborador-localization">
		<p id="lbl-colaborador">${col.nombre}</p>
		<p id="lbl-domicilio">${col.domicilio || "--"}</p>
		<p class="text-muted">${col.codigo || "--"}, ${col.localidadSede ? col.localidadSede.nombre : "--"}</p>
		<p class="text-muted">Colabora en: ${col.colaboraEn ? col.colaboraEn.nombre : "--"}</p>
	</div>
	<div id="colaborador-schedule">
		<div id="contactosCard">
			${contactosHtml}
		</div>
		<div id="colaborador-observaciones">
			<p class="section-title">Observaciones</p>
			<div class="info-card">
				<div class="info-body">
					<p>${col.observaciones ? col.observaciones : "Sin observaciones"}</p>
				</div>
			</div>
		</div>
	</div>
`;
}

initPage();
