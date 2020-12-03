import { setupSearchBox } from "./searchBox";

let mapInstance = {};

let mapInit = (mapObj) => {
	mapInstance = mapObj;

	// Ajouter les boutons de zoom
	setupControlZoom(mapObj);
	// Charger les points
	ata_loadData(mapObj);

	// Initialiser la recherche
	setupSearchBox();
};

// Position des boutons de zoom sur la carte
function setupControlZoom(mapObj) {
	L.control.zoom({ position: "bottomright" }).addTo(mapObj);
}

// Charger les points à partir d'une recherche
function chargerGeoPoints(keywords) {
	console.log(mapInstance);
	// Prévoir une limite de sélection large
	// TODO récupérer une valeur limite qui corresponde aux données réelle de la base ?
	let limit = 2000;

	if (Array.isArray(keywords) && keywords.length > 0) {
		// Créer un dictionnaire qui sera utilisé pour la requête
		let queryMap = {
			id_association: [],
			id_mot: [],
			id_adresse: [],
			limit: limit,
		};

		// Ajouter les id des objets de la requête
		for (let i = 0; i < keywords.length; i++) {
			const critere = keywords[i].split(":");
			const cle = critere[0];
			for (const key in queryMap) {
				if (key === cle) {
					queryMap[key].push(critere[1]);
				}
			}
		}
		// Convertir l'objet en parametres avec jQuery (meilleure compatibilité)
		let query = $.param(queryMap);
		let url = "http.api/collectionjson/associations?" + query;

		// Effacer les points affichés sur la carte
		mapInstance.removeAllMarkers();

		// Collecter les associations qui répondent aux critères de recherche
		$.getJSON(url)
			.done(function (json) {
				let associations = { id: [], limit: limit };
				let collection = json.collection.items;

				for (let i = 0; i < collection.length; i++) {
					associations.id.push(collection[i].data[0].value);
				}

				let query = $.param(associations);
				let url =
					"?page=gis_json&objets=associations_recherche&" + query;

				$.getJSON(url).done(function (json) {
					// Si un seul point à afficher,
					// alors on traite le point via une fonction adhoc,
					// car la fonction parseGeoJson de GIS ne permet pas
					// de centrer la carte sur le point à afficher.
					if (json.features.length == 1) {
						parseOneFeature(mapInstance, json);
					} else {
						// Nécessaire pour centrer sur les marqueurs demandés
						mapInstance.options.autocenterandzoom = true;
						mapInstance.parseGeoJson(json);
					}
				});
			})
			.fail(function () {
				// TODO Gérer l'absence de réponse
			});
	} else {
		// ! Note: recharger la totalité du bloc contenant la carte
		// ! ce principe a l'avantage de la simplicité, mais le temps de réponse
		// ! reste long (2s en local).
		ajaxReload('map');
		// ! Ci-desssous solution alternative, tout aussi lente que la précédente.
		// let url = "?page=gis_json&objets=associations&limit=" + limit;
		// $.getJSON(url).done(function (json) {
		// 	mapInstance.removeAllMarkers();
		// 	mapInstance.flyTo(
		// 		[mapInstance.options.center[0], mapInstance.options.center[1]],
		// 		mapInstance.options.zoom, true
		// 	);
		// 	mapInstance.options.autocenterandzoom = false;
		// 	mapInstance.parseGeoJson(json);
		// });
	}
}

// Traitement d'un seul point à afficher sur la carte.
// Contrairement au traitement standard de GIS, les limites du point (bounds)
// sont prises en compte et on zoome sur lui.
function parseOneFeature(map, data) {
	let geojson = L.geoJson("", {
		style: map.options.pathStyles
			? map.options.pathStyles
			: function (feature) {
					if (feature.properties && feature.properties.styles) {
						return feature.properties.styles;
					} else {
						return "";
					}
			  },
		onEachFeature: function (feature, layer) {
			// Déclarer l'icone du point
			if (feature.geometry.type == "Point") {
				map.setGeoJsonFeatureIcon(feature, layer);
			}
			// Déclarer le contenu de la popup s'il y en a
			map.setGeoJsonFeaturePopup(feature, layer);
		},
		pointToLayer: function (feature, latlng) {
			var alt = "Marker";
			if (feature.properties.title) {
				alt = feature.properties.title;
			}
			return L.marker(latlng, { alt: alt });
		},
	})
		.addData(data)
		.addTo(map);

	let options = { maxZoom: 10 };
	map.fitBounds(geojson.getBounds(), options);

	if (typeof map.geojsons == "undefined") map.geojsons = [];
	map.geojsons.push(geojson);
}

// Fonction reprise de GIS (loadData) et adaptée pour le chargement
// des marqueurs.
function ata_loadData(mapObj) {
	let map = mapObj;
	if (typeof(map.options.json_points) !== 'undefined'
		&& map.options.json_points.url.length) {
		let args = {};
		jQuery.extend(true, args, map.options.json_points.env);
		args.objets = map.options.json_points.objets;
		if (args.objets == "point_libre") {
			args.lat = map.options.center[0];
			args.lon = map.options.center[1];
			if (typeof map.options.json_points.titre !== "undefined")
				args.titre = map.options.json_points.titre;
			if (typeof map.options.json_points.description !== "undefined")
				args.description = map.options.json_points.description;
			if (typeof map.options.json_points.icone !== "undefined")
				args.icone = map.options.json_points.icone;
		}
		if (typeof map.options.json_points.limit !== "undefined") {
			args.limit = map.options.json_points.limit;
		}
		console.log(args);
		jQuery.getJSON(map.options.json_points.url, args, function (data) {
			if (data) {
				console.log(data);
				// Charger le json (data) et déclarer les points
				//map.parseGeoJson(data);
				jQuery("#" + map._container.id).trigger("ready", map);
			}
		});
	}
}

export { mapInit, chargerGeoPoints, mapInstance };
