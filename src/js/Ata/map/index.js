import { config } from "../ata_config";
import { setupSearchBox } from "./searchBox";

const _map = {};

let mapInit = (mapObj) => {
	_map.instance = mapObj;
	// Ajouter les boutons de zoom
	setupControlZoom(mapObj);
	// Charger les points
	ata_loadData(mapObj);
	// Initialiser la recherche
	setupSearchBox();
};

// Position des boutons de zoom sur la carte
function setupControlZoom(mapObj) {
	L.control.zoom({ position: "bottomleft" }).addTo(mapObj);
}

// Charger les points à partir d'une recherche
function ata_recherche_parseGeoJson(keywords) {
	let map = _map.instance;
	let limit = 2000;

	if (Array.isArray(keywords) && keywords.length > 0) {
		// Créer un objet qui sera utilisé pour la requête
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
						map.options.autocenterandzoom = true;
						ata_parseGeoJsonFeatures(json);
						map.options.autocenterandzoom = false;
					} else {
						// Nécessaire pour centrer sur les marqueurs demandés
						// mapInstance.options.autocenterandzoom = true;
						// mapInstance.parseGeoJson(json);
						ata_parseGeoJson(json);
					}
				});
			})
			.fail(function () {
				// TODO Gérer l'absence de réponse
			});
	} else {
		// Aucun critère de recherche, afficher la vue par défaut de la carte
		// et recharger la totalité de la carte
		map.removeAllMarkers();
		map.setView(
			[map.options.center[0], map.options.center[1]],
			map.options.zoom,
			{ animate: true }
		);
		ata_loadData(map);
	}
}

// Traitement d'un seul point à afficher sur la carte.
// Contrairement au traitement standard de GIS, les limites du point (bounds)
// sont prises en compte et on zoome sur lui.
function ata_parseGeoJsonFeatures(data) {
	let map = _map.instance;
	if (data.features && data.features.length > 0) {
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
				// map.setGeoJsonFeaturePopup(feature, layer);
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

		if (map.options.autocenterandzoom) {
			// map.centerAndZoom(geojson.getBounds());
			let options = { maxZoom: 10 };
			map.fitBounds(geojson.getBounds(), options);

		}

		if (map.options.openId) {
			gis_focus_marker(map.options.openId, map.options.mapId);
		}
		if (typeof map.geojsons == "undefined") {
			map.geojsons = [];
		}
		map.geojsons.push(geojson);
	}
}

// Fonction reprise de GIS (loadData) et adaptée pour le chargement
// des marqueurs.
function ata_loadData(mapObj) {
	let map = mapObj;
	if (
		typeof map.options.json_points !== "undefined" &&
		map.options.json_points.url.length
	) {
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
		jQuery.getJSON(map.options.json_points.url, args, function (data) {
			if (data) {
				// Charger le json (data) et déclarer les points
				ata_parseGeoJson(data);
				// map.parseGeoJson(data);
				jQuery("#" + map._container.id).trigger("ready", map);
			}
		});
	}
}

// Adaptation de la fonction gis parseGeoJson
// afin de personnaliser les icones de cluster.
function ata_parseGeoJson(data) {
	let map = _map.instance;
	if (!map.options.cluster) {
		map.parseGeoJsonFeatures(data);
	} else {
		let options = map.options.clusterOptions;
		options.iconCreateFunction = function (cluster) {
			let size;
			let variant;
			let count = cluster.getChildCount();
			if (count <= 3) {
				variant = "-xs";
				size = config.markers.size.xs;
			} else if (count <= 10) {
				variant = "-s";
				size = config.markers.size.s;
			} else if (count <= 50) {
				variant = "-m";
				size = config.markers.size.m;
			} else if (count <= 100) {
				variant = "-l";
				size = config.markers.size.l;
			} else if (count <= 250) {
				variant = "-xl";
				size = config.markers.size.xl;
			} else {
				variant = "-xxl";
				size = config.markers.size.xxl;
			}
			return new L.DivIcon({
				html: "<div><span>" + count + "</span></div>",
				className: "mp-MarkerCluster mp-MarkerCluster" + variant,
				iconSize: new L.Point(size, size),
			});
		};
		map.markerCluster = L.markerClusterGroup(options).addTo(map);
		let markers = [];
		let autres = {
			type: "FeatureCollection",
			features: [],
		};

		for (let i = 0; i < data.features.length; i++) {
			const feature = data.features[i];
			if (
				feature.geometry.type == "Point" &&
				feature.geometry.coordinates[0]
			) {
				let marker = L.marker([
					feature.geometry.coordinates[1],
					feature.geometry.coordinates[0],
				]);
				// Déclarer l'icone du point
				map.setGeoJsonFeatureIcon(feature, marker);
				// Déclarer le contenu de la popup s'il y en a
				// ! appel de la fonction désactivé
				// map.setGeoJsonFeaturePopup(feature, marker);

				// On garde en mémoire toute la feature d'origine dans le marker, comme sans clusters
				marker.feature = feature;
				// Pour compat, on continue de garder l'id à part
				marker.id = feature.id;
				markers.push(marker);
			} else {
				autres.features.push(feature);
			}
		}
		map.markerCluster.addLayers(markers);
		ata_parseGeoJsonFeatures(autres);
	}
}

export { mapInit, ata_recherche_parseGeoJson };
