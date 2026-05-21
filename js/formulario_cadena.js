const urlParams = new URLSearchParams(window.location.search);
const cadenaId = urlParams.get("id");

async function initForm() {
  if (cadenaId) {
    document.getElementById("form-title").innerText = "Edición de cadena";

    try {
      const response = await fetch(
        `https://proyecto-bancosol.onrender.com/api/cadenas/${cadenaId}`,
      );
      if (response.ok) {
        const data = await response.json();
        document.getElementById("cadena_id").value = data.id;
        document.getElementById("nombreCadena").value = data.nombre || "";
        document.getElementById("codigoCadena").value = data.codigo || "";
      }
    } catch (error) {
      console.error("Error al cargar la cadena:", error);
    }
  }
}

document.getElementById("cadenaform").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("cadena_id").value;
  const nombre = document.getElementById("nombreCadena").value;
  const codigo = document.getElementById("codigoCadena").value;

  const payload = {
    id: id ? parseInt(id) : null,
    nombre,
    codigo,
  };

  try {
    const response = await fetch(
      "https://proyecto-bancosol.onrender.com/api/cadenas/guardar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (response.ok) {
      window.location.href = "/html/cadenas.html";
    } else {
      alert("Error al guardar la cadena");
    }
  } catch (error) {
    console.error("Error guardando:", error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initForm();
});
