// import { Map } from "./Map/index";
// import { Map.Atlas } from "./Map/index";
import { config } from "./config";
import { Modal } from "./Modal/index";

export const init = (mapObj) => {
	const map = new Map(mapObj);
};

export class Map {
	constructor(mapObj) {
		this._map = mapObj;
		this._json = this._map.options.json_points;

		// Bug Leaflet : le click sur un marqueur est envoyé deux fois.
		// Solution provisoire : https://github.com/Leaflet/Leaflet/issues/7255
		L.Util.setOptions(this._map, { tap: false });

		// Position du crédit carto...
		L.Control.Attribution.prototype.options.position = "bottomleft";
		// ... et du zoom
		L.Control.Zoom.prototype.options.position = "bottomright";

		// charger les données json
		this.loadJson();

		// Modal
		this._modal = new Modal("Modal");
	}

	// Fonction reprise et adaptée de loadData() API de GIS
	// mais il s'agit ici d'appeler un traitement spécifique des données json
	loadJson() {
		if (typeof this._json !== "undefined" && this._json.url.length) {
			let args = {};
			jQuery.extend(true, args, this._json.env);
			args.objets = this._json.objets;

			if (typeof this._json.limit !== "undefined") {
				args.limit = this._json.limit;
			}

			let self = this;
			jQuery.getJSON(self._json.url, args, (data) => {
				if (data) {
					self.parseJson(data);
				}
			});
		}
	}

	// Adaptation de la fonction parseGeoJson de GIS
	// afin de personnaliser les clusters.
	parseJson(data) {
		if (!this._map.options.cluster) {
			parseJsonFeatures(data);
		} else {
			let options = this._map.options.clusterOptions;
			options.iconCreateFunction = function (cluster) {
				let size, variant, count;
				count = cluster.getChildCount();
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
			this._map.markerCluster = L.markerClusterGroup(options).addTo(
				this._map
			);
			let markers = [];
			let autres = {
				type: "FeatureCollection",
				features: [],
			};
			for (let index = 0; index < data.features.length; index++) {
				const feature = data.features[index];

				if (
					feature.geometry.type == "Point" &&
					feature.geometry.coordinates[0]
				) {
					let marker = L.marker([
						feature.geometry.coordinates[1],
						feature.geometry.coordinates[0],
					]);

					// Déclarer l'icone du point en utilisant l'API GIS
					this._map.setGeoJsonFeatureIcon(feature, marker);

					// Gérer le click
					this._clickMarker(marker, "on");

					marker.feature = feature;
					markers.push(marker);
				} else {
					autres.features.push(feature);
				}
			}
			this._map.markerCluster.addLayers(markers);
			this.parseJsonFeatures(autres);
		}
	}

	parseJsonFeatures(data) {
		if (data.features && data.features.length > 0) {
			let self = this;
			let geojson = L.geoJson("", {
				style: self._map.options.pathStyles
					? self._map.options.pathStyles
					: function (feature) {
							if (
								feature.properties &&
								feature.properties.styles
							) {
								return feature.properties.styles;
							} else {
								return "";
							}
					  },
				onEachFeature: function (feature, layer) {
					// Icone du point
					if (feature.geometry.type == "Point") {
						self._map.setGeoJsonFeatureIcon(feature, layer);
					}
				},
				pointToLayer: function (feature, latlng) {
					let alt = "Marker";
					if (feature.properties.title) {
						alt = feature.properties.title;
					}
					let marker = L.marker(latlng, { alt: alt });
					// click
					return marker;
				},
			})
				.addData(data)
				.addTo(self._map);

			if (self._map.options.autocenterandzoom) {
				let options = { maxZoom: 10 };
				self._map.fitBounds(geojson.getBounds(), options);
			}

			if (typeof self._map.geojsons == "undefined") {
				self._map.geojsons = [];
			}
			self._map.geojsons.push(geojson);
		}
	}

	// Pour éviter un temps de chargement très long de la carte,
	// lors du premier chargement des données,
	// chaque marqueur ne contient que les données "associations"
	// (nom, site, logo). Il s'agit donc ici de collecter
	// le complément d'informations nécessaire : adresse, réseaux sociaux, activités.
	// Puis d'ouvrir la fenêtre modale de consultation des infos de l'association.
	onClickMarker(eventObj) {
		const map = this;
		const args = {
			objets: "association",
			id_association: eventObj.target.feature.properties.id_association,
		};

		jQuery.getJSON(map._json.url, args, (data) => {
			if (data && data.features.length == 1) {
				const modal = map._modal;
				modal.open(data.features[0]);
			}
		});
	}

	_clickMarker(marker, on) {
		if (on === "on") {
			L.DomEvent.on(marker, "click", this.onClickMarker, this);
		} else {
			console.log("_clickMarker off", on);
			L.DomEvent.off(marker, "click", this.onClickMarker, this);
		}
	}

	handler(event) {
		console.log(this, event);
		// let map = this;
		// map.body.removeEventListener("transitionend", map.handler.bind(map, event.target));
		// this.body.removeEventListener("transitionend", map.handler.bind(map, event.target));
	}
}
