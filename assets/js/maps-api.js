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
		});
    };
    request.send();
}


function iconMapClickCafeteria(marker){
	cafeteria = listaCafeterias[marker.zIndex]
	console.log(cafeteria);

	//Load Info of cafeteria on page
	document.getElementById("map-selected-item-name").textContent = cafeteria.name;
}

function iconMapClickRestaurante(marker){
	restaurante = listaRestaurantes[marker.zIndex]
	console.log(restaurante);

	//Load Info of restaurante on page
	document.getElementById("map-selected-item-name").textContent = restaurante.name;
}

function iconMapClickBodega(marker){
	bodega = listaBodegas[marker.zIndex]
	console.log(bodega);

	//Load Info of bodega on page
	document.getElementById("map-selected-item-name").textContent = bodega.name;
}

function iconMapClickMonumento(marker){
	monumento = listaMonumentos[marker.zIndex]
	console.log(monumento);

	//Load Info of monumento on page
	document.getElementById("map-selected-item-name").textContent = monumento.name;
}