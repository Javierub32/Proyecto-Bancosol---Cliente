const urlParams = new URLSearchParams(window.location.search);
const campanyaId = urlParams.get("id");

async function initForm() {
  if (campanyaId) {
    document.getElementById("form-title").innerText = "Edición de campaña";
  }

  try {
    const resTipos = await fetch(
      "https://proyecto-bancosol.onrender.com/api/tipoCampanyas/",
    );
    const selectTipo = document.getElementById("tipoCampanya");
    if (resTipos.ok) {
      const tipos = await resTipos.json();
      tipos.forEach((t) => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.nombre;
        selectTipo.appendChild(opt);
      });
    }

    const resCadenas = await fetch(
      "https://proyecto-bancosol.onrender.com/api/cadenas/",
    );
    const containerCadenas = document.getElementById("cadenas-container");
    if (resCadenas.ok) {
      const cadenas = await resCadenas.json();
      cadenas.forEach((c) => {
        const label = document.createElement("label");
        label.className = "checkbox-card";
        label.innerHTML = `
                    <input type="checkbox" name="cadenasSeleccionadas" value="${c.id}">
                    <span>${c.nombre}</span>
                `;
        containerCadenas.appendChild(label);
      });
    }

    if (campanyaId) {
      const resCamp = await fetch(
        `https://proyecto-bancosol.onrender.com/api/campanyas/${campanyaId}`,
      );
      if (resCamp.ok) {
        const camp = await resCamp.json();

        document.getElementById("campanya_id").value = camp.id;
        document.getElementById("nombreCampanya").value = camp.nombre || "";
        document.getElementById("fechaInicio").value = camp.fechaInicio || "";
        document.getElementById("fechaFin").value = camp.fechaFin || "";

        if (camp.tipoCampanya) {
          selectTipo.value = camp.tipoCampanya.id;
        }

        if (camp.cadenasParticipantes) {
          const checkedIds = camp.cadenasParticipantes.map((c) =>
            c.id.toString(),
          );
          document
            .querySelectorAll('input[name="cadenasSeleccionadas"]')
            .forEach((cb) => {
              if (checkedIds.includes(cb.value)) cb.checked = true;
            });
        }
      }
    }
  } catch (error) {
    console.error("Error al inicializar el formulario:", error);
  }
}

document
  .getElementById("campanyaform")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("campanya_id").value;
    const nombre = document.getElementById("nombreCampanya").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const idTipo = document.getElementById("tipoCampanya").value;

    const checkboxes = document.querySelectorAll(
      'input[name="cadenasSeleccionadas"]:checked',
    );
    const cadenasSeleccionadas = Array.from(checkboxes).map((cb) =>
      parseInt(cb.value),
    );

    const payload = {
      id: id ? parseInt(id) : null,
      nombre,
      idTipo: parseInt(idTipo),
      fechaInicio,
      fechaFin,
      cadenasSeleccionadas,
    };

    try {
      const response = await fetch(
        "https://proyecto-bancosol.onrender.com/api/campanyas/guardar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        window.location.href = "/html/campanyas.html";
      } else {
        alert("Error al guardar la campaña");
      }
    } catch (error) {
      console.error("Error guardando:", error);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  initForm();
});
