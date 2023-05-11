
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
        // FUNCIÓN PARA CARGAR INFO DEL EVENTO
      }
      else if (nombreArchivo == "cafeteria.html") {
        clickCafeteria(nombreCafeteria);
      }
    });
}

function cargarContenidoMap(){
  cargarContenido("map.html");

  scriptHtml = document.getElementById("script-api")
  if(scriptHtml){
    scriptHtml.remove();
  }

  var script = document.createElement('script');

  /**
   * 
   * Author:
   * https://github.com/JordiSM
   * 
   * Replace API_KEY and MAP_ID with your own ones
   * 
   * Option1: Map with Food and Monuments Markers
   * <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBaIKV0ipX-n7b_RwquptRgH70iszT3G5Y&map_ids=ab4de70ad7fea2e0&callback=initMap"></script>
   * 
   * Option2: Map with NO Markers
   * <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBaIKV0ipX-n7b_RwquptRgH70iszT3G5Y&map_ids=fcbac43d02c5a043&callback=initMap"></script>
   * 
   * NOTE: This API_Key is restricted. More about this here:
   * https://developers.google.com/maps/api-security-best-practices?hl=es-419
   * 
  **/
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBaIKV0ipX-n7b_RwquptRgH70iszT3G5Y&map_ids=fcbac43d02c5a043&callback=initMap";
  script.async = true;
  window.initMap = initMap;

  document.head.appendChild(script);
}

function selectCafeteria(nombreArchivo) {
  cargarContenido(nombreArchivo);
}
