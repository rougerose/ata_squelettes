import { setupSearchBox } from "./searchBox";

let map = {};

let mapInit = (mapObj) => {
	map = mapObj;

	// Ajouter les boutons de zoom
	setupControlZoom(mapObj);

	// Initialiser la recherche
	setupSearchBox();
};

// Position des boutons de zoom sur la carte
function setupControlZoom(mapObj) {
	L.control.zoom({ position: "bottomleft" }).addTo(mapObj);
}

// Charger les points à partir d'une recherche
function chargerGeoPoints(keywords) {
	if (Array.isArray(keywords) && keywords.length > 0) {
		// Prévoir large
		// TODO récupérer une valeur qui corresponde aux données de la base ?
		let limit = 2000;

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
		map.removeAllMarkers();

		// Collecter les associations qui répondent aux critères de recherche
		$.getJSON(url).done(function (json) {
			let associations = { id: [], limit: limit };
			let collection = json.collection.items;

			for (let i = 0; i < collection.length; i++) {
				associations.id.push(collection[i].data[0].value);
			}

			let query = $.param(associations);
			let url = "?page=gis_json&objets=associations_recherche&" + query;
			$.getJSON(url).done(function (json) {
				// Centrer sur les marqueurs demandés
				map.options.autocenterandzoom = true;
				map.parseGeoJson(json);
			});
		}).fail(function () {
			// TODO Gérer l'absence de réponse
		});
	}
}

export { mapInit, chargerGeoPoints };
