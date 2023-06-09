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
      vaciarJSONLD(); // Eliminamos todas las etiquetas <script> de JSON-LD presentes
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
      window.scrollTo({ // Hacemos scroll al principio de la página
        top: 0,
        behavior: 'instant'
      });
    });
}

function cargarHome() {
  // Hacemos el request del JSON
  const request = new XMLHttpRequest();
  request.open("GET", "/assets/JSON/cafeterias.json");
  request.responseType = 'text';

  request.onload = () => {
      // Convertimos el JSON a objetos JS
      const objeto = JSON.parse(request.response);
      var listaCafeterias = objeto.itemListElement;
      cargarCafeteriasPorValoracion(listaCafeterias);
      cargarCafeteriasPorCercania(listaCafeterias);
      cargarEventos(listaCafeterias);
      cargarRecientes();
  };
  request.send();
}

function clickCafeteria(nombreCafeteria) {
  // Hacemos el request del JSON
  const request = new XMLHttpRequest();
  request.open("GET", "/assets/JSON/cafeterias.json");
  request.responseType = 'text';

  request.onload = () => {
      // Convertimos el JSON a objetos JS
      const objeto = JSON.parse(request.response);
      var listaCafeterias = objeto.itemListElement;
      cargarCafeteriaClickada(listaCafeterias, nombreCafeteria);
      storeCafeteria(nombreCafeteria);
  };
  request.send();
}

function clickEvento(nombreCafeteria, nombreEvento) {
  // Hacemos el request del JSON
  const request = new XMLHttpRequest();
  request.open("GET", "/assets/JSON/cafeterias.json");
  request.responseType = 'text';

  request.onload = () => {
      // Convertimos el JSON a objetos JS
      const objeto = JSON.parse(request.response);
      var listaCafeterias = objeto.itemListElement;
      cargarEventoClickado(listaCafeterias, nombreCafeteria, nombreEvento);
      storeEvento(nombreCafeteria, nombreEvento);
  };
  request.send();
}

var tipoFiltro = 'Cafeterias';
function cargarBuscador(nombre, bool) {
  // Hacemos el request del JSON
  const request = new XMLHttpRequest();
  request.open("GET", "/assets/JSON/cafeterias.json");
  request.responseType = 'text';

  request.onload = () => {
      // Convertimos el JSON a objetos JS
      const objeto = JSON.parse(request.response);
      var listaCafeterias = objeto.itemListElement;
      if (nombre === 'Cafeterias') {
        let filtros = filtrosSeleccionadosCaf();
        tipoFiltro = 'Cafeterias';
        cargarBusquedaCafe(listaCafeterias, filtros, bool);
      } else {
        let filtros = filtrosSeleccionadosEv();
        tipoFiltro = 'Eventos';
        cargarBusquedaEvent(listaCafeterias, filtros, bool);
      }
  };
  request.send();
}

function cargarCafeteriasPorValoracion(listaCafeterias) {
  const nombresCafeterias = [];

  // Ordenamos por valoración
  listaCafeterias = ordenarLista(listaCafeterias, "aggregateRating.ratingValue", "descendente");
  const cafeteriasRating = document.getElementById("cafeterias-rating");

  var pagina = ''; // Construimos la sección en este mensaje

  for (let i = 0; i < 3; i++) { // Recorremos las tres cafeterías con mejor valoración

    addElementoJSONLD(listaCafeterias[i]);

    // Obtenemos los valores de la cafetería del archivo JSON
    const nombre = listaCafeterias[i].name;
    nombresCafeterias.push(nombre);
    const valoracion = listaCafeterias[i].aggregateRating.ratingValue;
    const ubicacion = listaCafeterias[i].address.streetAddress;
    const imagen = listaCafeterias[i].image[0].url;
    const estado = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);

    // Generamos el html del estado
    var abierto_cerrado = "";
    if (estado === "Abierto") {
        abierto_cerrado = '        <p class="abierto">Abierto</p>';
    } else if (estado === "Cerrado") {
        abierto_cerrado = '        <p class="cerrado">Cerrado</p>';
    }

    // Generamos el html de la valoración
    var estrellas = '<p>';
    const numEstrellas = 5;
    for (let i = 1; i <= numEstrellas; i++) {
        if (i <= valoracion) { estrellas += '<span class="fa-solid fa-star"></span>'; }
        else if (i === Math.ceil(valoracion) && valoracion % 1 !== 0) { estrellas += '<span class="fa-solid fa-star-half-stroke"></span>'; }
        else { estrellas += '<span class="fa-regular fa-star"></span>'; }
    }
    estrellas += '</p>';

    pagina += '<div class="media" onclick="cargarContenido(\'cafeteria.html\', \'' + nombre.replace(/'/g, "\\'") + '\', null)">';
    pagina += '  <div class="media-body row">';
    pagina += '    <div class="media-image col-md-4">';
    pagina += '      <img src="' + imagen + '" class="mr-3" alt="Imagen de la cafetería "' + i + ' loading="lazy">';
    pagina += '    </div>';
    pagina += '    <div class="col-md-4 media-nombre d-flex align-items-center">';
    pagina += '      <h3>' + nombre + '</h3>';
    pagina += '    </div>';
    pagina += '    <div class="col-md-4 d-flex align-items-center div-filas">';
    pagina += abierto_cerrado;
    pagina += estrellas;
    pagina += '      <div class="info">';
    pagina += '        <i class="fa-solid fa-location-dot fa-lg"></i>';
    pagina += '        <p>' + ubicacion + '</p>';
    pagina += '      </div>';
    pagina += '    </div>';
    pagina += '  </div>'
    pagina += '</div>';
  }

  cafeteriasRating.innerHTML = pagina;
}

async function cargarCafeteriasPorCercania(listaCafeterias) {

  await obtenerDistanciasCafeterias(listaCafeterias); // Calculamos las distancias a todas las cafeterías

  // Ordenamos por distancia
  listaCafeterias = ordenarLista(listaCafeterias, "distancia", "ascendente");
  obtenerDistanciasCafeterias(listaCafeterias);
  const cafeteriasRating = document.getElementById("cafeterias-cercanas");
  var pagina = ''; // Construimos la sección en este mensaje

  for (let i = 0; i < 3; i++) { // Recorremos las tres cafeterías con mejor valoración
      
    addElementoJSONLD(listaCafeterias[i]);
    
    const estado = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);
    const nombre = listaCafeterias[i].name;
    const ubicacion = listaCafeterias[i].address.streetAddress;
    const imagen = listaCafeterias[i].image[0].url;
    // Generamos el html del estado
    var abierto_cerrado = "";
    if (estado === "Abierto") {
        abierto_cerrado = '        <p class="abierto">Abierto</p>';
    } else if (estado === "Cerrado") {
        abierto_cerrado = '        <p class="cerrado">Cerrado</p>';
    }

    pagina += '<div class="media" onclick="cargarContenido(\'cafeteria.html\', \'' + nombre.replace(/'/g, "\\'") + '\', null)">';
    pagina += '  <div class="media-body row">';
    pagina += '    <div class="col-md-4 d-flex align-items-center div-filas">'
    pagina += abierto_cerrado;
    pagina += '      <div class="info">';
    pagina += '        <i class="fa-solid fa-route fa-lg"></i>';
    pagina += '        <p>' + (listaCafeterias[i].distancia / 1000).toFixed(2) + ' Km</p>';
    pagina += '      </div>';
    pagina += '      <div class="info">';
    pagina += '        <i class="fa-solid fa-location-dot fa-lg"></i>';
    pagina += '        <p>' + ubicacion + '</p>';
    pagina += '      </div>';
    pagina += '    </div>';
    pagina += '    <div class="col-md-4 media-nombre d-flex align-items-center">';
    pagina += '      <h3>' + nombre + '</h3>'
    pagina += '    </div>';
    pagina += '    <div class="media-image col-md-4">';
    pagina += '      <img src="' + imagen + '" class="mr-3" alt="Imagen de la cafetería "' + i + ' loading="lazy">';
    pagina += '    </div>'
    pagina += '  </div>'
    pagina += '</div>';
  }

  cafeteriasRating.innerHTML = pagina;
}

function cargarEventos(listaCafeterias) {

  var listaEventos = obtenerListaEventos(listaCafeterias);

  // Ordenamos por valoración
  listaEventos = ordenarLista(listaEventos, "startDate", "ascendente");
  
  const upcomingEvents = document.getElementById("upcoming-events");
  var pagina = '';

  for (let i = 0; i < 4; i++) { // Mostramos los 4 eventos más próximos en el tiempo
      
    addElementoJSONLD(listaEventos[i]);
    
    // Obtenemos los valores del evento del archivo JSON
    const nombre = listaEventos[i].name;
    const lugar = listaEventos[i].place;
    const fechaInicioEvento = new Date(listaEventos[i].startDate);
    const fecha = fechaInicioEvento.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC'
    });

    if (i == 0) {
      pagina += '<div class="icon-box mt-5 mt-lg-0 aos-init aos-animate" data-aos="zoom-in" data-aos-delay="150">';
    }
    else {
      pagina += '<div class="icon-box mt-5 aos-init aos-animate" data-aos="zoom-in" data-aos-delay="150">';
    }

    pagina += '  <div class="event-body" onclick="cargarContenido(\'evento.html\', \'' + listaEventos[i].place.replace(/'/g, "\\'") + '\', \'' + listaEventos[i].name.replace(/'/g, "\\'") + '\')">';
    pagina += '    <i class="fa-solid fa-chevron-right chevron"></i>';
    pagina += '    <h3>' + nombre + '</h3>';
    pagina += '    <div class="div-filas">';
    pagina += '      <div class="info">';
    pagina += '        <i class="fa-solid fa-location-dot fa-lg"></i>' + lugar;
    pagina += '      </div>';
    pagina += '      <div class="info">';
    pagina += '        <i class="fa-solid fa-calendar fa-lg"></i>' + fecha;
    pagina += '      </div>';
    pagina += '    </div>';
    pagina += '  </div>';
    pagina += '</div>';
  }

  upcomingEvents.innerHTML = pagina;
}

function cargarRecientes() {
  var recent = document.getElementById("recent");
  
  const listaEventosJSON = localStorage.getItem('Eventos Visitados');
  var listaEventos = JSON.parse(listaEventosJSON);
  if (listaEventos != null) { listaEventos.reverse(); }

  const listaCafeteriasJSON = localStorage.getItem('Cafeterias Visitadas');
  var listaCafeterias = JSON.parse(listaCafeteriasJSON);
  if (listaCafeterias != null) { listaCafeterias.reverse(); }

  if (listaCafeterias === null && listaEventos === null) {
    return;
  }

  addListaJSONLD(listaCafeterias);
  addListaJSONLD(listaEventos);

  var pagina = '';
  pagina += '<div class="container" data-aos="fade-up">';
  pagina += '<div class="section-title">';
  pagina += '<h2>Recently</h2>';
  pagina += '<p>visitado recientemente</p>';
  pagina += '</div>';
  pagina += '<div class="row">';
  pagina += '<div id="recent-carousels" class="carousel slide">';

  pagina += '<div class="row">';
  if (listaCafeterias != null) {
    pagina += '  <div class="col-6"><h2>Cafeterías</h2></div>';
  }
  if (listaEventos != null) {
    pagina += '  <div class="col-6"><h2>Eventos</h2></div>';
  }
  pagina += '</div>';

  pagina += '<div class="row">';
  // Carousel de Cafeterías
  if (listaCafeterias != null) {
    pagina += '  <div id="carouselCafeteriaReciente" class="carousel slide col-6" data-ride="carousel" data-aos="zoom-in" data-aos-delay="100">';
    var indicatorsCafeteria = '<div class="carousel-indicators">';
    var itemsCafeteria = '<div class="carousel-inner">';
    for (var i = 0; i < listaCafeterias.length && i < 5; i++) {
      if (i == 0) {
        indicatorsCafeteria += '<button type="button" data-bs-target="#carouselCafeteriaReciente" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';

        itemsCafeteria += '<div class="carousel-item active" onclick="cargarContenido(\'cafeteria.html\', \'' + listaCafeterias[i].name.replace(/'/g, "\\'") + '\', null)">';
        itemsCafeteria += '  <img src="' + listaCafeterias[i].image[0].url + '" class="d-block w-100 h-100" alt="' + listaCafeterias[i].image[0].name + '" loading="lazy">';
        itemsCafeteria += '  <div class="carousel-caption d-none d-md-block">';
        itemsCafeteria += '    <h3>' + listaCafeterias[i].name + '</h3>';
        itemsCafeteria += '    <p>' + listaCafeterias[i].address.streetAddress + '</p>';  
        itemsCafeteria += '  </div>';
        itemsCafeteria += '</div>';
      } else {
        indicatorsCafeteria += '<button type="button" data-bs-target="#carouselCafeteriaReciente" data-bs-slide-to="' + i + '" aria-label="Slide ' + i + '"></button>';

        itemsCafeteria += '<div class="carousel-item" onclick="cargarContenido(\'cafeteria.html\', \'' + listaCafeterias[i].name.replace(/'/g, "\\'") + '\', null)">';
        itemsCafeteria += '  <img src="' + listaCafeterias[i].image[0].url + '" class="d-block w-100 h-100" alt="' + listaCafeterias[i].image[0].name + '" loading="lazy">';
        itemsCafeteria += '  <div class="carousel-caption d-none d-md-block">';
        itemsCafeteria += '    <h3>' + listaCafeterias[i].name + '</h3>';
        itemsCafeteria += '    <p>' + listaCafeterias[i].address.streetAddress + '</p>';  
        itemsCafeteria += '  </div>';
        itemsCafeteria += '</div>';
      }
    }
    pagina += indicatorsCafeteria + '</div>';
    pagina += itemsCafeteria + '</div>';
    pagina += '      <button class="carousel-control-prev" type="button" data-bs-target="#carouselCafeteriaReciente" data-bs-slide="prev">';
    pagina += '        <span class="carousel-control-prev-icon" aria-hidden="true"></span>';
    pagina += '        <span class="visually-hidden">Previous</span>';
    pagina += '      </button>';
    pagina += '      <button class="carousel-control-next" type="button" data-bs-target="#carouselCafeteriaReciente" data-bs-slide="next">';
    pagina += '        <span class="carousel-control-next-icon" aria-hidden="true"></span>';
    pagina += '        <span class="visually-hidden">Next</span>';
    pagina += '      </button>';
    pagina += '    </div>';
  }
  
  // Carousel de Eventos
  if (listaEventos != null) {
    pagina += '  <div id="carouselEventoReciente" class="carousel slide col-6" data-ride="carousel" data-aos="zoom-in" data-aos-delay="100">';
    var indicatorsEvento = '<div class="carousel-indicators">';
    var itemsEvento = '<div class="carousel-inner">';
    for (var i = 0; i < listaEventos.length && i < 5; i++) {
      if (i == 0) {
        indicatorsEvento += '<button type="button" data-bs-target="#carouselEventoReciente" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';

        itemsEvento += '<div class="carousel-item active" onclick="cargarContenido(\'evento.html\', \'' + listaEventos[i].place.replace(/'/g, "\\'") + '\', \'' + listaEventos[i].name.replace(/'/g, "\\'") + '\')">';
        itemsEvento += '  <img src="' + listaEventos[i].image[0].url + '" class="d-block w-100 h-100" alt="' + listaEventos[i].image[0].name + '" loading="lazy">';
        itemsEvento += '  <div class="carousel-caption d-none d-md-block">';
        itemsEvento += '    <h3>' + listaEventos[i].name + '</h3>';
        itemsEvento += '    <p>' + listaEventos[i].place + '</p>';
        itemsEvento += '  </div>';
        itemsEvento += '</div>';
      } else {
        indicatorsEvento += '<button type="button" data-bs-target="#carouselEventoReciente" data-bs-slide-to="' + i + '" aria-label="Slide ' + i + '"></button>';

        itemsEvento += '<div class="carousel-item" onclick="cargarContenido(\'evento.html\', \'' + listaEventos[i].place.replace(/'/g, "\\'") + '\', \'' + listaEventos[i].name.replace(/'/g, "\\'") + '\')">';
        itemsEvento += '  <img src="' + listaEventos[i].image[0].url + '" class="d-block w-100 h-100" alt="' + listaEventos[i].image[0].name + '" loading="lazy">';
        itemsEvento += '  <div class="carousel-caption d-none d-md-block">';
        itemsEvento += '    <h3>' + listaEventos[i].name + '</h3>';
        itemsEvento += '    <p>' + listaEventos[i].place + '</p>';  
        itemsEvento += '  </div>';
        itemsEvento += '</div>';
      }
    }
    pagina += indicatorsEvento + '</div>';
    pagina += itemsEvento + '</div>';
    pagina += '      <button class="carousel-control-prev" type="button" data-bs-target="#carouselEventoReciente" data-bs-slide="prev">';
    pagina += '        <span class="carousel-control-prev-icon" aria-hidden="true"></span>';
    pagina += '        <span class="visually-hidden">Previous</span>';
    pagina += '      </button>';
    pagina += '      <button class="carousel-control-next" type="button" data-bs-target="#carouselEventoReciente" data-bs-slide="next">';
    pagina += '        <span class="carousel-control-next-icon" aria-hidden="true"></span>';
    pagina += '        <span class="visually-hidden">Next</span>';
    pagina += '      </button>';
    pagina += '    </div>';
    pagina += '  </div>';
  }
  pagina += '</div>';
  pagina += '</div>';
  pagina += '</div>';
  pagina += '</div>';
  
  recent.innerHTML = pagina;
}

function cargarCafeteriaClickada(listaCafeterias, nombreCafeteria) {
  // Seleccionamos el elemento HTML donde se agregarán las cafeterías
  var cafeteriaSelect = document.getElementById("cafeterias-sel");
  let cafeteriaEncontrada = null;
  
  //Buscamos la cafeteria que ha sido seleccionada
  for (var i = 0; i < listaCafeterias.length; i++) {
    //Una vez encontrada la guardamos en la variable declarada anteriormente
    if (listaCafeterias[i].name === nombreCafeteria) {
      cafeteriaEncontrada = listaCafeterias[i];
      break;
    }
  }

  addElementoJSONLD(cafeteriaEncontrada);

  var pagina = '<div class="row first-row">';
  pagina += '  <div class="col-lg-6" data-aos="zoom-in" data-aos-delay="100">';
  pagina += '    <div class="section-title">';
  pagina += '      <h2>Cafetería</h2>';
  pagina += '      <p>' + cafeteriaEncontrada.name + '</p>';
  pagina += '    </div>';
  pagina += '    <div>';
  pagina += '      <h4>Conócenos <i class="fa-solid fa-clipboard-list"></i></h4>';
  pagina += '      <p>' + cafeteriaEncontrada.description + '</p>';
  pagina += '    </div>';
  pagina += '    <div class="rating">';
  pagina += '      <h4>Rating';
  const numEstrellas = 5;
  const valoracion = cafeteriaEncontrada.aggregateRating.ratingValue;
  for (let i = 1; i <= numEstrellas; i++) {

    // Si la posición actual es menor o igual al valor de "rating", agregamos la clase "fa-solid" para marcar la estrella como "checked"
    if (i <= valoracion) {
      pagina += '<span class="fa-solid fa-star"> </span>';
    }
    // Si la posición actual es igual al valor de "valoracion" + 0.5, agregamos la clase "fa-solid fa-star-half-stroke" para mostrar una estrella parcialmente llena
    else if (i === Math.ceil(valoracion) && valoracion % 1 !== 0) {
      pagina += '<span class="fa-solid fa-star-half-stroke"> </span>';
    }
    else { // Si no, agregamos la clase "fa-regular fa-star" para mostrar una estrella vacía
      pagina += '<span class="fa-regular fa-star"> </span>';
    }
  }
  pagina += '      </h4>';
  pagina += '    </div>';
  pagina += '    <div data-aos="zoom-in" data-aos-delay="100">';
  pagina += '      <h4>Horario <i class="fa-solid fa-clock"></i></h4>';
  pagina += '      <p>' + traducirHorarioApertura(cafeteriaEncontrada.openingHours) + '</p>';
  pagina += '    </div>';
  pagina += '    <div data-aos="zoom-in" data-aos-delay="100">';
  pagina += '      <h4>Ubicación <i class="fa-solid fa-location-dot"></i></h4>';
  pagina += '      <p>' + cafeteriaEncontrada.address.streetAddress + '</p>';
  pagina += '    </div>';
  pagina += '    <div>';
  pagina += '      <h4>Rango de precios <i class="fa-solid fa-hand-holding-dollar"></i></h4>';
  pagina += '      <div class="price-range">';
  for (let i = 0; i < cafeteriaEncontrada.priceRange.length; i++) {
    pagina += '      <i class="fa-solid fa-euro-sign fa-lg"></i>';
  }
  pagina += '      </div>';
  pagina += '    </div>';
  pagina += '    <div>';
  pagina += '      <h4> Contacto <i class="fa-solid fa-at"></i></h4>';
  pagina += '      <p>';
  pagina += '        <a href=tel:"' + cafeteriaEncontrada.contactPoint.telephone + '"><i class="fa-solid fa-phone"></i>' + cafeteriaEncontrada.contactPoint.telephone + '</a><br>';
  pagina += '        <a href=mailto:"' + cafeteriaEncontrada.contactPoint.email + '"><i class="fa-solid fa-envelope"></i>' + cafeteriaEncontrada.contactPoint.email + '</a><br>';
  pagina += '        <a Target="_blank" href="' + cafeteriaEncontrada.url + '"><i class="fa-solid fa-link"></i>' + cafeteriaEncontrada.url + '</a>';
  pagina += '      </p>';
  pagina += '    </div>';
  pagina += '  </div>';

  // CAROUSEL DE IMAGENES DE LA CAFETERÍA
  pagina += '  <div id="carouselCafeteria" class="carousel slide col-lg-6" data-ride="carousel" data-aos="zoom-in" data-aos-delay="100">';
  var indicators = '<div class="carousel-indicators">';
  var items = '<div class="carousel-inner">';
  const imagenes = cafeteriaEncontrada.image;
  for (var i = 0; i < imagenes.length; i++) {
    if (i == 0) {
      indicators += '<button type="button" data-bs-target="#carouselCafeteria" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';

      items += '<div class="carousel-item active">';
      items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '" loading="lazy">';
      items += '</div>';
    } else {
      indicators += '<button type="button" data-bs-target="#carouselCafeteria" data-bs-slide-to="' + i + '" aria-label="Slide ' + i + '"></button>';

      items += '<div class="carousel-item">';
      items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '" loading="lazy">';
      items += '</div>';
    }
  }
  pagina += indicators + '</div>';
  pagina += items + '</div>';
  pagina += '    <button class="carousel-control-prev" type="button" data-bs-target="#carouselCafeteria" data-bs-slide="prev">';
  pagina += '      <span class="carousel-control-prev-icon" aria-hidden="true"></span>';
  pagina += '      <span class="visually-hidden">Previous</span>';
  pagina += '    </button>';
  pagina += '    <button class="carousel-control-next" type="button" data-bs-target="#carouselCafeteria" data-bs-slide="next">';
  pagina += '      <span class="carousel-control-next-icon" aria-hidden="true"></span>';
  pagina += '      <span class="visually-hidden">Next</span>';
  pagina += '    </button>';
  pagina += '  </div>';
  pagina += '</div>';

  // API DE GOOGLE MAPS
  const latitud = cafeteriaEncontrada.geo.latitude;
  const longitud = cafeteriaEncontrada.geo.longitude;
  const urlUb = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyDEttTnyKUn1uAIIjfqoOQoTJqbAncMym0&center=' + latitud + ',' + longitud + '&zoom=18';
  pagina += '<div class="row" data-aos="zoom-in" data-aos-delay="100">';
  pagina += '  <iframe src="' + urlUb + '" frameborder="0" allowfullscreen></iframe>';
  pagina += '</div>';

  // LISTA DE EVENTOS
  const fechaActual = new Date();
  if (cafeteriaEncontrada.events.length > 0) {
    pagina += '<div class="section-title margin-top-50">';
    pagina += '  <h2>Eventos</h2>';
    pagina += '  <p>Próximos eventos en esta cafetería</p>';
    pagina += '</div>';
    pagina += '<div class="row cafeteria-events" data-aos="zoom-in" data-aos-delay="100">';
    for (let i = 0; i < cafeteriaEncontrada.events.length; i++) {

      addElementoJSONLD(cafeteriaEncontrada.events[i]);

      const fechaInicioEvento = new Date(cafeteriaEncontrada.events[i].startDate);
      if (fechaActual > fechaInicioEvento) continue; // Saltamos el evento si ya ha sucedido

      const fecha = fechaInicioEvento.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
      });

      pagina += '  <div class="evento col-lg-4 col-md-6 d-flex align-items-stretch"';
      pagina += '                   onclick="cargarContenido(\'evento.html\', \'' + nombreCafeteria.replace(/'/g, "\\'") + '\', \'' + cafeteriaEncontrada.events[i].name.replace(/'/g, "\\'") + '\')">';
      pagina += '    <a class="cafeteria-event">';
      pagina += '      <h4>' + cafeteriaEncontrada.events[i].name + '</h4>';
      pagina += '      <h4>' + fecha + '</h4>';
      pagina += '      <p>' + cafeteriaEncontrada.events[i].about + '</p>';
      pagina += '    </a>';
      pagina += '  </div>';

    }
    pagina += '</div>';
  }

  cafeteriaSelect.innerHTML = pagina;
}

function cargarEventoClickado(listaCafeterias, nombreCafeteria, nombreEvento) {
  // Seleccionamos el elemento HTML donde se agregarán las cafeterías
  var eventoSelect = document.getElementById("evento-sel");

  let eventoEncontrado = null;  // Evento clicado
  let cafeteria = null;         // Cafetería donde tiene lugar el evento clicado
  let cafeteriasDelEvento = []; // Lista de cafeterías donde está programado el evento

  //Buscamos el evento que ha sido seleccionado y las cafeterías donde sucede
  for (var i = 0; i < listaCafeterias.length; i++) {

    if (nombreCafeteria === listaCafeterias[i].name) cafeteria = listaCafeterias[i];

    for (var j = 0; j < listaCafeterias[i].events.length; j++) {
      if (listaCafeterias[i].events[j].name === nombreEvento) {
        if (eventoEncontrado == null) eventoEncontrado = listaCafeterias[i].events[j]; // Guardamos el evento una sola vez
        var registrado = false;
        for (var k = 0; k < cafeteriasDelEvento.length; k++) {
          if (listaCafeterias[i].name === cafeteriasDelEvento[k].name) registrado = true;
        }
        if (!registrado) cafeteriasDelEvento.push(listaCafeterias[i]); // Guardamos todas las cafeterías donde aparece el evento
      }
    }
  }

  addElementoJSONLD(eventoEncontrado);
  addListaJSONLD(cafeteriasDelEvento);

  var fechaInicioEvento = new Date(eventoEncontrado.startDate);
  fechaInicioEvento = fechaInicioEvento.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });

  var fechaFinEvento = new Date(eventoEncontrado.endDate);
  fechaFinEvento = fechaFinEvento.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });

  var pagina = '<div class="row first-row">';
  pagina += '  <div class="col-lg-6" data-aos="fade-right" data-aos-delay="100">';
  pagina += '    <div class="section-title">';
  pagina += '      <h2>Evento</h2>';
  pagina += '      <p>' + eventoEncontrado.name + '</p>';
  pagina += '    </div>';
  pagina += '    <div>';
  pagina += '      <h4>Info<i class="fa-solid fa-circle-info"></i></h4>';
  pagina += '      <p>' + eventoEncontrado.about + '</p>';
  pagina += '    </div>';
  pagina += '    <div>';
  pagina += '      <h4>Audiencia<i class="fa-solid fa-address-card"></i></h4>';
  pagina += '      <p>' + eventoEncontrado.audience + '</p>';
  pagina += '    </div>';
  pagina += '    <div>';
  pagina += '      <h4>Horario <i class="fa-solid fa-clock"></i></h4>';
  pagina += '      <div class="row horario">';
  pagina += '        <div class="col-4">Inicio<br>' + fechaInicioEvento + '</div>';
  pagina += '        <div class="col-4">Fin<br>' + fechaFinEvento + '</div>';
  pagina += '      </div>';
  pagina += '    </div>';
  pagina += '    <div>';
  pagina += '      <h4>Precio de la entrada<i class="fa-solid fa-hand-holding-dollar"></i></h4>';
  if (eventoEncontrado.isAccessibleForFree) { pagina += '      <p>Gratuita</p>'; }
  else { pagina += '      <p>' + eventoEncontrado.offers.price + getCurrencySymbol(eventoEncontrado.offers.priceCurrency) + '</p>' }
  pagina += '    </div>';

  if (eventoEncontrado.performers.length > 0) {
    pagina += '    <div class="performers">';
    pagina += '      <h4>Performers<i class="fa-solid fa-masks-theater"></i></h4>';
    for (let i = 0; i < eventoEncontrado.performers.length; i++) {
        pagina += '      <a Target="_blank" href="' + eventoEncontrado.performers[i].url + '">';
        pagina += '        <i class="fa-solid fa-chevron-right"></i>';
        pagina += eventoEncontrado.performers[i].name;
        pagina += '      </a>';
    }
    pagina += '    </div>';
  }

  pagina += '    <div>';
  pagina += '      <h4>Aforo<i class="fa-solid fa-users"></i></h4>';
  pagina += '      <p>' + eventoEncontrado.maximumPhysicalAttendeeCapacity + ' personas </p>';
  pagina += '    </div>';
  pagina += '    <div class="ubicacion">';
  pagina += '      <h4>Ubicación <i class="fa-solid fa-location-dot"></i></h4>';
  pagina += '      <h6 style="font-weight: bold" onclick="cargarContenido(\'cafeteria.html\', \'' + nombreCafeteria.replace(/'/g, "\\'") + '\', null)">' + nombreCafeteria.replace(/'/g, "\\'") + '</h6>';
  pagina += '      <p>' + cafeteria.address.streetAddress + '</p>';
  pagina += '    </div>';
  pagina += '  </div>';

  // CAROUSEL DE IMAGENES DE LA CAFETERÍA
  pagina += '  <div id="carouselEvento" class="carousel slide col-lg-6" data-ride="carousel" data-aos="fade-left" data-aos-delay="100">';
  var indicators = '<div class="carousel-indicators">';
  var items = '<div class="carousel-inner">';
  const imagenes = eventoEncontrado.image;
  for (var i = 0; i < imagenes.length; i++) {
    if (i == 0) {
        indicators += '<button type="button" data-bs-target="#carouselEvento" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';

        items += '<div class="carousel-item active">';
        items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '" loading="lazy">';
        items += '</div>';
    } else {
        indicators += '<button type="button" data-bs-target="#carouselEvento" data-bs-slide-to="' + i + '" aria-label="Slide ' + i + '"></button>';

        items += '<div class="carousel-item">';
        items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '" loading="lazy">';
        items += '</div>';
    }
  }
  pagina += indicators + '</div>';
  pagina += items + '</div>';
  pagina += '    <button class="carousel-control-prev" type="button" data-bs-target="#carouselEvento" data-bs-slide="prev">';
  pagina += '      <span class="carousel-control-prev-icon" aria-hidden="true"></span>';
  pagina += '      <span class="visually-hidden">Previous</span>';
  pagina += '    </button>';
  pagina += '    <button class="carousel-control-next" type="button" data-bs-target="#carouselEvento" data-bs-slide="next">';
  pagina += '      <span class="carousel-control-next-icon" aria-hidden="true"></span>';
  pagina += '      <span class="visually-hidden">Next</span>';
  pagina += '    </button>';
  pagina += '  </div>';
  pagina += '</div>';

  const latitud = cafeteria.geo.latitude;
  const longitud = cafeteria.geo.longitude;
  const urlUb = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyDEttTnyKUn1uAIIjfqoOQoTJqbAncMym0&center=' + latitud + ',' + longitud + '&zoom=18';
  pagina += '<div class="row" data-aos="fade-up" data-aos-delay="100">';
  pagina += '  <iframe src="' + urlUb + '" frameborder="0" allowfullscreen></iframe>';
  pagina += '</div>';

  // Si hay al menos una cafetería más a parte de esta, las mostramos en lista
  if (cafeteriasDelEvento.length > 1) {
    pagina += '<div class="section-title margin-top-50">';
    pagina += '  <h2>Alternativas</h2>';
    pagina += '  <p>Otras cafeterías donde está programado el evento</p>';
    pagina += '</div>';
    pagina += '<div class="row" data-aos="zoom-in" data-aos-delay="100">';

    for (let i = 0; i < cafeteriasDelEvento.length; i++) {

      // No mostramos la propia cafetería del evento
      if (cafeteriasDelEvento[i].name === nombreCafeteria) continue;

      // Obtenemos los valores de la cafetería del archivo JSON
      const nombre = cafeteriasDelEvento[i].name;
      const valoracion = cafeteriasDelEvento[i].aggregateRating.ratingValue;
      const ubicacion = cafeteriasDelEvento[i].address.streetAddress;
      const imagen = cafeteriasDelEvento[i].image[0].url;
      const estado = comprobarEstadoDeNegocio(cafeteriasDelEvento[i].openingHours);

      // Generamos el html del estado
      var abierto_cerrado = "";
      if (estado === "Abierto") {
          abierto_cerrado = '        <p class="abierto">Abierto</p>';
      } else if (estado === "Cerrado") {
          abierto_cerrado = '        <p class="cerrado">Cerrado</p>';
      }

      // Generamos el html de la valoración
      var estrellas = '<p>';
      const numEstrellas = 5;
      for (let i = 1; i <= numEstrellas; i++) {
          if (i <= valoracion) { estrellas += '<span class="fa-solid fa-star"></span>'; }
          else if (i === Math.ceil(valoracion) && valoracion % 1 !== 0) { estrellas += '<span class="fa-solid fa-star-half-stroke"></span>'; }
          else { estrellas += '<span class="fa-regular fa-star"></span>'; }
      }
      estrellas += '</p>';

      pagina += '<div class="media" onclick="cargarContenido(\'cafeteria.html\', \'' + nombre.replace(/'/g, "\\'") + '\', null)">';
      pagina += '  <div class="media-body row">';
      pagina += '    <div class="media-image col-md-4">';
      pagina += '      <img src="' + imagen + '" class="mr-3" alt="Imagen de la cafetería "' + i + '>';
      pagina += '    </div>';
      pagina += '    <div class="col-md-4 media-nombre d-flex align-items-center">';
      pagina += '      <h3>' + nombre + '</h3>';
      pagina += '    </div>';
      pagina += '    <div class="col-md-4 d-flex align-items-center div-filas">';
      pagina += abierto_cerrado;
      pagina += estrellas;
      pagina += '      <div class="info">';
      pagina += '        <i class="fa-solid fa-location-dot fa-lg"></i>';
      pagina += '        <p>' + ubicacion + '</p>';
      pagina += '      </div>';
      pagina += '    </div>';
      pagina += '  </div>'
      pagina += '</div>';
    }
    pagina += '</div>';
  }

  eventoSelect.innerHTML = pagina;
}

async function cargarBusquedaCafe(listaCafeterias, filtros, primeraVez) {
  
  vaciarJSONLD();

  // obtén el elemento input del slider
  await obtenerDistanciasCafeterias(listaCafeterias);
  var slider = document.getElementById("distancia");
  slider.max = getMaxDistance(listaCafeterias);
  var cafeteriaSelect = document.getElementById("busqueda-filtro");
  var pagina = '<div class="row">';
  if (primeraVez) {
      var filt = document.getElementById("sidebar");
      var filterS = '<div class="border-bottom pb-2 ml-2">' +
          '<h4 id="burgundy">Filtros</h4>' +
          '</div>' +
          '<div class="py-2 border-bottom ml-3">' +
          '<h6 class="font-weight-bold">Categorias</h6>' +
          '<form>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="Musica">' +
          '<label for="artisan">Música</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="Lectura">' +
          '<label for="breakfast">Lectura</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="Juegos de mesa">' +
          '<label for="healthy">Juegos de mesa</label>' +
          '</div>' +
          '</form>' +
          '</div>' +
          '<div class="py-2 border-bottom ml-3">' +
          '<h6 class="font-weight-bold">Precios</h6>' +
          '<form>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="$">' +
          '<label for="tea">€</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="$$">' +
          '<label for="cookies">€€</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="$$$">' +
          '<label for="pastries">€€€</label>' +
          '</div>' +
          '</form>' +
          '</div>' +
          '<div class="py-2 ml-3">' +
          '<h6 class="font-weight-bold">Valoración</h6>' +
          '<form>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="1">' +
          '<label for="25">1 estrella</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="2">' +
          '<label for="25">2 estrellas</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="3">' +
          '<label for="25">3 estrellas</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="4">' +
          '<label for="25">4 estrellas</label>' +
          '</div>' +
          '<div class="form-group">' +
          '<input type="checkbox" id="5">' +
          '<label for="25">5 estrellas</label>' +
          '</div>' +
          '</form>' +
          '</div>';
      filt.insertAdjacentHTML('afterbegin', filterS);
  }

  let resultados = 0;

  for (let i = 0; i < listaCafeterias.length; i++) {
    if (cumpleFiltrosCaf(listaCafeterias[i], filtros)) {

      addElementoJSONLD(listaCafeterias[i]);

      resultados++;

      let abierto = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);

      pagina += '<a class="media" href="#" onclick="cargarContenido(\'cafeteria.html\',\'' + listaCafeterias[i].name.replace(/'/g, "\\'") + '\')">';
      pagina += '<div class="media-body row">';
      pagina += '<div class="media-image col-md-4">';
      pagina += '<img src="' + listaCafeterias[i].image[0].url + '" class="mr-3" alt="' + listaCafeterias[i].image[0].name + '" loading="lazy">';
      pagina += '</div>';
      pagina += '<div class="col-md-4 media-nombre d-flex align-items-center">';
      pagina += '<h3>' + listaCafeterias[i].name + '</h3>';
      pagina += '</div>';
      pagina += '<div class="col-md-4 d-flex align-items-center div-filas">';
      pagina += '<p class="' + abierto.toLocaleLowerCase() + '">' + abierto + '</p>';
      pagina += '<p>';
      const numEstrellas = 5;
      const valoracion = listaCafeterias[i].aggregateRating.ratingValue;
      for (let i = 1; i <= numEstrellas; i++) {

          // Si la posición actual es menor o igual al valor de "rating", agregamos la clase "fa-solid" para marcar la estrella como "checked"
          if (i <= valoracion) {
              pagina += '<span class="fa-solid fa-star"> </span>';
          }
          // Si la posición actual es igual al valor de "valoracion" + 0.5, agregamos la clase "fa-solid fa-star-half-stroke" para mostrar una estrella parcialmente llena
          else if (i === Math.ceil(valoracion) && valoracion % 1 !== 0) {
              pagina += '<span class="fa-solid fa-star-half-stroke"> </span>';
          }
          else { // Si no, agregamos la clase "fa-regular fa-star" para mostrar una estrella vacía
              pagina += '<span class="fa-regular fa-star"> </span>';
          }
      }
      pagina += '</p>';
      pagina += '<div class="info">';
      pagina += '<i class="fa-solid fa-route fa-lg"></i>';
      pagina += '<p>' + (listaCafeterias[i].distancia / 1000).toFixed(2) + " Km" + '</p>'; // CAMBIAR X Km por la distancia
      pagina += '</div>';
      pagina += '<div class="info">';
      pagina += '<i class="fa-solid fa-location-dot fa-lg"></i>';
      pagina += '<p>' + listaCafeterias[i].address.streetAddress + '</p>';
      pagina += '</div>';
      pagina += '</div>';
      pagina += '</div>';
      pagina += '</a>';

    }
  }
  pagina += '</div>';

  document.getElementById("totalResultados").textContent = "Resultados encontrados: " + resultados

  cafeteriaSelect.innerHTML = pagina;
}

async function cargarBusquedaEvent(listaCafeterias, filtros, primeraVez) {
  
  vaciarJSONLD();
  
  var listaEventos = obtenerListaTotalEventos(listaCafeterias);
  await obtenerDistanciasCafeterias(listaCafeterias);
  var slider = document.getElementById("distancia");
  slider.max = getMaxDistance(listaCafeterias);
  if (primeraVez) {
    var filt = document.getElementById("sidebar");
    var filterS = '' +
        '<div class="border-bottom pb-2 ml-2">' +
        '  <h4 id="burgundy">Filtros</h4>' +
        '</div>' +
        '<div class="py-2 border-bottom ml-3">' +
        '  <h6 class="font-weight-bold">Coste</h6>' +
        '  <form>' +
        '    <div class="form-check">' +
        '      <input class="form-check-input" type="radio" name="flexRadioDefault" id="true" checked>' +
        '      <label class="form-check-label" for="true">' +
        '        Gratuito' +
        '      </label>' +
        '    </div>' +
        '    <div class="form-check">' +
        '      <input class="form-check-input" type="radio" name="flexRadioDefault" id="false">' +
        '      <label class="form-check-label" for="false">' +
        '        De pago' +
        '      </label>' +
        '    </div>' +
        '  </form>' +
        '</div>' +
        '<div class="py-2 border-bottom ml-3">' +
        '  <h6 class="font-weight-bold">Audiencia</h6>' +
        '  <form>' +
        '    <div class="form-check">' +
        '      <input class="form-check-input" type="radio" name="flexRadioDefault" id="Todas las edades" checked>' +
        '      <label class="form-check-label" for="Todas las edades">' +
        '        Todos los públicos' +
        '      </label>' +
        '    </div>' +
        '    <div class="form-check">' +
        '      <input class="form-check-input" type="radio" name="flexRadioDefault" id="16 años">' +
        '      <label class="form-check-label" for="16 años">' +
        '        +16' +
        '      </label>' +
        '    </div>' +
        '    <div class="form-check">' +
        '      <input class="form-check-input" type="radio" name="flexRadioDefault" id="18 años">' +
        '      <label class="form-check-label" for="18 años">' +
        '        +18' +
        '      </label>' +
        '    </div>' +
        '  </form>' +
        '</div>';
    filt.insertAdjacentHTML('afterbegin', filterS);
  }
  var cafeteriaSelect = document.getElementById("busqueda-filtro");
  var pagina = '<div class="row-filt-ev">';
  pagina += '<div id="past-events" class="col-12 aos-init aos-animate" data-aos="fade-left" data-aos-delay="100">';

  let resultados = 0;

  for (let i = listaEventos.length - 1; i >= 0; i--) {
    if (cumpleFiltrosEv(listaEventos[i], listaCafeterias[i], filtros)) {

      addElementoJSONLD(listaEventos[i]);

      //MOVER LINEA DENTRO DE CONDICIÓN DE FILTROS UNA VEZ IMPLEMENTADO
      resultados++;

      const fechaInicioEvento = new Date(listaEventos[i].startDate);
      const fecha = fechaInicioEvento.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
      });
      
      pagina += '<div class="icon-box mt-2 aos-init aos-animate" data-aos="zoom-in" data-aos-delay="150">';
      pagina += '  <div class="event-body-bus row" onclick="cargarContenido(\'evento.html\', \'' + listaEventos[i].place.replace(/'/g, "\\'") + '\', \'' + listaEventos[i].name.replace(/'/g, "\\'") + '\')">';
      pagina += '    <div class="col-md-4 align-self-center">';
      pagina += '      <i class="fa-solid fa-chevron-right chevron"></i>';
      pagina += '      <h3>' + listaEventos[i].name + '</h3>';
      pagina += '    </div>';
      pagina += '    <div class="div-filas col-md-4">';
      pagina += '      <div class="info">';
      pagina += '        <i class="fa-solid fa-location-dot fa-lg"></i>' + listaEventos[i].place;
      pagina += '      </div>';
      pagina += '      <div class="info">';
      pagina += '        <i class="fa-solid fa-calendar fa-lg"></i>' + fecha;
      pagina += '      </div>';
      pagina += '    </div>';
      pagina += '    <div class="media-image col-md-4">';
      pagina += '      <img src="' + listaEventos[i].image[0].url + '" class="mr-3" alt="' + listaEventos[i].image[0].name + '"' + i + ' loading="lazy">';
      pagina += '    </div>';
      pagina += '  </div>';
      pagina += '</div>';
    }
  }
  pagina += '</div></div>';

  document.getElementById("totalResultados").textContent = "Resultados encontrados: " + resultados

  cafeteriaSelect.innerHTML = pagina;
}  

function cargarContenidoMap() {
  cargarContenido("map.html", null, null);

  scriptHtml = document.getElementById("script-api")
  if (scriptHtml) {
    scriptHtml.remove();
  }

  var script = document.createElement('script');
  script.id = 'script-api';
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBaIKV0ipX-n7b_RwquptRgH70iszT3G5Y&map_ids=fcbac43d02c5a043&callback=initMap";
  script.async = true;
  window.initMap = initMap;

  document.head.appendChild(script);
}

/**
 * Elimina todas las etiquetas <script> del header (las de tipo JSON-LD).
 */
function vaciarJSONLD() {
  var headScripts = document.head.getElementsByTagName('script');

  for (var i = headScripts.length - 1; i >= 0; i--) {
    var script = headScripts[i];
    script.parentNode.removeChild(script);
  }
}

/**
 * Añade una etiqueta <script> de tipo json-ld al header con la información de un elemento.
 */
function addElementoJSONLD(elemento) {
  var el = document.createElement('script');
  el.type = 'application/ld+json';
  el.text = JSON.stringify(elemento);

  document.querySelector('head').appendChild(el);
}

/**
 * Añade múltiples etiquetas <script> de tipo json-ld al header con la información de una lista de elementos.
 */
function addListaJSONLD(lista) {
  if(lista === null) return;
  
  lista.map(item => {
    var el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify(item);

    document.querySelector('head').appendChild(el);
  })
  
}
