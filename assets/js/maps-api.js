var listaCafeterias;
var listaRestaurantes;
var listaBodegas;
var listaMonumentos;

var map;

var coffeMarkers = [];
var restaurantMarkers = [];
var bodegaMarkers = [];
var monumentosMarkers = [];

function initMap() {
	// Update MAP_ID with custom map ID
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 39.58381783962777,
			lng: 2.6521495767053382,
		},
		zoom: 14,
		mapId: 'ab4de70ad7fea2e0',
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false,
	});

	loadCafeterias();
	loadRestaurantes();
	loadBodegas();
	loadMonumentos();

	/**
	 * NOW EVERY PLACE IS ADDED WITH JSONLD INSIDE EVERY "LOAD" FUNCTION
	 * 
	 * addListaJSONLD(listaCafeterias);
	 * addListaJSONLD(listaRestaurantes);
	 * addListaJSONLD(listaBodegas);
	 * addListaJSONLD(listaMonumentos);
	 **/

}

function filterMap(tipoMarcador){
	switch (tipoMarcador) {
		case "Cafeterias":
			coffeMarkers.map(marker => {
				marker.setMap(map);
			})
			restaurantMarkers.map(marker => {
				marker.setMap(null);
			})
			bodegaMarkers.map(marker => {
				marker.setMap(null);
			})
			monumentosMarkers.map(marker => {
				marker.setMap(null);
			})
			break;
		case "Restaurantes":
			coffeMarkers.map(marker => {
				marker.setMap(null);
			})
			restaurantMarkers.map(marker => {
				marker.setMap(map);
			})
			bodegaMarkers.map(marker => {
				marker.setMap(null);
			})
			monumentosMarkers.map(marker => {
				marker.setMap(null);
			})
			break;
		case "Bodegas":
			coffeMarkers.map(marker => {
				marker.setMap(null);
			})
			restaurantMarkers.map(marker => {
				marker.setMap(null);
			})
			bodegaMarkers.map(marker => {
				marker.setMap(map);
			})
			monumentosMarkers.map(marker => {
				marker.setMap(null);
			})
			break;
		case "Monumentos":
			coffeMarkers.map(marker => {
				marker.setMap(null);
			})
			restaurantMarkers.map(marker => {
				marker.setMap(null);
			})
			bodegaMarkers.map(marker => {
				marker.setMap(null);
			})
			monumentosMarkers.map(marker => {
				marker.setMap(map);
			})
			break;
		default:
			coffeMarkers.map(marker => {
				marker.setMap(map);
			})
			restaurantMarkers.map(marker => {
				marker.setMap(map);
			})
			bodegaMarkers.map(marker => {
				marker.setMap(map);
			})
			monumentosMarkers.map(marker => {
				marker.setMap(map);
			})
			break;
	}

}

function loadCafeterias(){
	// Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/cafeterias.json");
    request.responseType = 'text';
    
    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        listaCafeterias = objeto.itemListElement;
		coffeMarkers = [];
        
		let indxMarker = 0;
		listaCafeterias.forEach(cafeteria => {

			const marker = new google.maps.Marker({
				position: { lat: Number(cafeteria.geo.latitude), lng: Number(cafeteria.geo.longitude) },
				map,
				title: cafeteria.name,
				icon: {
					url: 'assets/img/pitr_Coffee_cup_icon.svg',
					scaledSize: new google.maps.Size(30, 48),
				},
				animation: google.maps.Animation.DROP,
				zIndex: indxMarker++
			});

			const content = "<b>" + cafeteria.name + "</b>"
				+ "<br>" + cafeteria.address.streetAddress 
				+ "<br>" + cafeteria.address.addressLocality
			 	+ "<br>" + cafeteria.address.addressRegion
				+ "<br>" + cafeteria.address.postalCode
				+ ", " + cafeteria.address.addressCountry;

			const infowindow = new google.maps.InfoWindow({
				content: content,
			});
			
			marker.addListener('click', () => {
				infowindow.open(map, marker);
				console.log(marker)
				iconMapClickCafeteria(marker);
			});

			coffeMarkers.push(marker);
			addElementoJSONLD(cafeteria);
		});
    };
    request.send();
}

function loadRestaurantes(){
	// Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/restaurante.json");
    request.responseType = 'text';
    
    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        listaRestaurantes = objeto.itemListElement;
		restaurantMarkers = [];
        
		let indxMarker = 0;
		listaRestaurantes.forEach(restaurante => {

			const marker = new google.maps.Marker({
				position: { lat: Number(restaurante.geo.latitude), lng: Number(restaurante.geo.longitude) },
				map,
				title: restaurante.name,
				icon: {
					url: 'assets/img/char_broiled-cheeseburger.svg',
					scaledSize: new google.maps.Size(25, 35),
				},
				animation: google.maps.Animation.DROP,
				zIndex: indxMarker++
			});

			const content = "<b>" + restaurante.name + "</b>"
				+ "<br>" + restaurante.address.streetAddress 
				+ "<br>" + restaurante.address.addressLocality
			 	+ "<br>" + restaurante.address.addressRegion
				+ "<br>" + restaurante.address.postalCode;

			const infowindow = new google.maps.InfoWindow({
				content: content,
			});
			
			marker.addListener('click', () => {
				infowindow.open(map, marker);
				console.log(marker)
				iconMapClickRestaurante(marker);
			});

			restaurantMarkers.push(marker);
			addElementoJSONLD(restaurante);
		});
    };
    request.send();
}

function loadBodegas(){
	// Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/bodegas.json");
    request.responseType = 'text';
    
    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        listaBodegas = objeto.itemListElement;
		bodegaMarkers = [];
        
		let indxMarker = 0;
		listaBodegas.forEach(bodega => {

			const marker = new google.maps.Marker({
				position: { lat: Number(bodega.geo.latitude), lng: Number(bodega.geo.longitude) },
				map,
				title: bodega.name,
				icon: {
					url: 'assets/img/bottleandglass.svg',
					scaledSize: new google.maps.Size(35, 35),
				},
				animation: google.maps.Animation.DROP,
				zIndex: indxMarker++
			});

			const content = "<b>" + bodega.name + "</b>"
				+ "<br>" + bodega.address.streetAddress 
				+ "<br>" + bodega.address.addressLocality
			 	+ "<br>" + bodega.address.addressRegion
				+ "<br>" + bodega.address.postalCode;

			const infowindow = new google.maps.InfoWindow({
				content: content,
			});
			
			marker.addListener('click', () => {
				infowindow.open(map, marker);
				console.log(marker)
				iconMapClickBodega(marker);
			});

			bodegaMarkers.push(marker);
			addElementoJSONLD(bodega);
		});
    };
    request.send();
}

function loadMonumentos(){
	// Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/monumentos.json");
    request.responseType = 'text';
    
    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        listaMonumentos = objeto.itemListElement;
		monumentosMarkers = [];
        
		let indxMarker = 0;
		listaMonumentos.forEach(monumento => {

			const marker = new google.maps.Marker({
				position: { lat: Number(monumento.geo.latitude), lng: Number(monumento.geo.longitude) },
				map,
				title: monumento.name,
				icon: {
					url: 'assets/img/Museum-icon.svg',
					scaledSize: new google.maps.Size(30, 25),
				},
				animation: google.maps.Animation.DROP,
				zIndex: indxMarker++
			});

			const content = "<b>" + monumento.name + "</b>"
				+ "<br>" + monumento.address.streetAddress 
				+ "<br>" + monumento.address.addressLocality
			 	+ "<br>" + monumento.address.addressRegion
				+ "<br>" + monumento.address.postalCode;

			const infowindow = new google.maps.InfoWindow({
				content: content,
			});
			
			marker.addListener('click', () => {
				infowindow.open(map, marker);
				console.log(marker)
				iconMapClickMonumento(marker);
			});

			monumentosMarkers.push(marker);
			addElementoJSONLD(monumento);
		});
    };
    request.send();
}

function iconMapClickCafeteria(marker){
	cafeteria = listaCafeterias[marker.zIndex]
	console.log(cafeteria);

	//Load Info of cafeteria on page
	document.getElementById("map-selected-item-name").innerHTML = '<i class="fa-sharp fa-solid fa-mug-hot" style="margin-right: 5px;"></i>' + cafeteria.name;
	
	info = '<div><h4>Conócenos<i class="fa-solid fa-clipboard-list" style="margin-left: 8px;"></i></h4><p> ' + cafeteria.description + '</p></div>'
	info+= '<div><h4>Ubicación<i class="fa-solid fa-location-dot" style="margin-left: 8px;"></i></h4><p> ' + cafeteria.address.streetAddress 
	info+= '. ' + cafeteria.address.addressLocality + ', ' + cafeteria.address.addressRegion
	info+= '. ' + cafeteria.address.postalCode + '</p></div>'
	info+= '<div><a href="#" onclick="cargarContenido(\'cafeteria.html\', \'' + cafeteria.name + '\', null)"><b>Más información</b></a></div>'

	document.getElementById("map-selected-item-info").innerHTML = info
	
}

function iconMapClickRestaurante(marker){
	restaurante = listaRestaurantes[marker.zIndex]
	console.log(restaurante);

	//Load Info of restaurante on page
	document.getElementById("map-selected-item-name").innerHTML = '<i class="fa-solid fa-utensils" style="margin-right: 10px;"></i>' + restaurante.name;

	info = '<div><h4>Conócenos<i class="fa-solid fa-clipboard-list" style="margin-left: 8px;"></i></h4><p> ' + restaurante.description + '</p></div>'
	info+= '<div><h4>Ubicación<i class="fa-solid fa-location-dot" style="margin-left: 8px;"></i></h4><p> ' + restaurante.address.streetAddress 
	info+= '. ' + restaurante.address.addressLocality + ', ' + restaurante.address.addressRegion
	info+= '. ' + restaurante.address.postalCode + '</p></div>'
	info+= '<div><a href="https://www.mllcarestaurantes.com/singleRestaurant.html? ' + restaurante.id + '"><b>Más información</b></a></div>'
	
	document.getElementById("map-selected-item-info").innerHTML = info
}

function iconMapClickBodega(marker){
	bodega = listaBodegas[marker.zIndex]
	console.log(bodega);

	//Load Info of bodega on page
	document.getElementById("map-selected-item-name").innerHTML = '<i class="fa-solid fa-wine-glass" style="margin-right: 8px;"></i>' + bodega.name;

	info = '<div><h4>Conócenos<i class="fa-solid fa-clipboard-list" style="margin-left: 8px;"></i></h4><p> ' + bodega.description + '</p></div>'
	info+= '<div><h4>Ubicación<i class="fa-solid fa-location-dot" style="margin-left: 8px;"></i></h4><p> ' + bodega.address.streetAddress 
	info+= '. ' + bodega.address.addressRegion + ', ' + bodega.address.addressLocality
	info+= '. ' + bodega.address.postalCode + '</p></div>'
	info+= '<div><a href="https://mallorcabodegas.com"><b>Más información</b></a></div>'

	document.getElementById("map-selected-item-info").innerHTML = info
}

function iconMapClickMonumento(marker){
	monumento = listaMonumentos[marker.zIndex]
	console.log(monumento);

	//Load Info of monumento on page
	document.getElementById("map-selected-item-name").innerHTML = '<i class="fa-solid fa-building-columns" style="margin-right: 8px;"></i>' + monumento.name;

	info = '<div><h4>Conócenos<i class="fa-solid fa-clipboard-list" style="margin-left: 8px;"></i></h4><p> ' + monumento.description + '</p></div>'
	info+= '<div><h4>Ubicación<i class="fa-solid fa-location-dot" style="margin-left: 8px;"></i></h4><p> ' + monumento.address.streetAddress 
	info+= '. ' + monumento.address.addressLocality + ', ' + monumento.address.addressRegion
	info+= '. ' + monumento.address.postalCode + '</p></div>'
	info+= '<div><a href="https://www.monumentosmallorca.com/monumento.html?monumento=' + marker.zIndex + '"><b>Más información</b></a></div>'

	document.getElementById("map-selected-item-info").innerHTML = info
}