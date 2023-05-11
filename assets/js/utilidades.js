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
        window.cafeterias = listaCafeterias;
        cargarCafeteriasPorValoracion(listaCafeterias);
        cargarCafeteriasPorCercania(listaCafeterias);
        cargarEventos(listaCafeterias)
    };
    request.send();
}



function clickCafeteria(nombre) {
    // Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/cafeterias.json");
    request.responseType = 'text';

    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        var listaCafeterias = objeto.itemListElement;
        cargarCafeteriaClickada(listaCafeterias, nombre);
    };
    request.send();
}

function cargarCafeteriaClickada(listaCafeterias, nombre) {
    console.log("NOMBRE -> "+nombre);
    // Seleccionamos el elemento HTML donde se agregarán las cafeterías
    var cafeteriaSelect = document.getElementById("cafeterias-sel");
    let cafeteriaEncontrada = null;
    //Buscamos la cafeteria que ha sido seleccionada
    for (var i = 0; i < listaCafeterias.length; i++) {
        //Una vez encontrada la guardamos en la variable declarada anteriormente
        if (listaCafeterias[i].name === nombre) {
            cafeteriaEncontrada = listaCafeterias[i];
            break;
        }
    }
    // Creamos los elementos HTML con los valores de la cafetería
    const divMedia = document.createElement("div");
    divMedia.className = "media-body row";

    const h3Nombre = document.createElement("h3");
    h3Nombre.textContent = cafeteriaEncontrada.name;

    const divCol1 = document.createElement("div");
    divCol1.className = "col-lg-6";
    divCol1.setAttribute("data-aos", "fade-left");
    divCol1.setAttribute("data-aos-delay", "100");

    const divDesc = document.createElement("div");
    divDesc.className = "icon-box mt-5 mt-lg-0";
    divDesc.setAttribute("data-aos", "zoom-in");
    divDesc.setAttribute("data-aos-delay", "150");

    const iDesc = document.createElement("i");
    iDesc.className = "bx bx-receipt";

    const h4Desc = document.createElement("h4");
    h4Desc.textContent = "Descripción";

    const pDesc = document.createElement("p");
    pDesc.textContent = cafeteriaEncontrada.description;

    divDesc.appendChild(iDesc);
    divDesc.appendChild(h4Desc);
    divDesc.appendChild(pDesc);

    const divRating = document.createElement("div");
    divRating.className = "icon-box mt-5";
    divRating.setAttribute("data-aos", "zoom-in");
    divRating.setAttribute("data-aos-delay", "150");

    const iRating = document.createElement("i");
    iRating.className = "bx bx-cube-alt";

    const h4Rating = document.createElement("h4");
    h4Rating.textContent = "Rating";

    const pRating = document.createElement("p");
    pRating.textContent = cafeteriaEncontrada.aggregateRating.ratingValue;

    divRating.appendChild(iRating);
    divRating.appendChild(h4Rating);
    divRating.appendChild(pRating);

    divCol1.appendChild(divDesc);
    divCol1.appendChild(divRating);

    const divCol2 = document.createElement("div");
    divCol2.className = "col-lg-6 carousel slide";
    divCol2.id = "carouselExampleIndicators";

    const divCarouselIndicators = document.createElement("div");
    divCarouselIndicators.className = "carousel-indicators";

    for (let j = 0; j < cafeteriaEncontrada.image.length; j++) {
        const divCarouselIndicator = document.createElement("div");
        divCarouselIndicator.setAttribute("data-target", "#carouselExampleIndicators");
        divCarouselIndicator.setAttribute("data-slide-to", j.toString());
        if (j === 0) {
            divCarouselIndicator.className = "active";
        }
        divCarouselIndicators.appendChild(divCarouselIndicator);
    }

    const divCarouselInner = document.createElement("div");
    divCarouselInner.className = "carousel-inner";

    for (var i = 0; i < cafeteriaEncontrada.image.length; i++) {
        const divCarouselItem = document.createElement("div");
        divCarouselItem.className = "carousel-item";

        const img = document.createElement("img");
        img.className = "d-block w-100";
        img.setAttribute("src", cafeteriaEncontrada.image[i]);

        divCarouselItem.appendChild(img);
        divCarouselInner.appendChild(divCarouselItem);

        if (i === 0) {
            divCarouselItem.classList.add("active");
        }

        divCarouselIndicators.innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}" aria-current="${i === 0 ? 'true' : 'false'}" aria-label="Slide ${i + 1}"></button>`;
    }

    const aReservar = document.createElement("a");
    aReservar.href = "#";
    aReservar.className = "btn-book";
    aReservar.textContent = "Reservar";

    divCol2.appendChild(divCarouselIndicators);
    divCol2.appendChild(divCarouselInner);
    divCol2.appendChild(aReservar);

    divMedia.appendChild(h3Nombre);
    divMedia.appendChild(divCol1);
    divMedia.appendChild(divCol2);

    //cafeteriasRating.innerHTML = "";
    cafeteriaSelect.appendChild(divMedia);
}

function cargarCafeteriasPorValoracion(listaCafeterias) {
    const nombresCafeterias = [];
    // Ordenamos por valoración
    listaCafeterias = ordenarLista(listaCafeterias, "aggregateRating.ratingValue", "descendente");
    // Seleccionamos el elemento HTML donde se agregarán las cafeterías
    const cafeteriasRating = document.getElementById("cafeterias-rating");
    for (let i = 0; i < 3; i++) { // Recorremos las tres cafeterías con mejor valoración
        // Obtenemos los valores de la cafetería del archivo JSON
        const nombre = listaCafeterias[i].name;
        nombresCafeterias.push(nombre);
        const valoracion = listaCafeterias[i].aggregateRating.ratingValue;
        const ubicacion = listaCafeterias[i].address.streetAddress;
        const imagen = listaCafeterias[i].image;
        const estado = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);

        // Creamos los elementos HTML con los valores de la cafetería
        const divMedia = document.createElement("div");
        divMedia.className = "media";

        divMedia.onclick = function () { cargarContenido('cafeteria.html', nombre, ""); };


        const divMediaBody = document.createElement("div");
        divMediaBody.className = "media-body row";

        const divMediaImage = document.createElement("div");
        divMediaImage.className = "media-image col-md-4";

        const imagenCafeteria = document.createElement("img");
        imagenCafeteria.src = imagen;
        imagenCafeteria.className = "mr-3";
        imagenCafeteria.alt = "...";
        divMediaImage.appendChild(imagenCafeteria);

        const divMediaNombre = document.createElement("div");
        divMediaNombre.className = "col-md-4 media-nombre d-flex align-items-center";

        const h4NombreCafeteria = document.createElement("h4");
        h4NombreCafeteria.textContent = nombre;
        divMediaNombre.appendChild(h4NombreCafeteria);

        const divFilas = document.createElement("div");
        divFilas.className = "col-md-4 d-flex align-items-center div-filas";

        const pEstado = document.createElement("p");
        if (estado === "Abierto") {
            pEstado.classList.add("abierto");
            pEstado.textContent = "Abierto";
        } else if (estado === "Cerrado") {
            pEstado.classList.add("cerrado");
            pEstado.textContent = "Cerrado";
        }
        divFilas.appendChild(pEstado);

        const pValoracion = document.createElement("p");
        const numEstrellas = 5;
        for (let i = 1; i <= numEstrellas; i++) {
            const spanEstrella = document.createElement("span");

            // Si la posición actual es menor o igual al valor de "rating", agregamos la clase "fa-solid" para marcar la estrella como "checked"
            if (i <= valoracion) {
                spanEstrella.classList.add("fa-solid", "fa-star");
            }
            // Si la posición actual es igual al valor de "valoracion" + 0.5, agregamos la clase "fa-solid fa-star-half-stroke" para mostrar una estrella parcialmente llena
            else if (i === Math.ceil(valoracion) && valoracion % 1 !== 0) {
                spanEstrella.classList.add("fa-solid", "fa-star-half-stroke");
            }
            // Si no, agregamos la clase "fa-regular fa-star" para mostrar una estrella vacía
            else {
                spanEstrella.classList.add("fa-regular", "fa-star");
            }

            // Agregamos la estrella al contenedor
            pValoracion.appendChild(spanEstrella);
        }

        divFilas.appendChild(pValoracion);

        const divUbicacion = document.createElement("div");
        divUbicacion.classList.add("info");

        const pUbicacion = document.createElement("p");
        pUbicacion.textContent = ` ${ubicacion}`;

        const iconoUbicacion = document.createElement("i");
        iconoUbicacion.classList.add("fa-solid", "fa-location-dot", "fa-lg");

        divUbicacion.appendChild(iconoUbicacion);
        divUbicacion.appendChild(pUbicacion);

        divFilas.appendChild(divUbicacion);

        divMediaBody.appendChild(divMediaImage);
        divMediaBody.appendChild(divMediaNombre);
        divMediaBody.appendChild(divFilas);
        divMedia.appendChild(divMediaBody);

        // Agregar la cafetería al elemento HTML
        cafeteriasRating.appendChild(divMedia);
    }
}

async function cargarCafeteriasPorCercania(listaCafeterias) {
    
    await obtenerDistanciasCafeterias(listaCafeterias);
    
    // Ordenamos por distancia
    listaCafeterias = ordenarLista(listaCafeterias, "distancia", "ascendente"); // CONECTAR CON API PARA ENCONTRAR LAS DISTANCIAS

    // // Seleccionamos el elemento HTML donde se agregarán las cafeterías
    const cafeteriasRating = document.getElementById("cafeterias-cercanas");

    for (let i = 0; i < 3; i++) { // Recorremos las tres cafeterías con mejor valoración
        // Obtenemos los valores de la cafetería del archivo JSON
        const nombre = listaCafeterias[i].name;
        const distancia = listaCafeterias[i].distancia;
        const ubicacion = listaCafeterias[i].address.streetAddress;
        const imagen = listaCafeterias[i].image;
        const estado = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);

        // Creamos los elementos HTML con los valores de la cafetería
        const divMedia = document.createElement("div");
        divMedia.className = "media";
        divMedia.onclick = function() { cargarContenido('cafeteria.html', nombre, "") };

        const divMediaBody = document.createElement("div");
        divMediaBody.className = "media-body row";

        const divMediaImage = document.createElement("div");
        divMediaImage.className = "media-image col-md-4";

        const imagenCafeteria = document.createElement("img");
        imagenCafeteria.src = imagen;
        imagenCafeteria.className = "mr-3";
        imagenCafeteria.alt = "...";
        divMediaImage.appendChild(imagenCafeteria);

        const divMediaNombre = document.createElement("div");
        divMediaNombre.className = "col-md-4 media-nombre d-flex align-items-center";

        const h4NombreCafeteria = document.createElement("h4");
        h4NombreCafeteria.textContent = nombre;
        divMediaNombre.appendChild(h4NombreCafeteria);

        const divFilas = document.createElement("div");
        divFilas.className = "col-md-4 d-flex align-items-center div-filas";

        const pEstado = document.createElement("p");
        if (estado === "Abierto") {
            pEstado.classList.add("abierto");
            pEstado.textContent = "Abierto";
        } else if (estado === "Cerrado") {
            pEstado.classList.add("cerrado");
            pEstado.textContent = "Cerrado";
        }
        divFilas.appendChild(pEstado);

        const divDistancia = document.createElement("div");
        divDistancia.classList.add("info");


        const pDistancia = document.createElement("p");
        pDistancia.textContent = ` ${distancia} Km`;
        
        const iconoDistancia = document.createElement("i");
        iconoDistancia.classList.add("fa-solid", "fa-route", "fa-lg");

        divDistancia.appendChild(iconoDistancia);
        divDistancia.appendChild(pDistancia);
        divFilas.appendChild(divDistancia);

        const divUbicacion = document.createElement("div");
        divUbicacion.classList.add("info");

        const pUbicacion = document.createElement("p");
        pUbicacion.textContent = ` ${ubicacion}`;

        const iconoUbicacion = document.createElement("i");
        iconoUbicacion.classList.add("fa-solid", "fa-location-dot", "fa-lg");


        divUbicacion.appendChild(iconoUbicacion);
        divUbicacion.appendChild(pUbicacion);
        divFilas.appendChild(divUbicacion);
        
        divMediaBody.appendChild(divFilas);
        divMediaBody.appendChild(divMediaNombre);
        divMediaBody.appendChild(divMediaImage);
        divMedia.appendChild(divMediaBody);


        // Agregar la cafetería al elemento HTML
        cafeteriasRating.appendChild(divMedia);
    }
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
        else{
            divIconBox.className = "icon-box mt-5";
        }
       
        divIconBox.setAttribute("data-aos", "zoom-in");
        divIconBox.setAttribute("data-aos-delay", "150");
        divIconBox.onclick = function() { cargarContenido('evento.html', nombre, "") };

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
                function(position) {
                    const ubicacion = {
                    latitud: position.coords.latitude,
                    longitud: position.coords.longitude
                    };
                    resolve(ubicacion);
                },
                function(error) {
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
  
    const distancia = (radioTierra * c).toFixed(2);
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