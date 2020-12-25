import { config } from "./config";

// Fonction reprise et adaptée de l'API GIS loadData()
// mais il s'agit ici d'appeler un traitement spécifique des données json
export function load(json_points, map) {
	if (typeof json_points !== "undefined" && json_points.url.length) {
		let args = {};
		jQuery.extend(true, args, json_points.env);
		args.objets = json_points.objets;

		if (typeof json_points.limit !== "undefined") {
			args.limit = json_points.limit;
		}

		// let self = this;
		jQuery.getJSON(json_points.url, args, (data) => {
			if (data) {
				parse(data, map);
			}
		});
		// console.log(map);
	}
}

// Adaptation de la fonction parseGeoJson de GIS
// afin de personnaliser les clusters.
export function parse(data, map) {
	if (!map.options.cluster) {
		// parseJsonFeatures(data);
	} else {
		let options = map.options.clusterOptions;
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
		map.markerCluster = L.markerClusterGroup(options).addTo(
			map
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
				map.setGeoJsonFeatureIcon(feature, marker);

				// Gérer le click
				// this._clickMarker(marker, "on");

				marker.feature = feature;
				markers.push(marker);
			} else {
				autres.features.push(feature);
			}
		}
		map.markerCluster.addLayers(markers);
		// this.parseJsonFeatures(autres);
	}
}
