class IncludeHTML extends HTMLElement {
    async connectedCallback() {
        const src = this.getAttribute('src');
        if (src) {
            try {
                const response = await fetch(src);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                this.innerHTML = await response.text();
            } catch (error) {
                console.error('Error al importar el archivo HTML:', error);
            }
        }
    }
}
customElements.define('include-html', IncludeHTML);

// Configuración global de Supabase
const supabaseUrl = 'https://dsizterjnkocusxdbvkk.supabase.co';
const supabaseKey = 'sb_publishable_WXE5cBN_W5YyK6jSpdGXyg_tkP5mk0E';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);