class IncludeHTML extends HTMLElement {
  async connectedCallback() {
    const src = this.getAttribute("src");
    if (src) {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.innerHTML = await response.text();

        if (src.includes("navbar.html")) {
          const currentPath = window.location.pathname;
          const navItems = this.querySelectorAll(".nav-item");

          navItems.forEach((item) => {
            item.classList.remove("active");
            const link = item.querySelector(".nav-link");
            if (link) {
              const href = link.getAttribute("href");
              
              const isTurnosActive = currentPath.includes("/html/formulario_turno.html") && 
                                     href.includes("/html/asignacion_turno.html");
                                     
              const isCampanyasActive = (currentPath.includes("/html/cadenas.html") || 
                                         currentPath.includes("/html/formulario_cadena.html") || 
                                         currentPath.includes("/html/formulario_campanya.html")) && 
                                        href.includes("/html/campanyas.html");

              if (currentPath === href || isTurnosActive || isCampanyasActive) {
                item.classList.add("active");
              }
            }
          });
        }
      } catch (error) {
        console.error("Error al importar el archivo HTML:", error);
      }
    }
  }
}
customElements.define("include-html", IncludeHTML);

const supabaseUrl = "https://dsizterjnkocusxdbvkk.supabase.co";
const supabaseKey = "sb_publishable_WXE5cBN_W5YyK6jSpdGXyg_tkP5mk0E";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
