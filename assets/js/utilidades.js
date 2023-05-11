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
        storeCafeteria(nombre);
    };
    request.send();
}

function cargarCafeteriaClickada(listaCafeterias, nombre) {
    console.log("NOMBRE -> " + nombre);
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
    var pagina = '<div class="media-body row">';

    pagina += '<div class="col-lg-4">';
    pagina += '        <h3>' + cafeteriaEncontrada.name + '</h3>';
    pagina += '        <div class="col-lg-6" data-aos="fade-left" data-aos-delay="100">';
    pagina += '          <div class="icon-box mt-5 mt-lg-0" data-aos="zoom-in" data-aos-delay="150">';
    pagina += '            <i class="bx bx-receipt"></i>';
    pagina += '            <h4>Descripción</h4>';
    pagina += '            <p>' + cafeteriaEncontrada.description + '</p>';
    pagina += '          </div>';
    pagina += '          <div class="icon-box mt-5" data-aos="zoom-in" data-aos-delay="150">';
    pagina += '            <i class="bx bx-cube-alt"></i>';
    pagina += '            <h4>Rating</h4>';
    pagina += '            <p>' + cafeteriaEncontrada.aggregateRating.ratingValue + '</p>';
    pagina += '          </div>';
    pagina += '        </div>';
    pagina += '</div> ';
    pagina += '<div class="image col-lg-4">';
    pagina += '<img src="' + cafeteriaEncontrada.image + '" alt="Imagen de la cafetería">';
    pagina += '</div>';
    pagina += '      <div class="row-ev">';
    pagina += '        <div class="col-lg-6" data-aos="fade-left" data-aos-delay="100">';
    pagina += '          <div class="icon-box mt-5" data-aos="zoom-in" data-aos-delay="150">';
    pagina += '            <i class="fas fa-microphone-alt"></i>';
    pagina += '            <h4>Direccion</h4>';
    pagina += '            <p>' + cafeteriaEncontrada.address.streetAddress + '</p>';
    pagina += '            <div>';
    pagina += '              <iframe style="border:0; width: 100%; height: 270px;"';
    const latitud = cafeteriaEncontrada.geo.latitude;
    const longitud = cafeteriaEncontrada.geo.longitude;
    const urlUb = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyDEttTnyKUn1uAIIjfqoOQoTJqbAncMym0&center=' + latitud + ',' + longitud + '&zoom=18';
    pagina += '                src=' + urlUb;
    pagina += '                frameborder="0" allowfullscreen></iframe>';
    pagina += '            </div>';
    pagina += '          </div>';
    pagina += '        </div>';
    pagina += '        <div class="col-lg-6" data-aos="fade-left" data-aos-delay="100">';
    pagina += '          <div class="icon-box mt-5" data-aos="zoom-in" data-aos-delay="150">';
    pagina += '            <i class="bx bx-cube-alt"></i>';
    pagina += '            <h4>Horario</h4>';
    pagina += '            <p>' + traducirHorarioApertura(cafeteriaEncontrada.openingHours) + '</p>';
    pagina += '          </div>';
    pagina += '          <div class="icon-box mt-5" data-aos="zoom-in" data-aos-delay="150">';
    pagina += '            <i class="bx bx-cube-alt"></i>';
    pagina += '            <h4> Contacto </h4>';
    pagina += '            <p>' + cafeteriaEncontrada.contactPoint.telephone + '<br>' + cafeteriaEncontrada.contactPoint.email + '<br>' + cafeteriaEncontrada.url + '</p>';
    pagina += '          </div>';
    pagina += '        </div>';
    pagina += '      </div>';
    pagina += '    </div>';
    pagina += '    <div class="media cafeteria-events">';
    pagina += '      <h3 class="cafeteria-events tittle">Proximos Eventos</h3>';
    pagina += '      <div class="row">';
    for (let i = 0; i < cafeteriaEncontrada.events.length; i++) {

        pagina += '        <div class="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100" onclick="cargarContenido\'evento.html\'">';
        pagina += '          <a class="media cafeteria-event" href="#">';
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
        pagina += '            <h4>' + fecha + '</h4>';
        pagina += '            <div class="icon"><i class="bx bxl-dribbble"></i></div>';
        pagina += '            <h4>' + cafeteriaEncontrada.events[i].name + '</h4>';
        pagina += '            <p>' + cafeteriaEncontrada.events[i].about + '</p>';
        pagina += '          </a>';
        pagina += '        </div>';

    }
    pagina += '      </div>';
    pagina += '    </div>';
    cafeteriaSelect.innerHTML = pagina;
}

function traducirHorario(horario) {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const diasTraducidos = {
        Mo: 'Lunes',
        Tu: 'Martes',
        We: 'Miércoles',
        Th: 'Jueves',
        Fr: 'Viernes',
        Sa: 'Sábado',
        Su: 'Domingo'
    };

    const horarioTraducido = [];

    horario.forEach(item => {
        const [dias, horas] = item.split(' ');
        const [diaInicio, diaFin] = dias.split('-');
        const diaInicioTraducido = diasTraducidos[diaInicio];
        const diaFinTraducido = diasTraducidos[diaFin]; 
        horarioTraducido.push(`${diaInicioTraducido}-${diaFinTraducido} ${horas}`);

        horarioTraducido.push('<br>');
    });

    return horarioTraducido;
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

        divMedia.onclick = function () { cargarContenido('cafeteria.html', nombre); };


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
    listaCafeterias = ordenarLista(listaCafeterias, "distancia", "ascendente");

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
        divMedia.onclick = function () { cargarContenido('cafeteria.html', nombre, "") };

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
        else {
            divIconBox.className = "icon-box mt-5";
        }

        divIconBox.setAttribute("data-aos", "zoom-in");
        divIconBox.setAttribute("data-aos-delay", "150");
        divIconBox.onclick = function () { cargarContenido('evento.html', nombre, "") };

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