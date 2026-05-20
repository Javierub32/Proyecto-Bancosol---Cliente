const API_URL = 'https://proyecto-bancosol.onrender.com/api/colaboradores/';

let colaboradoresData = [];
let colaboradorSeleccionadoId = null;

const tableBody = document.querySelector("#table-body");
const rightColumn = document.querySelector(".right-column");
const infoContainer = document.querySelector("#info-container");

async function loadColaboradores() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        
        colaboradoresData = jsonData;
        
        renderTable(colaboradoresData);

    } catch (error) {
        console.error("Error cargando colaboradores:", error);
        tableBody.innerHTML = `
        <tr>
        <td colspan="7" style="text-align:center; color:red;">
            Error de conexión: ${error.message}
        </td>
        </tr>`;
    }
}

const renderTable = (listaColaboradores) => {
    tableBody.innerHTML = '';

    if (!listaColaboradores || listaColaboradores.length === 0) {
        tableBody.innerHTML = `
        <tr>
        <td colspan="7" style="text-align:center;">No se encontraron colaboradores en la base de datos.</td>
        </tr>`;
        return;
    }

    listaColaboradores.forEach(colab => {
        const tr = document.createElement("tr");
        tr.dataset.id = colab.id;

        tr.innerHTML = `
            <td class="font-medium text-blue">${colab.nombre || '--'}</td>
            <td>${colab.domicilio || '--'}</td>
            <td>${colab.localidadSede?.nombre || '--'}</td>
            <td>${colab.colaboraEn?.nombre || '--'}</td>
            <td>${colab.coordinador?.nombre || 'Sin asignar'}</td>
            <td>${colab.contactoPrincipal || '--'}</td>
            <td>${colab.observaciones || 'Sin observaciones'}</td>
        `;

        tableBody.appendChild(tr);
    });
};

const renderInfoPanel = (colaborador) => {
    let contactosHtml = '';
    
    if (colaborador.contactos && colaborador.contactos.length > 0) {
        contactosHtml = colaborador.contactos.map(c => `
            <div class="info-card">
                <div class="info-header">
                    <div class="info-main">
                        <p class="lbl-capitan">${c.nombre || 'Sin nombre'}</p>
                    </div>
                    <div class="info-side">
                        <div>TELÉFONO</div>
                        <div>${c.telefono || '--'}</div>
                    </div>
                </div>
                <div class="info-body">
                    <p><strong>Email: </strong>${c.email || '--'}</p>
                </div>
            </div>
        `).join('');
    } else {
        contactosHtml = '<p class="text-muted">No hay contactos adicionales registrados.</p>';
    }

    infoContainer.innerHTML = `
        <div id="colaborador-container">
            <div id="colaborador-localization">
                <p id="lbl-colaborador">${colaborador.nombre}</p>
                <p id="lbl-domicilio">${colaborador.domicilio || 'Sin domicilio registrado'}</p>
                <p class="text-muted">${colaborador.codigo || '--'}, ${colaborador.localidadSede?.nombre || '--'}</p>
                <p class="text-muted">Colabora en: ${colaborador.colaboraEn?.nombre || '--'}</p>
            </div>
            <div id="colaborador-schedule">
                <div id="contactosCard">
                    ${contactosHtml}
                </div>
                <div id="colaborador-observaciones">
                    <p class="section-title">Observaciones</p>
                    <div class="info-card">
                        <div class="info-body">
                            <p>${colaborador.observaciones ? colaborador.observaciones : "Sin observaciones"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    if (row.classList.contains("selected")) {
        closeSidePanel();
        return;
    }

    document.querySelectorAll("#table-body tr").forEach(r => r.classList.remove("selected"));
    row.classList.add("selected");
    
    colaboradorSeleccionadoId = parseInt(row.dataset.id);
    const colaborador = colaboradoresData.find(c => c.id === colaboradorSeleccionadoId);
    
    if (colaborador) {
        renderInfoPanel(colaborador);
        rightColumn.classList.add("open");
    }
});

document.querySelector("#cancel-button").addEventListener("click", () => {
    closeSidePanel();
});

const closeSidePanel = () => {
    rightColumn.classList.remove("open");
    document.querySelectorAll("#table-body tr").forEach(r => r.classList.remove("selected"));
    colaboradorSeleccionadoId = null;

    setTimeout(() => {
        if(!rightColumn.classList.contains("open")) {
            infoContainer.innerHTML = "";
        }
    }, 300);
};

document.addEventListener("DOMContentLoaded", () => {
    loadColaboradores();
});