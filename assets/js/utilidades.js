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

function cargarCafeterias() {
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
    };
    request.send();
}

function cargarCafeteriasPorValoracion(listaCafeterias) {
    // Ordenamos por valoración
    listaCafeterias = ordenarLista(listaCafeterias, "aggregateRating.ratingValue", "descendente");
        
    // Seleccionamos el elemento HTML donde se agregarán las cafeterías
    const cafeteriasRating = document.getElementById("cafeterias-rating");
    for (let i = 0; i < 3; i++) { // Recorremos las tres cafeterías con mejor valoración
        // Obtenemos los valores de la cafetería del archivo JSON
        const nombre = listaCafeterias[i].name;
        const valoracion = listaCafeterias[i].aggregateRating.ratingValue;
        const ubicacion = listaCafeterias[i].address.streetAddress;
        const imagen = listaCafeterias[i].image;
        const estado = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);

        // Creamos los elementos HTML con los valores de la cafetería
        const divMedia = document.createElement("div");
        divMedia.className = "media";
        divMedia.onclick = function() { cargarContenido('cafeteria.html'); };

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
        divUbicacion.classList.add("ubicacion");
        divUbicacion.style.display = "flex";
        divUbicacion.style.alignItems = "center";

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

function cargarCafeteriasPorCercania(listaCafeterias) {
    // Ordenamos por distancia
    listaCafeterias = ordenarLista(listaCafeterias, "", "descendente"); // CONECTAR CON API PARA ENCONTRAR LAS DISTANCIAS
        
    // // Seleccionamos el elemento HTML donde se agregarán las cafeterías
    // const cafeteriasRating = document.getElementById("cafeterias-cercanas");
    // for (let i = 0; i < 3; i++) { // Recorremos las tres cafeterías con mejor valoración
    //     // Obtenemos los valores de la cafetería del archivo JSON
    //     const nombre = listaCafeterias[i].name;
    //     const valoracion = listaCafeterias[i].aggregateRating.ratingValue;
    //     const ubicacion = listaCafeterias[i].address.streetAddress;
    //     const imagen = listaCafeterias[i].image;
    //     const estado = comprobarEstadoDeNegocio(listaCafeterias[i].openingHours);

    //     // Creamos los elementos HTML con los valores de la cafetería
    //     const divMedia = document.createElement("div");
    //     divMedia.className = "media";
    //     divMedia.onclick = function() { cargarContenido('cafeteria.html'); };

    //     const divMediaBody = document.createElement("div");
    //     divMediaBody.className = "media-body row";

    //     const divMediaImage = document.createElement("div");
    //     divMediaImage.className = "media-image col-md-4";

    //     const imagenCafeteria = document.createElement("img");
    //     imagenCafeteria.src = imagen;
    //     imagenCafeteria.className = "mr-3";
    //     imagenCafeteria.alt = "...";
    //     divMediaImage.appendChild(imagenCafeteria);

    //     const divMediaNombre = document.createElement("div");
    //     divMediaNombre.className = "col-md-4 media-nombre d-flex align-items-center";

    //     const h4NombreCafeteria = document.createElement("h4");
    //     h4NombreCafeteria.textContent = nombre;
    //     divMediaNombre.appendChild(h4NombreCafeteria);

    //     const divFilas = document.createElement("div");
    //     divFilas.className = "col-md-4 d-flex align-items-center div-filas";

    //     const pEstado = document.createElement("p");
    //     if (estado === "Abierto") {
    //         pEstado.classList.add("abierto");
    //         pEstado.textContent = "Abierto";
    //     } else if (estado === "Cerrado") {
    //         pEstado.classList.add("cerrado");
    //         pEstado.textContent = "Cerrado";
    //     }
    //     divFilas.appendChild(pEstado);

    //     const pValoracion = document.createElement("p");
    //     // pValoracion.textContent = `Valoración: ${valoracion} estrellas`;
    //     // Creamos 5 estrellas en total
    //     const numEstrellas = 5;
    //     for (let i = 1; i <= numEstrellas; i++) {
    //         const spanEstrella = document.createElement("span");

    //         // Si la posición actual es menor o igual al valor de "rating", agregamos la clase "fa-solid" para marcar la estrella como "checked"
    //         if (i <= valoracion) {
    //             spanEstrella.classList.add("fa-solid", "fa-star");
    //         }
    //         // Si la posición actual es igual al valor de "valoracion" + 0.5, agregamos la clase "fa-solid fa-star-half-stroke" para mostrar una estrella parcialmente llena
    //         else if (i === Math.ceil(valoracion) && valoracion % 1 !== 0) {
    //             spanEstrella.classList.add("fa-solid", "fa-star-half-stroke");
    //         }
    //         // Si no, agregamos la clase "fa-regular fa-star" para mostrar una estrella vacía
    //         else {
    //             spanEstrella.classList.add("fa-regular", "fa-star");
    //         }

    //         // Agregamos la estrella al contenedor
    //         pValoracion.appendChild(spanEstrella);
    //     }
        
    //     divFilas.appendChild(pValoracion);

    //     const divUbicacion = document.createElement("div");
    //     divUbicacion.classList.add("ubicacion");
    //     divUbicacion.style.display = "flex";
    //     divUbicacion.style.alignItems = "center";

    //     const pUbicacion = document.createElement("p");
    //     pUbicacion.textContent = ` ${ubicacion}`;

    //     const iconoUbicacion = document.createElement("i");
    //     iconoUbicacion.classList.add("fa-solid", "fa-location-dot", "fa-lg");

    //     divUbicacion.appendChild(iconoUbicacion);
    //     divUbicacion.appendChild(pUbicacion);

    //     divFilas.appendChild(divUbicacion);
        
    //     divMediaBody.appendChild(divMediaImage);
    //     divMediaBody.appendChild(divMediaNombre);
    //     divMediaBody.appendChild(divFilas);
    //     divMedia.appendChild(divMediaBody);

    //     // Agregar la cafetería al elemento HTML
    //     cafeteriasRating.appendChild(divMedia);
    // }
}