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
      else if (nombreArchivo == "cafeteria.html") {
        // FUNCIÓN PARA CARGAR INFO DE CAFETERÍA
      }
      else if (nombreArchivo == "evento.html") {
        // FUNCIÓN PARA CARGAR INFO DEL EVENTO
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
  storeCafeteria();
}

function storeCafeteria() {
  if (typeof (Storage) != 'undefined') {
    console.log(Storage);
    /*Con esto en caso de tener ya 5 cafeterías visitadas lo que hariamos
    es quedarnos con las 4 ultimas para despues añadir la visitada ahora*/
    let historialPrevio = localStorage.getItem("Cafeterias Visitadas");
    if (historialPrevio !== '') {
      historialPrevio = JSON.parse(historialPrevio);
    }
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
        /*Tener en cuenta que ahora añadimos manualmente el nombre de la cafeteria
        pero la idea seria que ese nombre se obtenga del mismo JSON por ejemplo*/
        historialNuevo = historialNuevo.concat("Cafeteria Parabellum");
      }
    } else {
      historialNuevo = historialNuevo.concat("Cafeteria Parabellum");
    }
    localStorage.setItem("Cafeterias Visitadas", JSON.stringify(historialNuevo));
    //Aqui simplemente lo imprimo por consola, pero el getItem nos servirá para obtener la
    //información del historial de visitas
    console.log(localStorage.getItem("Cafeterias Visitadas"))
  } else {
    alert("Storage no es compatible con este navegador");
  }
}
