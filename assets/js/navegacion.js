
/**
 * Función para cargar las distintas vistas al contenedor principal.
 * @param {*} nombreArchivo String con el nombre del archivo que se quiere cargar.
 */
function cargarContenido(nombreArchivo, nombreCafeteria, nombreEvento) {
  document.querySelector('#main').innerHTML = '';

  fetch(nombreArchivo)
    .then(response => response.text())
    .then(html => {
      document.querySelector('#main').innerHTML = html;

      if (nombreArchivo != "home.html") {
        $("header").addClass("header-transparente");
      } else {
        $("header").removeClass("header-transparente");
      }
    })
    .then(() => { // Carga el contenido de las cafeterías dinámicamente cuando el html está cargado
      if (nombreArchivo == "home.html") {
        cargarHome();
      }
      else if (nombreArchivo == "evento.html") {
        clickEvento(nombreCafeteria, nombreEvento);
      }
      else if (nombreArchivo == "cafeteria.html") {
        clickCafeteria(nombreCafeteria);
      }
      else if (nombreArchivo == "buscador.html") {
        cargarBuscador(nombreCafeteria, true);
      }
    });
}

function cargarContenidoMap() {
  cargarContenido("map.html", null, null);

  scriptHtml = document.getElementById("script-api")
  if (scriptHtml) {
    scriptHtml.remove();
  }

  var script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBaIKV0ipX-n7b_RwquptRgH70iszT3G5Y&map_ids=fcbac43d02c5a043&callback=initMap";
  script.async = true;
  window.initMap = initMap;

  document.head.appendChild(script);
}
