var listaCafeterias;

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

	// Hacemos el request del JSON
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/cafeterias.json");
    request.responseType = 'text';
    
    request.onload = () => {
        // Convertimos el JSON a objetos JS
        const objeto = JSON.parse(request.response);
        listaCafeterias = objeto.itemListElement;
        
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
				iconMapClick(marker.title);
			});
		});
    };
    request.send();
}

function iconMapClick(title){
	console.log(title)
	cafeteria = listaCafeterias.find(c => c.name == title)

	//Load Info of cafeteria on page
	document.getElementById("map-selected-item-name").textContent = title;
}