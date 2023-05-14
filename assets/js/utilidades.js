var tipoFiltro = 'Cafeterias';
function ordenarLista(lista, atributo, orden = "ascendente") {
    lista.sort((a, b) => {
        const aValor = obtenerValor(a, atributo);
        const bValor = obtenerValor(b, atributo);
        let comparacion = 0;
        if (aValor < bValor) {
            comparacion = -1;
        }
        if (aValor > bValor) {
            comparacion = 1;
        }
        return orden === "descendente" ? comparacion * -1 : comparacion;
    });
    return lista;
}

function obtenerValor(objeto, ruta) {
    const partes = ruta.split(".");
    let valor = objeto;
    for (const parte of partes) {
        if (!valor.hasOwnProperty(parte)) {
            return null;
        }
        valor = valor[parte];
    }
    return valor;
}

function getMaxDistance(listaCafeterias) {
    var max = 0;
    for (let i = 0; i < listaCafeterias.length; i++) {
        if (listaCafeterias[i].distancia == undefined) {
            return 50;
        }
        if (listaCafeterias[i].distancia > max) {
            max = listaCafeterias[i].distancia;
        }
    }
    return Math.ceil(max / 1000);
}

function comprobarEstadoDeNegocio(openingHours) {
    const hoy = new Date();
    const horaActual = hoy.getHours() + ":" + (hoy.getMinutes() < 10 ? "0" : "") + hoy.getMinutes();

    for (let i = 0; i < openingHours.length; i++) {
        const [dias, horario] = openingHours[i].split(" ");
        const diasArray = dias.split("-");
        const diaInicio = diasArray[0];
        const diaFin = diasArray[1] || diasArray[0];
        const [horaInicio, horaFin] = horario.split("-");

        if (comprobarSiEstaAbiertoEnEsteDia(diaInicio, diaFin) && comprobarSiEstaAbiertoEnEstaHora(horaInicio, horaFin, horaActual)) {
            return "Abierto";
        }
    }

    return "Cerrado";
}

function comprobarSiEstaAbiertoEnEsteDia(diaInicio, diaFin) {
    const diasSemana = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const hoy = new Date();
    const diaActual = diasSemana[hoy.getDay()];

    let diaInicioIndex = diasSemana.indexOf(diaInicio);
    let diaFinIndex = diasSemana.indexOf(diaFin);

    if (diaFinIndex < diaInicioIndex) {
        diaFinIndex += 7;
    }

    const diaActualIndex = diasSemana.indexOf(diaActual);

    return diaActualIndex >= diaInicioIndex && diaActualIndex <= diaFinIndex;
}

function storeCafeteria(nombre) {
    if (typeof Storage !== 'undefined') {
        let historialPrevio = localStorage.getItem('Cafeterias Visitadas');
        let historialNuevo = [];
        if (historialPrevio) {
            historialNuevo = JSON.parse(historialPrevio);
            if (historialNuevo.includes(nombre)) {
                historialNuevo.splice(historialNuevo.indexOf(nombre), 1);
            } else if (historialNuevo.length >= 5) {
                historialNuevo.shift();
            }
        }
        historialNuevo.push(nombre);
        localStorage.setItem('Cafeterias Visitadas', JSON.stringify(historialNuevo));
    } else {
        alert('Storage no es compatible con este navegador');
    }
}

function storeEvento(nombre) {
    // TODO;
}

function comprobarSiEstaAbiertoEnEstaHora(horaInicio, horaFin, horaActual) {
    const [horaInicioH, horaInicioM] = horaInicio.split(":");
    const [horaFinH, horaFinM] = horaFin.split(":");
    const [horaActualH, horaActualM] = horaActual.split(":");

    const horaInicioMs = (parseInt(horaInicioH) * 60 + parseInt(horaInicioM)) * 60 * 1000;
    var horaFinMs = (parseInt(horaFinH) * 60 + parseInt(horaFinM)) * 60 * 1000;
    const horaActualMs = (parseInt(horaActualH) * 60 + parseInt(horaActualM)) * 60 * 1000;

    if (horaFinMs < horaInicioMs) {
        horaFinMs += 24 * 60 * 60 * 1000;
    }

    return horaActualMs >= horaInicioMs && horaActualMs <= horaFinMs;
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
        cargarEventos(listaCafeterias)
    };
    request.send();
}

function cargarBuscador(nombre, bool) {
    console.log(nombre);
    // Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/cafeterias.json");
    request.responseType = 'text';

    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        var listaCafeterias = objeto.itemListElement;
        let filtros = filtrosSeleccionados();
        console.log(filtros);
        if (nombre === 'Cafeterias') {
            tipoFiltro = 'Cafeterias';
            cargarBusquedaCafe(listaCafeterias, filtros, bool);
        } else {
            tipoFiltro = 'Eventos';
            cargarBusquedaEvent(listaCafeterias, filtros, bool);
        }
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

function clickEvento(nombreCafetria, nombreEvento) {
    // Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/cafeterias.json");
    request.responseType = 'text';

    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        var listaCafeterias = objeto.itemListElement;
        cargarEventoClickado(listaCafeterias, nombreCafetria, nombreEvento);
        storeEvento(nombreEvento);
    };
    request.send();
}

function filtrosSeleccionados() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const ids = [];
    checkboxes.forEach(checkbox => ids.push(checkbox.id));

    const distancia = document.getElementById('distancia').value;
    const filtrosSeleccionados = ids;
    filtrosSeleccionados.push(distancia);

    return filtrosSeleccionados;
}

async function cargarBusquedaCafe(listaCafeterias, filtros, primeraVez) {
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
        if (cumpleFiltros(listaCafeterias[i], filtros)) {

            resultados++;

            let abierto = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);

            pagina += '<a class="media" href="#" onclick="cargarContenido(\'cafeteria.html\',\'' + listaCafeterias[i].name.replace(/'/g, "\\'") + '\')">';
            pagina += '<div class="media-body row">';
            pagina += '<div class="media-image col-md-4">';
            pagina += '<img src="' + listaCafeterias[i].image[0].url + '" class="mr-3" alt="' + listaCafeterias[i].image[0].name + '">';
            pagina += '</div>';
            pagina += '<div class="col-md-4 media-nombre d-flex align-items-center">';
            pagina += '<h4>' + listaCafeterias[i].name + '</h4>';
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

function cargarBusquedaEvent(listaCafeterias, primeraVez) {
    var listaEventos = obtenerListaTotalEventos(listaCafeterias);
    if (primeraVez) {
        var filt = document.getElementById("sidebar");
        var filterS = '<div class="border-bottom pb-2 ml-2">' +
            '<h4 id="burgundy">Filtros</h4>' +
            '</div>' +
            '<div class="py-2 border-bottom ml-3">' +
            '<h6 class="font-weight-bold">Coste</h6>' +
            '<form>' +
            '<div class="form-group">' +
            '<input type="checkbox" id="gratis">' +
            '<label for="artisan">gratuito</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<input type="checkbox" id="pago">' +
            '<label for="breakfast">De pago</label>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '<div class="py-2 border-bottom ml-3">' +
            '<h6 class="font-weight-bold">Audiencia</h6>' +
            '<form>' +
            '<div class="form-group">' +
            '<input type="checkbox" id="Todas las edades">' +
            '<label for="tea">ATP</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<input type="checkbox" id="16">' +
            '<label for="cookies">+16</label>' +
            '</div>' +
            '<div class="form-group">' +
            '<input type="checkbox" id="18">' +
            '<label for="pastries">+18</label>' +
            '</div>' +
            '</form>' +
            '</div>';
        filt.insertAdjacentHTML('afterbegin', filterS);
    }
    var cafeteriaSelect = document.getElementById("busqueda-filtro");
    var pagina = '<div class="row-filt-ev">';
    pagina += '<div id="past-events" class="col-lg-6 aos-init aos-animate" data-aos="fade-left" data-aos-delay="100">';

    let resultados = 0;

    for (let i = listaEventos.length - 1; i >= 0; i--) {

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
        pagina += '<div class="icon-box mt-5 mt-lg-0 aos-init aos-animate" data-aos="zoom-in" data-aos-delay="150">';
        pagina += '<div class="event-body-bus" onclick="cargarContenido(\'evento.html\', \'' + listaEventos[i].place.replace(/'/g, "\\'") + '\', \'' + listaEventos[i].name.replace(/'/g, "\\'") + '\')"><i class="fa-solid fa-chevron-right chevron"></i>';
        pagina += '<h4>' + listaEventos[i].name + '</h4>'
        pagina += '<p class="info">';
        pagina += '<div><i class="fa-solid fa-location-dot fa-lg"></i>' + listaEventos[i].place + '</div>';
        pagina += '<div><i class="fa-solid fa-calendar fa-lg"></i>' + fecha + '</div></p></div></div>';
    }
    pagina += '</div></div>';

    document.getElementById("totalResultados").textContent = "Resultados encontrados: " + resultados

    cafeteriaSelect.innerHTML = pagina;
}

function cargarBuscadorEvent() {
    var listaEventos = obtenerListaEventos(listaCafeterias);
    var cafeteriaSelect = document.getElementById("busqueda-filtro");
    var pagina = '<div class="row">';

    let resultados = 0;

    for (let i = 0; i < listaEventos.length; i++) {
        if (cumpleFiltros(listaEventos[i], filtros)) {

            resultados++;

            //let abierto = comprobarEstadoDeNegocio(listaEventos[i].openingHours);
            pagina += '<div class="icon-box mt-5 mt-lg-0 aos-init aos-animate" onclick="cargarContenido(\'evento.html\', \'' + listaEventos[i].place.replace(/'/g, "\\'") + '\', \'' + listaEventos[i].name.replace(/'/g, "\\'") + '\')" data-aos="zoom-in" data-aos-delay="150">';
            pagina += '<div class="event-body"><i class="fa-solid fa-chevron-right chevron">';
            pagina += '</i><h4>' + listaEventos[i].name + '</h4>'
            pagina += '<a class="media" href="#">';
            pagina += '<div class="media-body row">';
            pagina += '<div class="media-image col-md-4">';
            pagina += '<img src="' + listaCafeterias[i].image[0].url + '" class="mr-3" alt="' + listaCafeterias[i].image[0].name + '">';
            pagina += '</div>';
            pagina += '<div class="col-md-4 media-nombre d-flex align-items-center">';
            pagina += '<h4>' + listaEventos[i].name + '</h4>';
            pagina += '</div>';
            pagina += '<div class="col-md-4 d-flex align-items-center div-filas">';
            pagina += '<p>Valoración: ' + listaEventos[i].aggregateRating.ratingValue + '</p>';
            pagina += '<p>Ubicación:' + listaEventos[i].address.streetAddress + '</p>';
            pagina += '<p class="' + abierto.toLocaleLowerCase() + '">' + abierto + '</p>';
            pagina += '</div>';
            pagina += '</div>';
            pagina += '</a>';
        }
    }
    pagina += '</div>';

    document.getElementById("totalResultados").textContent = "Resultados encontrados: " + resultados

    cafeteriaSelect.innerHTML = pagina;
}

function cumpleFiltros(cafeteria, filtros) {
    if (filtros.length === 0) {
        return true;
    }
    let cafeteriaVal = [cafeteria.priceRange];
    let keywordsCaf = cafeteria.keywords;
    for (let i = 0; i < cafeteria.keywords.length; i++) {
        cafeteriaVal.concat(cafeteria.keywords[i]);
    }
    let cumple = false;
    for (let i = 0; i < filtros.length - 1; i++) {
        if (cafeteriaVal.includes(filtros[i]) || keywordsCaf.includes(filtros[i])) {
            cumple = true;
        }
    }
    console.log("Cafeteria ->" + (cafeteria.distancia / 1000).toFixed(2));
    console.log("Distancia slider ->" + filtros[filtros.length - 1]);
    console.log(filtros);
    if (filtros[filtros.length - 1] != 0) {
        if ((parseInt(cafeteria.distancia) / 1000).toFixed(2) <= parseInt(filtros[filtros.length - 1])) {
            cumple = true;
        }
    } else {
        if (filtros.length == 1) {
            cumple = true;
        }
    }
    if (filtros.length > 1) {
        console.log("Rating -> "+filtros[filtros.length - 2]);
        if (parseInt(cafeteria.aggregateRating.ratingValue) >= parseInt(filtros[filtros.length - 2])) {
            cumple = true;
        }
    }
    return cumple;
}

function cargarCafeteriaClickada(listaCafeterias, nombreCafeteria) {
    console.log("NOMBRE -> " + nombreCafeteria);
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
    pagina += '        <a href="' + cafeteriaEncontrada.url + '"><i class="fa-solid fa-link"></i>' + cafeteriaEncontrada.url + '</a>';
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
            items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '">';
            items += '</div>';
        } else {
            indicators += '<button type="button" data-bs-target="#carouselCafeteria" data-bs-slide-to="' + i + '" aria-label="Slide ' + i + '"></button>';

            items += '<div class="carousel-item">';
            items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '">';
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

    const latitud = cafeteriaEncontrada.geo.latitude;
    const longitud = cafeteriaEncontrada.geo.longitude;
    const urlUb = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyDEttTnyKUn1uAIIjfqoOQoTJqbAncMym0&center=' + latitud + ',' + longitud + '&zoom=18';
    pagina += '<div class="row" data-aos="zoom-in" data-aos-delay="100">';
    pagina += '  <iframe src="' + urlUb + '" frameborder="0" allowfullscreen></iframe>';
    pagina += '</div>';

    if (cafeteriaEncontrada.events.length > 0) {
        pagina += '<div class="section-title margin-top-50">';
        pagina += '  <h2>Eventos</h2>';
        pagina += '  <p>Próximos eventos en esta cafetería</p>';
        pagina += '</div>';
        pagina += '<div class="row cafeteria-events" data-aos="zoom-in" data-aos-delay="100">';
        for (let i = 0; i < cafeteriaEncontrada.events.length; i++) {

            pagina += '  <div class="evento col-lg-4 col-md-6 d-flex align-items-stretch"';
            pagina += '                   onclick="cargarContenido(\'evento.html\', \'' + nombreCafeteria.replace(/'/g, "\\'") + '\', \'' + cafeteriaEncontrada.events[i].name.replace(/'/g, "\\'") + '\')">';
            pagina += '    <a class="cafeteria-event">';

            const fechaInicioEvento = new Date(cafeteriaEncontrada.events[i].startDate);
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
    console.log("NOMBRE -> " + nombreEvento);
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
            pagina += '      <a href="' + eventoEncontrado.performers[i].url + '">';
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
            items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '">';
            items += '</div>';
        } else {
            indicators += '<button type="button" data-bs-target="#carouselEvento" data-bs-slide-to="' + i + '" aria-label="Slide ' + i + '"></button>';

            items += '<div class="carousel-item">';
            items += '  <img src="' + imagenes[i].url + '" class="d-block w-100 h-100" alt="' + imagenes[i].name + '">';
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
            pagina += '      <h4>' + nombre + '</h4>';
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

function traducirHorarioApertura(horario) {
    const diasSemana = {
        Su: "Domingo",
        Mo: "Lunes",
        Tu: "Martes",
        We: "Miércoles",
        Th: "Jueves",
        Fr: "Viernes",
        Sa: "Sábado"
    };

    let horarioAux = null;
    const horarioTraducido = [];

    horario.forEach((horarioDia, index) => {
        const diaHora = horarioDia.split(" ");
        const dias = diaHora[0].split("-");
        const hora = diaHora[1].split("-");

        const diaInicio = diasSemana[dias[0]];
        const diaFin = diasSemana[dias[1]];

        let horarioDiaTraducido = `${diaInicio}-${diaFin} -> ${hora[0]}-${hora[1]}`;

        if (diaInicio === "Sábado" && diaFin === "Jueves") {
            horarioAux = horarioDiaTraducido;
        } else {
            horarioTraducido.push(horarioDiaTraducido);
        }
    });

    if (horarioAux) {
        horarioTraducido.push(horarioAux);
    }

    return horarioTraducido.join("<br>");
}

function cargarCafeteriasPorValoracion(listaCafeterias) {
    const nombresCafeterias = [];

    // Ordenamos por valoración
    listaCafeterias = ordenarLista(listaCafeterias, "aggregateRating.ratingValue", "descendente");
    const cafeteriasRating = document.getElementById("cafeterias-rating");

    var pagina = ''; // Construimos la sección en este mensaje

    for (let i = 0; i < 3; i++) { // Recorremos las tres cafeterías con mejor valoración

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
        pagina += '      <img src="' + imagen + '" class="mr-3" alt="Imagen de la cafetería "' + i + '>';
        pagina += '    </div>';
        pagina += '    <div class="col-md-4 media-nombre d-flex align-items-center">';
        pagina += '      <h4>' + nombre + '</h4>';
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
        pagina += '      <h4>' + nombre + '</h4>'
        pagina += '    </div>';
        pagina += '    <div class="media-image col-md-4">';
        pagina += '      <img src="' + imagen + '" class="mr-3" alt="Imagen de la cafetería "' + i + '>';
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

    // Seleccionamos el elemento HTML donde se agregarán las cafeterías
    const upcomingEvents = document.getElementById("upcoming-events");
    for (let i = 0; i < 4; i++) { // Mostramos los 4 eventos más próximos en el tiempo
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

        // Creamos los elementos HTML
        const divIconBox = document.createElement("div");

        if (i == 0) {
            divIconBox.className = "icon-box mt-5 mt-lg-0";
        }
        else {
            divIconBox.className = "icon-box mt-5";
        }

        divIconBox.setAttribute("data-aos", "zoom-in");
        divIconBox.setAttribute("data-aos-delay", "150");
        divIconBox.onclick = function () { cargarContenido('evento.html', lugar.replace(/'/g, "\\'"), nombre.replace(/'/g, "\\'")) };

        const divEventBody = document.createElement("div");
        divEventBody.className = "event-body";

        const iconChevronRight = document.createElement("i");
        iconChevronRight.className = "fa-solid fa-chevron-right chevron";

        const heading = document.createElement("h4");
        heading.textContent = nombre;

        const paragraph = document.createElement("p");
        paragraph.classList.add("info");

        const iconoUbicacion = document.createElement("i");
        iconoUbicacion.classList.add("fa-solid", "fa-location-dot", "fa-lg");

        const iconoFecha = document.createElement("i");
        iconoFecha.classList.add("fa-solid", "fa-calendar", "fa-lg");

        // Crear contenedor para la primera fila
        const fila1 = document.createElement('div');
        fila1.append(iconoUbicacion);
        fila1.append(lugar);

        // Crear contenedor para la segunda fila
        const fila2 = document.createElement('div');
        fila2.append(iconoFecha);
        fila2.append(fecha);

        // Agregar las filas al párrafo
        paragraph.append(fila1);
        paragraph.append(fila2);

        // Estructuramos los elementos HTML
        divEventBody.appendChild(iconChevronRight);
        divEventBody.appendChild(heading);
        divEventBody.appendChild(paragraph);

        divIconBox.appendChild(divEventBody);
        upcomingEvents.appendChild(divIconBox);
    }
}

function obtenerUbicacionUsuario() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const ubicacion = {
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude
                    };
                    resolve(ubicacion);
                },
                function (error) {
                    reject(error);
                }
            );
        } else {
            reject("La geolocalización no está disponible en este navegador.");
        }
    });
}

// Función para calcular la distancia entre dos coordenadas geográficas (en kilómetros)
function calcularDistancia(latitud1, longitud1, latitud2, longitud2) {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros

    // Convertir las coordenadas a radianes
    const latitudRadianes1 = gradosARadianes(latitud1);
    const longitudRadianes1 = gradosARadianes(longitud1);
    const latitudRadianes2 = gradosARadianes(latitud2);
    const longitudRadianes2 = gradosARadianes(longitud2);

    // Diferencias entre las coordenadas
    const diferenciaLatitudes = latitudRadianes2 - latitudRadianes1;
    const diferenciaLongitudes = longitudRadianes2 - longitudRadianes1;

    // Fórmula de Haversine
    const a =
        Math.sin(diferenciaLatitudes / 2) * Math.sin(diferenciaLatitudes / 2) +
        Math.cos(latitudRadianes1) * Math.cos(latitudRadianes2) *
        Math.sin(diferenciaLongitudes / 2) * Math.sin(diferenciaLongitudes / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = (radioTierra * c) * 1000;
    return distancia;
}

function gradosARadianes(grados) {
    return grados * (Math.PI / 180);
}

// Función principal para obtener la posición del usuario y calcular las distancias
async function obtenerDistanciasCafeterias(listaCafeterias) {
    // Obtener la posición del usuario

    const ubicacionUsuario = await obtenerUbicacionUsuario();
    const latUsuario = ubicacionUsuario.latitud;
    const lonUsuario = ubicacionUsuario.longitud;

    // Calcular la distancia con cada cafetería en la lista
    listaCafeterias.forEach(function (cafeteria) {
        const latCafeteria = cafeteria.geo.latitude;
        const lonCafeteria = cafeteria.geo.longitude;
        cafeteria.distancia = calcularDistancia(latUsuario, lonUsuario, latCafeteria, lonCafeteria);
    });

}

function obtenerListaEventos(listaCafeterias) {
    const listaEventos = listaCafeterias.reduce((eventosTotales, cafeteria) => {
        // Añadir el nombre de la cafetería a cada evento
        const eventosConLugar = cafeteria.events.map(evento => {
            return {
                ...evento,
                place: cafeteria.name
            };
        });

        return eventosTotales.concat(eventosConLugar);
    }, []);

    const fechaActual = new Date();

    // Filtramos los eventos que ya han sucedido
    const eventosFiltrados = listaEventos.filter(evento => {
        const fechaInicioEvento = new Date(evento.startDate);
        return fechaInicioEvento >= fechaActual;
    });

    return eventosFiltrados;
}

function obtenerListaTotalEventos(listaCafeterias) {
    const listaEventos = listaCafeterias.reduce((eventosTotales, cafeteria) => {
        // Añadir el nombre de la cafetería a cada evento
        const eventosConLugar = cafeteria.events.map(evento => {
            return {
                ...evento,
                place: cafeteria.name
            };
        });

        return eventosTotales.concat(eventosConLugar);
    }, []);

    return listaEventos;
}

function getCurrencySymbol(priceCurrency) {

    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        AUD: 'A$',
        CAD: 'C$',
        CHF: 'SFr',
        CNY: '¥',
        SEK: 'kr',
        NZD: 'NZ$',
        KRW: '₩',
        PGY: '₲'
    };

    if (currencySymbols.hasOwnProperty(priceCurrency)) {
        return currencySymbols[priceCurrency];
    }

    return '';
}