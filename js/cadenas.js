const API_URL = 'https://proyecto-bancosol.onrender.com/api/cadenas/';
const tableBody = document.querySelector("#table-body-cadenas");
let cadenasData = [];
let isDeleteMode = false;

async function loadCadenas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error del servidor");
        cadenasData = await response.json();
        renderTable();
    } catch (error) {
        console.error("Error al cargar cadenas:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Error cargando cadenas</td></tr>`;
    }
}

function renderTable() {
    tableBody.innerHTML = '';
    if (cadenasData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay cadenas registradas</td></tr>`;
        return;
    }

    cadenasData.forEach(cad => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <div class="cadena-row-actions"> 
                    <input type="checkbox" class="cadena-delete-checkbox" value="${cad.id}" style="${isDeleteMode ? '' : 'display:none;'}">
                    <a class="cadena-edit-btn" href="/html/formulario_cadena.html?id=${cad.id}">
                        <span class="cadena-edit-icon">✎</span> Editar
                    </a>
                </div>
            </td>
            <td>${cad.nombre}</td>
            <td>${cad.codigo}</td>
        `;

        const check = tr.querySelector('.cadena-delete-checkbox');
        if (check) {
            check.addEventListener('change', () => {
                if (check.checked) {
                    tr.classList.add('cadena-row-selected');
                } else {
                    tr.classList.remove('cadena-row-selected');
                }
            });
        }

        tableBody.appendChild(tr);
    });

    document.querySelectorAll('.col-checkbox').forEach(el => {
        el.style.display = isDeleteMode ? '' : 'none';
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
    const checked = document.querySelectorAll('.cadena-delete-checkbox:checked');
    const ids = Array.from(checked).map(cb => parseInt(cb.value));
    
    if (ids.length === 0) {
        alert('Selecciona al menos una cadena para eliminar.');
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
            loadCadenas();
        } else {
            alert('Error al eliminar cadenas.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conexión.');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadCadenas();
});
