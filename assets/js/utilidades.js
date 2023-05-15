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

function filtrosSeleccionados() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const ids = [];
    checkboxes.forEach(checkbox => ids.push(checkbox.id));

    const distancia = document.getElementById('distancia').value;
    const filtrosSeleccionados = ids;
    filtrosSeleccionados.push(distancia);

    return filtrosSeleccionados;
}

function cumpleFiltrosCaf(cafeteria, filtros) {
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
        console.log("Rating -> " + filtros[filtros.length - 2]);
        if (parseInt(cafeteria.aggregateRating.ratingValue) >= parseInt(filtros[filtros.length - 2])) {
            cumple = true;
        }
    }
    return cumple;
}

function cumpleFiltrosEv(evento, cafeteria, filtros) {
    if (filtros.length === 0) {
        return true;
    }
    let eventVal = [evento.isAccessibleForFree.toString(), evento.audience];
    let cumple = false;
    for (let i = 0; i < filtros.length - 1; i++) {
        console.log("FILTROS EVENT: " + filtros[i]);
        console.log("EVENT VAL: " + eventVal[i]);
        if (eventVal.includes(filtros[i])) {
            cumple = true;
        }
    }
    if (filtros[filtros.length - 1] != 0) {
        if ((parseInt(cafeteria.distancia) / 1000).toFixed(2) <= parseInt(filtros[filtros.length - 1])) {
            cumple = true;
        }
    } else {
        if (filtros.length == 1) {
            cumple = true;
        }
    }
    return cumple;
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