
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

function selectCafeteria(nombreArchivo) {
    cargarContenido(nombreArchivo);
    storeCafeteria();
}

function storeCafeteria() {
    if (typeof (Storage) != 'undefined') {
        console.log(Storage);
        /*Con esto en caso de tener ya 5 cafeterías visitadas lo que hariamos
        es quedarnos con las 4 ultimas para despues añadir la visitada ahora*/
        let historialPrevio = JSON.parse(localStorage.getItem("Cafeterias Visitadas"));
        let historialNuevo = [];
        if (historialPrevio != null) {
            if (historialPrevio.includes("Cafeteria Parabellum")) {
                let posicion = historialPrevio.indexOf("Cafeteria Parabellum");
                console.log(posicion)
                console.log(historialPrevio.length)
                for (let i = posicion; i <= historialPrevio.length - 2; i++) {
                    historialPrevio[i] = historialPrevio[i + 1];
                    console.log(i)
                }
                historialNuevo = historialPrevio;
                historialNuevo[historialPrevio.length - 1] = "Cafeteria Parabellum"
                console.log(historialPrevio);
            } else {
                if (historialPrevio.length >= 5) {
                    for (let i = 1; i < historialPrevio.length; i++) {
                        historialNuevo[i - 1] = historialPrevio[i];
                    }
                }
            }
        }
        /*Tener en cuenta que ahora añadimos manualmente el nombre de la cafeteria
      pero la idea seria que ese nombre se obtenga del mismo JSON por ejemplo*/
        historialNuevo = historialNuevo.concat("Cafeteria Parabellum")
        localStorage.setItem("Cafeterias Visitadas", JSON.stringify(historialNuevo));
        //Aqui simplemente lo imprimo por consola, pero el getItem nos servirá para obtener la
        //información del historial de visitas
        console.log(localStorage.getItem("Cafeterias Visitadas"))
    } else {
        alert("Storage no es compatible con este navegador");
    }
}

