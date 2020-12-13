import { config } from "../config";
import { Modal } from "../Modal/index";

export class Map {
	constructor(mapObj) {
		this._map = mapObj;
		this._modal = new Modal("Modal");
		this._json_url;
		this.body = document.body;
	}

	setupZoom() {
		L.control.zoom({ position: "topleft" }).addTo(this._map);
	}

	// Fonction reprise et adaptée de loadData() API de GIS
	// mais il s'agit ici d'appeler un traitement spécifique des données json
	loadJson() {
		if (
			typeof this._map.options.json_points !== "undefined" &&
			this._map.options.json_points.url.length
		) {
			let args = {};
			jQuery.extend(true, args, this._map.options.json_points.env);
			args.objets = this._map.options.json_points.objets;

			if (typeof this._map.options.json_points.limit !== "undefined") {
				args.limit = this._map.options.json_points.limit;
			}

			let self = this;
			this._json_url = this._map.options.json_points.url;
			jQuery.getJSON(self._json_url, args, (data) => {
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
	// lors de l'affichage de la page,
	// le marqueur ne contient que les données "associations"
	// (nom, site, logo). Il s'agit ici de collecter
	// le complément : adresse, réseaux sociaux, activités.
	// Puis d'ouvrir la fenêtre modale de consultation des infos
	// de l'association.
	onClickMarker(event) {
		const map = this;
		const args = {
			objets: "association",
			id_association: event.target.feature.properties.id_association,
		};

		jQuery.getJSON(map._json_url, args, (data) => {
			if (data && data.features.length == 1) {
				const modal = map._modal;
				modal.open(data.features[0]);
				// if (modal.close()) {
				// 	if (modal.parseContent(data.features[0])) {
				// 		map._modal.open();
				// 	}
				// }
			}
		});
	}

	_clickMarker(marker, on) {
		if (on === "on") {
		L.DomEvent.on(marker, "click", this.onClickMarker, this);
		} else {
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