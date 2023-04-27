function hello(params) {
    console.log("hello wordl!");
}

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

	// Name
	// Latitude, Longitude
	// Image URL
	// scaledSize width, height
	const markers = [
		[
			"Punto de Interés 1",
			39.590315478708625,
			2.652479930691325,
			'assets/vendor/fontawesome/svgs/brands/amazon.svg',
			30,
			47.8,
		],
		[
			"Punto de Interés 2",
			39.59383977758444,
			2.6532940687194424,
			'assets/vendor/fontawesome/svgs/solid/cookie.svg',
			30,
			47.8,
		],
        [
			"Punto de Interés 3",
			39.57558081120033,
			2.6570538827888535,
			'assets/vendor/fontawesome/svgs/solid/cookie.svg',
			30,
			47.8,
		],[
			"Punto de Interés 4",
			39.56891532261607,
			2.6446060537398743,
			'assets/vendor/fontawesome/svgs/solid/cookie.svg',
			30,
			47.8,
		],
        [
			"Punto de Interés 5",
			39.579586870681396,
			2.6398806117517215,
			'assets/vendor/fontawesome/svgs/solid/cookie.svg',
			30,
			47.8,
		],
        [
			"Punto de Interés 6",
			39.57740610044935,
			2.651188859938025,
			'assets/vendor/fontawesome/svgs/solid/cookie.svg',
			30,
			47.8,
		],
        [
			"Punto de Interés 7",
			39.5396521103593,
			2.7140298587397407,
			'assets/vendor/fontawesome/svgs/solid/cookie.svg',
			30,
			47.8,
		],
        [
			"Punto de Interés 8",
			39.575463864257166,
			2.6486768901636553,
			'assets/vendor/fontawesome/svgs/solid/cookie.svg',
			30,
			47.8,
		]
	];

	for (let i = 0; i < markers.length; i++) {
		const currMarker = markers[i];

		const marker = new google.maps.Marker({
			position: { lat: currMarker[1], lng: currMarker[2] },
			map,
			title: currMarker[0],
			icon: {
				url: currMarker[3],
				scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
			},
			animation: google.maps.Animation.DROP,
		});

		const infowindow = new google.maps.InfoWindow({
			content: currMarker[0],
		});

		marker.addListener('click', () => {
			infowindow.open(map, marker);
		});
	}
}