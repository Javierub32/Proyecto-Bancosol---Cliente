const API_URL = 'https://proyecto-bancosol.onrender.com/api/campanyas/';
const tableBody = document.querySelector("#table-body-campanyas");
let campanyasData = [];
let isDeleteMode = false;

async function loadCampanyas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error del servidor");
        campanyasData = await response.json();
        renderTable();
    } catch (error) {
        console.error("Error al cargar campañas:", error);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error cargando campañas</td></tr>`;
    }
}

function renderTable() {
    tableBody.innerHTML = '';
    if (campanyasData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay campañas registradas</td></tr>`;
        return;
    }

    campanyasData.forEach(camp => {
        const tr = document.createElement('tr');
        const chips = camp.cadenasParticipantes?.map(c => `<span class="cadena-chip">${c.nombre}</span>`).join('') || "Sin cadenas participantes";
        
        tr.innerHTML = `
            <td>
                <div class="campanya-row-actions">
                    <input type="checkbox" class="campanya-delete-checkbox" value="${camp.id}" style="${isDeleteMode ? '' : 'display:none;'}">
                    <a class="edit-campanya-btn" href="/html/formulario_campanya.html?id=${camp.id}">
                        <span class="edit-campanya-icon">✎</span> Editar
                    </a>
                </div>
            </td>
            <td>${camp.tipoCampanya?.nombre || '--'}</td>
            <td>${camp.nombre}</td>
            <td>${camp.fechaInicio}</td>
            <td>${camp.fechaFin}</td>
            <td>${chips}</td>
        `;

        const check = tr.querySelector('.campanya-delete-checkbox');
        if (check) {
            check.addEventListener('change', () => {
                if (check.checked) {
                    tr.classList.add('campanya-row-selected');
                } else {
                    tr.classList.remove('campanya-row-selected');
                }
            });
        }

        tableBody.appendChild(tr);
    });
}

document.getElementById('btn-eliminar-modo').addEventListener('click', () => {
    isDeleteMode = true;
    document.getElementById('action-buttons-container').style.display = 'none';
    document.getElementById('delete-buttons-container').style.display = 'flex';
    renderTable();
});

document.getElementById('btn-cancel-delete').addEventListener('click', () => {
    isDeleteMode = false;
    document.getElementById('action-buttons-container').style.display = 'flex';
    document.getElementById('delete-buttons-container').style.display = 'none';
    renderTable();
});

document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    const checked = document.querySelectorAll('.campanya-delete-checkbox:checked');
    const ids = Array.from(checked).map(cb => parseInt(cb.value));
    
    if (ids.length === 0) {
        alert('Selecciona al menos una campaña para eliminar.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}eliminar`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        });
        
        if (response.ok) {
            isDeleteMode = false;
            document.getElementById('action-buttons-container').style.display = 'flex';
            document.getElementById('delete-buttons-container').style.display = 'none';
            loadCampanyas();
        } else {
            alert('Error al eliminar campañas.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conexión.');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadCampanyas();
});
