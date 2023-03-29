
/**
   * Función para cargar las distintas vistas al contenedor principal.
   * @param {*} nombreArchivo String con el nombre del archivo que se quiere cargar.
   */
function cargarContenido(nombreArchivo) {
    document.querySelector('#main').innerHTML = ''
    fetch(nombreArchivo).then(response => response.text()).then(html => document.querySelector('#main').innerHTML = html);
    if (nombreArchivo != "home.html") {
        $("header").addClass("header-transparente");
    }
    else {
        $("header").removeClass("header-transparente");
    }
    //$('#main').load(nombreArchivo);
}  