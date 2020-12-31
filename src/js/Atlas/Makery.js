var markersLayer = new L.LayerGroup();
var type_lab = "";
var lang = "fr";
var is_embed = "0";
var show_intro_text = "1";
var is_mobile = "";
var show_ids = "";
var id_to_show = "";
var search_keyword = "";
var icon_type;
var markersList = [];
zoom = "6";
var currentIconWidth = 23;
var currentIconHeight = 26;

var tabMC = new Array();
var tabMC_ext = new Array();
var last_MC = "";
var last_MC_ext = "";

var equipmentLoaded = false;
var activitiesLoaded = false;

var dataList = new Array();
var indexDatalist = 0;

var infoInCartouche = "";

/*--------------------------------------------------------
 *   fonctions Generic
 * --------------------------------------------------------*/
function IsMobile() {
	var Uagent = navigator.userAgent || navigator.vendor || window.opera;
	return (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
			Uagent
		) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
			Uagent.substr(0, 4)
		)
	);
}
is_mobile = IsMobile();

function $_GET(param) {
	var vars = {};
	window.location.href.replace(location.hash, "").replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function (m, key, value) {
			// callback
			vars[key] = value !== undefined ? value : "";
		}
	);

	if (param) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}
var $_GET = $_GET();
var newshow_ids = $_GET["show_ids"];
var newzoom = $_GET["zoom"];
var newview_lat = $_GET["view_lat"];
var newview_lng = $_GET["view_lng"];
if (typeof newshow_ids === "undefined") {
	newshow_ids = "";
}
if (typeof newzoom === "undefined") {
	newzoom = "";
}
if (typeof newview_lat === "undefined") {
	newview_lat = "";
}
if (typeof newview_lng === "undefined") {
	newview_lng = "";
}

if (typeof embed === "undefined") {
	embed = false;
}

var firstTimeGet = 1;

/*--------------------------------------------------------
 *   fonctions CARTO
 //* --------------------------------------------------------*/
L.mapbox.accessToken =
	"pk.eyJ1IjoibWF0aGVtYWdpZSIsImEiOiJEZ0czbnJVIn0.cD_NRlnOOCRSZGamSYHhKw"; // mathemagie
//L.mapbox.accessToken = 'pk.eyJ1IjoibWFrZXJ5LWluZm8iLCJhIjoiY2thY2xsemszMDA3ODJxcGFjcmN4NG12eiJ9.kZxoQdwF-A7aMTV-4zW5Sw';
//var map = L.mapbox.map('map', 'mathemagie.ihhi5ian').setView([47.1588589,1.3470599,12], zoom);

var map = L.map("map");

L.tileLayer(
	"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
	{
		attribution:
			'© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
		tileSize: 512,
		maxZoom: 18,
		zoomOffset: -1,
		id: "makery-info/ckgaidh4k0xq719rxs49qczmz",
		accessToken:
			"pk.eyJ1IjoibWFrZXJ5LWluZm8iLCJhIjoiY2thY2xsemszMDA3ODJxcGFjcmN4NG12eiJ9.kZxoQdwF-A7aMTV-4zW5Sw",
	}
).addTo(map);

var url = "mapbox://styles/makeryinfo/cjacb7p6h45f92rpkoh7c61xs";
//var styleLayer = L.mapbox.styleLayer(url)
//	.addTo(map);
//var map = L.mapbox.map('map', 'makeryinfo.testSylvie').setView([47.1588589,1.3470599,12], zoom);
var geocoder = L.mapbox.geocoder("mapbox.places"); // différence par rapport à origine où c'est geocoderControl
//var geocoder = L.mapbox.geocoderControl('mapbox.light');
//geocoder.setPosition('topright');
//map.addControl(geocoder);
//L.control.locate( {position: 'topright',locateOptions: {maxZoom: 14}}).addTo(map);
map.zoomControl.setPosition("topright");
map.on("zoomend", function (e) {
	resizeZoom();
	setTimeout(resizeZoom, 500);
});
function resizeZoom() {
	var myZoom = map.getZoom();
	if (myZoom <= 6) {
		currentIconWidth = 23;
		currentIconHeight = 26;
	} else {
		if (myZoom <= 7) {
			currentIconWidth = 32;
			currentIconHeight = 36;
		} else {
			if (myZoom <= 8) {
				currentIconWidth = 37;
				currentIconHeight = 42;
			} else {
				currentIconWidth = 46;
				currentIconHeight = 52;
			}
		}
	}
	//console.log(myZoom+"/"+currentIconWidth);
	$("img.leaflet-marker-icon").css("width", currentIconWidth + "px");
	$("img.leaflet-marker-icon").css("height", currentIconHeight + "px");
	$("img.leaflet-marker-icon").css("margin-top", -currentIconHeight + "px");
	$("img.leaflet-marker-icon").css(
		"margin-left",
		-(currentIconWidth / 2) + "px"
	);

	//$('#map').css('top','90px');// pb bug Chrome
}
var markers = L.markerClusterGroup({
	showCoverageOnHover: false,
	maxClusterRadius: 80,
	iconCreateFunction: function (cluster) {
		var clusterSize = "small";
		var size1;
		var size2;
		if (cluster.getChildCount() <= 3) {
			size1 = 44;
		} else {
			if (cluster.getChildCount() <= 10) {
				size1 = 54;
			} else {
				if (cluster.getChildCount() <= 50) {
					size1 = 64;
				} else {
					if (cluster.getChildCount() <= 100) {
						size1 = 74;
					} else {
						if (cluster.getChildCount() <= 250) {
							size1 = 84;
						} else {
							size1 = 94;
						}
					}
				}
			}
			//size1 = 44+parseInt(Math.log(cluster.getChildCount()));
		}
		size2 = size1 - 11;
		if (cluster.getChildCount() >= 3) {
			clusterSize = "medium";
		}
		return new L.DivIcon({
			html:
				'<div style="width:' +
				size2 +
				"px;height:" +
				size2 +
				"px;line-height:" +
				size2 +
				'px"><span>' +
				cluster.getChildCount() +
				"</span></div>",
			className: "marker-cluster",
			iconSize: new L.Point(size1, size1),
		});
	},
});

var labIcon1 = L.icon({
	iconUrl: "icon/marker_fablabs.svg",
	iconSize: [currentIconWidth, currentIconHeight],
	iconAnchor: [currentIconWidth / 2, currentIconHeight],
	popupAnchor: [0, -18],
});
var labIcon2 = L.icon({
	iconUrl: "icon/marker_hackerspace.svg",
	iconSize: [currentIconWidth, currentIconHeight],
	iconAnchor: [currentIconWidth / 2, currentIconHeight],
	popupAnchor: [0, -18],
});
var labIcon3 = L.icon({
	iconUrl: "icon/marker_makerspaces.svg",
	iconSize: [currentIconWidth, currentIconHeight],
	iconAnchor: [currentIconWidth / 2, currentIconHeight],
	popupAnchor: [0, -18],
});
var labIcon4 = L.icon({
	iconUrl: "icon/marker_tiers-lieux.svg",
	iconSize: [currentIconWidth, currentIconHeight],
	iconAnchor: [currentIconWidth / 2, currentIconHeight],
	popupAnchor: [0, -18],
});
var labIcon5 = L.icon({
	iconUrl: "icon/marker_autres.svg",
	iconSize: [currentIconWidth, currentIconHeight],
	iconAnchor: [currentIconWidth / 2, currentIconHeight],
	popupAnchor: [0, -18],
});
var fakeIcon = 1;

function loadMarkers() {
	markers.clearLayers();
	markersList = [];

	var vNb = tabMC_ext.length;

	var contentHTML = "";
	for (var i = 0; i < vNb; i++) {
		if (i == 0) {
		} else {
			contentHTML += ",";
		}
		contentHTML += tabMC_ext[i];
	}

	$.getJSON(
		"request-map.php?search=" + contentHTML + "&show_ids=" + newshow_ids,
		function (data) {
			dataList = new Array();
			indexDatalist = 0;

			$.each(data.features, function (key, val) {
				this.lat = val.geometry.coordinates[1];
				this.lng = val.geometry.coordinates[0];
				//console.log()

				dataList[indexDatalist] = val;

				var infoBulle = "" + indexDatalist; //val.properties.id;

				var myIcon = labIcon5;
				icon_type = labIcon5;

				switch (val.properties.type_convert) {
					case "fablab":
						myIcon = labIcon1;
						icon_type = labIcon1;
						break;
					case "hackerspace":
						myIcon = labIcon2;
						icon_type = labIcon2;
						break;
					case "makerspace":
						myIcon = labIcon3;
						icon_type = labIcon3;
						break;
					case "tiers-lieu":
						myIcon = labIcon4;
						icon_type = labIcon4;
						break;
				}

				var marker = new L.Marker(new L.LatLng(this.lat, this.lng), {
					icon: myIcon,
				}).bindPopup(infoBulle);
				markersList.push(marker);

				markers.addLayer(marker);

				// Listen for individual marker clicks.
				marker.on("click", function (e) {
					//console.log(e);
					//console.log(e.target._popup._content);
					var indexClick = parseInt(e.target._popup._content);
					displayMarker(indexClick);
				});

				//marker.openPopup();
				map.addLayer(markers);
				if (id_to_show == val.properties.id) {
					marker.openPopup();
					map.setView([this.lat, this.lng], 6);
				}
				//marker.addTo(map);

				indexDatalist += 1;
			});
			//-------------------------
			//console.log(indexDatalist);
			if (indexDatalist == 0) {
				$("#noresult").html("Aucun résultat");
				$("#noresult").css("display", "block");
				$("#noresult").css(
					"top",
					$(".search-all-criteria").offset().top +
						parseInt($(".search-all-criteria").css("height")) +
						"px"
				);
				$("#noresult").css(
					"left",
					$(".search-all-criteria").offset().left + 0 + "px"
				);
				$("#noresult").css(
					"width",
					parseInt($("#searchfrm").css("width")) + 0 + "px"
				);
				//timeoutNoresult=setTimeout(clearNoResult,5000);
			} else {
				clearNoResult();
			}
			//-------------------------
			//if (show_ids != '') markersList[0].openPopup();
		},
		"json"
	).done(function () {
		var vNb = tabMC_ext.length;
		var nb_villes = 0;
		for (var i = 0; i < vNb; i++) {
			var term = tabMC_ext[i].substr(tabMC_ext[i].length - 1, 1);
			if (term == "p") {
				nb_villes += 1;
			} else {
			}
		}
		/*if(nb_villes>0) {
				map.fitBounds(markers.getBounds());
			}else{
				if(vNb==0) {
					//map.fitBounds(markers.getBounds());
				}else{
				}
			}*/
		if (vNb == 0) {
			if (firstTimeGet == 1) {
				if (newzoom != "" && newview_lng != "" && newview_lat != "") {
					map.setView(
						[parseFloat(newview_lat), parseFloat(newview_lng)],
						parseInt(newzoom)
					);
					hideInterface();
				} else {
					map.setView([47.86555, 2.6335836, 12], 6); //default to remove
				}
				firstTimeGet = 0;
			} else {
				map.setView([47.86555, 2.6335836, 12], 6);
			}
		} else {
			map.fitBounds(markers.getBounds());
		}

		if (equipmentLoaded == false) {
			loadEquipment();
		} else {
		}

		//if (type_lab != '') map.fitBounds(markers.getBounds());
	});
}
loadMarkers();

function hideInterface() {
	if (embed == true) {
		$(".leaflet-control-container").css("top", "10px");
		$("#id-cartouche").css("top", "10px");
	} else {
	}
}

function showMap(err, data) {
	console.log(err);
	console.log(data);
	// The geocoder can return an area, like a city, or a
	// point, like an address. Here we handle both cases,
	// by fitting the map bounds to an area or zooming to a point.
	if (data.lbounds) {
		map.fitBounds(data.lbounds);
	} else if (data.latlng) {
		map.setView([data.latlng[0], data.latlng[1]], 13);
		marker.setLatLng(data.latlng);
	}
}

/*--------------------------------------------------------
 *   fonctions INPUT
 * --------------------------------------------------------*/

setTimeout(initautocomplete, 500);

var timeoutNoresult;

function initautocomplete() {
	var autoSimpleSearch = ($("#idSimpleSearch")
		.autocomplete({
			source: "autocompleteMC.php",
			autoFocus: true,
			select: function (event, ui) {
				// récupère le dernier MC
				var term = ui.item.value.substr(0, ui.item.value.length - 2);
				var tabVal = $("#idSimpleSearch").val().split(",");

				var founded = tabMC.indexOf(term);
				if (founded == -1) {
					tabMC_ext[tabMC_ext.length] = ui.item.value;
					tabMC[tabMC.length] = term;
					//-- reconstitution ---

					tabVal[tabVal.length - 1] = term;
					//$('#idSimpleSearch').val(tabVal.join(', '));
					buildCriteria();
				} else {
				}
				$("#idSimpleSearch").val("");
				$("#idSimpleSearch").blur();

				return false;
			},
			response: function (event, ui) {
				clearTimeout(timeoutNoresult);
				if (!ui.content.length) {
					var tabVal = $("#idSimpleSearch").val().split(",");
					var lastVal = tabVal[tabVal.length - 1].trim();
					if (lastVal != "") {
						$("#noresult").html(
							"Aucun résultat pour « " + lastVal + " » "
						);
						$("#noresult").css("display", "block");
						$("#noresult").css(
							"top",
							$("#idSimpleSearch").offset().top + 40 + "px"
						);
						$("#noresult").css(
							"left",
							$("#idSimpleSearch").offset().left + 0 + "px"
						);
						$("#noresult").css(
							"width",
							parseInt($("#idSimpleSearch").css("width")) +
								0 +
								"px"
						);
						//timeoutNoresult=setTimeout(clearNoResult,1000);
					} else {
						//-- on s'assure que la précédente a été sélectionnée
						clearNoResult();
						if (tabVal.length > 1) {
							var valPrec = tabVal[tabVal.length - 2].trim();
							var founded = tabMC.indexOf(valPrec);
							if (founded == -1) {
								if (valPrec == last_MC) {
									tabMC_ext[tabMC_ext.length] = last_MC_ext;
									tabMC[tabMC.length] = valPrec;
									buildCriteria();
								} else {
									// ne correspond à rien
								}
							} else {
								// déjà présent
							}
						} else {
							// pas de precedent
						}
					}
				} else {
					var term = ui.content[0].value.substr(
						0,
						ui.content[0].value.length - 2
					);
					last_MC = term;
					last_MC_ext = ui.content[0].value;
					$("#noresult").css("display", "none");
				}
			},
		})
		.data("ui-autocomplete")._renderItem = function (ul, item) {
		var prefix = item.label.substr(item.label.length - 1, 1);
		//console.log("!"+prefix+"!");
		var term = item.label.substr(0, item.label.length - 2);
		var classli = "lichecked";

		if (prefix == "p") {
			var classli = "liplace";
		} else {
		}
		return $("<li></li>")
			.data("item.autocomplete", item)
			.addClass(classli)
			.append(term)
			.appendTo(ul);
	});

	var autoVilleSearch = ($("#idVilleSearch")
		.autocomplete({
			source: "autocompleteVille.php",
			autoFocus: true,
			select: function (event, ui) {
				// récupère le dernier MC
				tabMC_ext[tabMC_ext.length] = ui.item.value;
				var term = ui.item.value.substr(0, ui.item.value.length - 2);
				tabMC[tabMC.length] = term;

				//$('#idSimpleSearch').val(term);

				$("#idSimpleSearch").val("");
				$("#idSimpleSearch").blur();
				buildCriteria();
				closeVille();
				return false;
			},
			response: function (event, ui) {
				clearTimeout(timeoutNoresult);
				if (!ui.content.length) {
					$("#noresult").html(
						"Aucun résultat pour « " +
							$("#idVilleSearch").val() +
							" » "
					);
					$("#noresult").css("display", "block");
					$("#noresult").css(
						"top",
						$("#idVilleSearch").offset().top + 40 + "px"
					);
					$("#noresult").css(
						"left",
						$("#idSimpleSearch").offset().left + 0 + "px"
					);
					$("#noresult").css(
						"width",
						parseInt($("#idVilleSearch").css("width")) + 0 + "px"
					);
					//timeoutNoresult=setTimeout(clearNoResult,1000);
				} else {
					$("#noresult").css("display", "none");
				}
			},
		})
		.data("ui-autocomplete")._renderItem = function (ul, item) {
		var prefix = item.label.substr(item.label.length - 1, 1);
		//console.log("!"+prefix+"!");
		var term = item.label.substr(0, item.label.length - 2);
		var classli = "lichecked";

		if (prefix == "p") {
			var classli = "liplace";
		} else {
		}
		return $("<li></li>")
			.data("item.autocomplete", item)
			.addClass(classli)
			.append(term)
			.appendTo(ul);
	});
}

function clearNoResult() {
	$("#noresult").css("display", "none");
}
$("#noresult").click(function () {
	clearNoResult();
});

function buildCriteria() {
	var vNb = tabMC.length;
	var contentHTML = "";
	for (var i = 0; i < vNb; i++) {
		contentHTML +=
			'<div class="inline-mobile"><div class="search-criteria">' +
			tabMC[i] +
			'<div class="btn-delete-criteria" id="del' +
			i +
			'"></div></div></div>';
	}
	$(".search-all-criteria").html(contentHTML); //-- or better : '<div id="container-crieria">'+contentHTML+'</div>'
	if (is_mobile) {
		//-- compute container-crieria width ?
		//-- to scroll
	} else {
	}

	updateAdvancedButtons();

	$(".btn-delete-criteria").click(function () {
		var vIndex = this.id.substr(3, this.id.length);
		tabMC.splice(vIndex, 1);
		tabMC_ext.splice(vIndex, 1);
		buildCriteria();
	});
	loadMarkers();
}
function updateAdvancedButtons() {
	var tabExt = ["lab", "equipment", "activities"];
	for (var i = 0; i < 3; i++) {
		var atleastOne = 0;
		$(".btn-search-" + tabExt[i]).each(function (index) {
			var searchval = $(this).attr("val");
			var founded = tabMC.indexOf(searchval);
			if (founded == -1) {
				$(this).css("opacity", 0.5);
			} else {
				$(this).css("opacity", 1);
				atleastOne += 1;
			}
		});
		if (atleastOne == 0) {
			$(".btn-search-" + tabExt[i]).each(function (index) {
				$(this).css("opacity", 1);
			});
		} else {
			//--nothing more
		}
	}
}

/*--------------------------------------------------------
 *   fonctions ADVANCED SEARCH
 * --------------------------------------------------------*/

function loadEquipment() {
	$.getJSON(
		"request-table.php?search=machines_group",
		function (data) {
			var contentHTML = '<div class="table-adv-row">';
			//
			var nbContent = data.labels.length;
			var numLine = 1;
			var indexLabel = 0;
			$.each(data.labels, function (key, val) {
				if (numLine == 1) {
					contentHTML += '<div class="table-adv-cell">';
					contentHTML +=
						'<div class="btn-search-equipment" val="Tous les équipements" >Tous les équipements</div>';
					contentHTML +=
						'<div class="btn-search-equipment" val="' +
						val +
						'">' +
						val +
						"</div>";
					contentHTML += "</div>";
				} else {
					if (numLine == 2) {
						contentHTML += '<div class="table-adv-cell">';
						contentHTML +=
							'<div class="btn-search-equipment label-indispensables" val="Les indispensables" >Les indispensables&nbsp;&nbsp;<div id="btn-indispensables"></div></div>';
						contentHTML +=
							'<div class="btn-search-equipment" val="' +
							val +
							'">' +
							val +
							"</div>";
						contentHTML += "</div>";
					} else {
						if (numLine % 2 == 1) {
							contentHTML += '<div class="table-adv-cell">';
							contentHTML +=
								'<div class="btn-search-equipment" val="' +
								val +
								'">' +
								val +
								"</div>";
						} else {
							contentHTML +=
								'<div class="btn-search-equipment" val="' +
								val +
								'">' +
								val +
								"</div>";
							contentHTML += "</div>";
						}
					}
				}

				numLine += 1;
			});
			if (numLine % 2 == 1) {
			} else {
				contentHTML += "</div>";
			}
			contentHTML += "</div>";
			$("#container-equipments").html(contentHTML);

			$(".btn-search-equipment").click(function () {
				//-- recherche de la valeur
				searchval = $(this).attr("val");

				afficheval = searchval;
				var founded = tabMC.indexOf(searchval);
				if (founded == -1) {
					tabMC_ext[tabMC_ext.length] = searchval + "_e";
					tabMC[tabMC.length] = afficheval;
					buildCriteria();
				} else {
				}
			});

			$("#btn-indispensables").click(function (e) {
				e.preventDefault();
				configHtml("indispensables");
				return false;
			});

			equipmentLoaded = true;
		},
		"json"
	).done(function () {
		//-- done ;
		if (activitiesLoaded == false) {
			loadActivity();
		} else {
		}
	});
}

function loadActivity() {
	$.getJSON(
		"request-table.php?search=themes_group",
		function (data) {
			var contentHTML = '<div class="table-adv-row">';
			//
			var nbContent = data.labels.length;
			var numLine = 1;
			var indexLabel = 0;
			$.each(data.labels, function (key, val) {
				if (numLine == 1) {
					contentHTML += '<div class="table-adv-cell">';
					contentHTML +=
						'<div class="btn-search-activities" val="Toutes les activités" >Toutes les activités</div>';
					contentHTML +=
						'<div class="btn-search-activities" val="' +
						val +
						'">' +
						val +
						"</div>";
					contentHTML += "</div>";
				} else {
					if (numLine % 2 == 0) {
						contentHTML += '<div class="table-adv-cell">';
						contentHTML +=
							'<div class="btn-search-activities" val="' +
							val +
							'">' +
							val +
							"</div>";
					} else {
						contentHTML +=
							'<div class="btn-search-activities" val="' +
							val +
							'">' +
							val +
							"</div>";
						contentHTML += "</div>";
					}
				}

				numLine += 1;
			});
			if (numLine % 2 == 0) {
			} else {
				contentHTML += "</div>";
			}
			contentHTML += "</div>";

			$("#container-activities").html(contentHTML);

			$(".btn-search-activities").click(function () {
				//-- recherche de la valeur
				searchval = $(this).attr("val");

				afficheval = searchval;

				var founded = tabMC.indexOf(searchval);
				if (founded == -1) {
					tabMC_ext[tabMC_ext.length] = searchval + "_i";
					tabMC[tabMC.length] = afficheval;
					buildCriteria();
				} else {
				}
			});

			activitiesLoaded = true;
		},
		"json"
	).done(function () {
		//-- done ;
	});
}

//-----------------
// navigation
//-------------------
function configHtml(balise) {
	razTitle();

	if (balise == "allinfo") {
		var textHTML = "";
		textHTML += "<DIV >" + jsonDataFR.cartedeslabs.texte + "</DIV >";
		textHTML += "<DIV >" + jsonDataFR.info.texte + "</DIV >";
		textHTML += "<DIV >" + jsonDataFR.ministere.texte + "</DIV >";
		textHTML += "<DIV >" + jsonDataFR.mentions.texte + "</DIV >";
		textHTML += "<DIV >" + jsonDataFR.api.texte + "</DIV >";

		$("#id-cartouche-title").html(" ");
		$("#id-cartouche-content").html(textHTML);
		$("#id-cartouche-title").removeClass();
		$("#id-cartouche-title").addClass("cartouche-title");
		$("#id-cartouche-title").addClass("t-info-mobile");
		$("#id-cartouche").css("display", "block");
		$("#id-cartouche-content").css("display", "block");
	} else {
		eval("var data=jsonDataFR." + balise);

		if (balise == "indispensables") {
			$("#id-cartouche-title").css("line-height", "1.1em");
			$("#id-cartouche-title").css("font-size", "0.9em");
		} else {
		}
		$("#id-cartouche-title").html(data.titre);
		$("#id-cartouche-content").html(data.texte);
		$("#id-cartouche-title").removeClass();
		$("#id-cartouche-title").addClass("cartouche-title");
		$("#id-cartouche-title").addClass(data.classe);
		$("#id-cartouche").css("display", "block");
		$("#id-cartouche-content").css("display", "block");
	}

	resizeWindow();
}
$("#btninfo").click(function () {
	if (infoInCartouche == "info") {
		razTitle();
	} else {
		configHtml("cartedeslabs");
		$("#id-cartouche-pages").css("display", "block");

		$("#id-cartouche-pages").css("background-color", "#FFFFFF");
		$("#btn-p1").addClass("btn-active");
		infoInCartouche = "info";
	}
});

$("#info-mobile").click(function () {
	if (infoInCartouche == "info-mobile") {
		razTitle();
	} else {
		configHtml("allinfo");
		infoInCartouche = "info-mobile";
	}
});

function razBtnPages() {
	$("#btn-p1").removeClass("btn-active");
	$("#btn-p2").removeClass("btn-active");
	$("#btn-p3").removeClass("btn-active");
	$("#btn-p4").removeClass("btn-active");
	$("#id-cartouche-pages").css("background-color", "transparent");
}
$("#btn-p1").click(function () {
	configHtml("cartedeslabs");
	$("#id-cartouche-pages").css("display", "block");
	$("#id-cartouche-pages").css("background-color", "#FFFFFF");
	$("#btn-p1").addClass("btn-active");
	infoInCartouche = "info";
});
$("#btn-p2").click(function () {
	configHtml("info");
	$("#id-cartouche-pages").css("display", "block");
	$("#id-cartouche-pages").css("background-color", "transparent");
	console.log("non");
	$("#btn-p2").addClass("btn-active");
	infoInCartouche = "info";
});

$("#btn-p3").click(function () {
	configHtml("ministere");
	$("#id-cartouche-pages").css("display", "block");
	$("#id-cartouche-pages").css("background-color", "transparent");
	$("#btn-p3").addClass("btn-active");
	infoInCartouche = "info";
});

$("#btn-p4").click(function () {
	configHtml("mentions");
	$("#id-cartouche-pages").css("display", "block");
	$("#id-cartouche-pages").css("background-color", "transparent");
	$("#btn-p4").addClass("btn-active");
	infoInCartouche = "info";
});
$("#btninfo").mouseenter(function () {
	$("#id-survol").css("display", "block");
	$("#id-survol").css("right", "166px");
	$("#id-survol").html("Informations");
});

$("#btnApi").click(function () {
	if (infoInCartouche == "api") {
		razTitle();
	} else {
		configHtml("api");
		infoInCartouche = "api";
	}
});
$("#btnApi").mouseenter(function () {
	$("#id-survol").css("display", "block");
	$("#id-survol").css("right", "130px");
	$("#id-survol").html("Accédez à l'API");
});

$("#btncontact").mouseenter(function () {
	$("#id-survol").css("display", "block");
	$("#id-survol").css("right", "98px");
	$("#id-survol").html("Contact");
});

$("#btnLegend").click(function () {
	if ($("#id-legends").css("display") == "block") {
		razTitle();
		$("#id-legends").css("display", "none");
	} else {
		$(".btnLegendDetail").each(function (index) {
			$(this).css("opacity", 1);
		});
		$("#id-legends").css("display", "block");
	}
});

$(".btnLegendDetail").click(function () {
	if (is_mobile) {
		$("#id-legends").css("display", "none");
	} else {
	}
	$(".btnLegendDetail").each(function (index) {
		$(this).css("opacity", 0.5);
	});
	$(this).css("opacity", 1);
	var index = parseInt(this.id.substr(2, 1)) - 1;
	var data = jsonDataFR.legendes[index];

	razTitle();
	$("#id-cartouche-title").html("Légende");
	$("#id-cartouche-content").html(data.texte);
	$("#id-cartouche-title").removeClass();
	$("#id-cartouche-title").addClass("cartouche-title");
	$("#id-cartouche-title").addClass("t-legend");
	$("#id-cartouche").css("display", "block");
	$("#id-cartouche-content").css("display", "block");

	resizeWindow();
});

$(".button-topright").mouseleave(function () {
	$("#id-survol").css("display", "none");
});
$(".btn-close").click(function () {
	$("#id-cartouche").css("display", "none");
	razTitle();
	$(".btnLegendDetail").each(function (index) {
		$(this).css("opacity", 1);
	});
});
$("#closeLegend").click(function () {
	//razTitle();
	$("#id-legends").css("display", "none");
});

$(".gohome").click(function () {
	document.location = "http://www.makery.info";
});

$(".goEN").click(function () {
	document.location = "http://www.makery.info/en/map-labs/";
});
//-----------------
// search
//------------------
$("#btnAdvanced").click(function () {
	if ($("#advanced-search-container").css("display") == "none") {
		$("#advanced-search-container").css("display", "block");
		$("#btnAdvanced").css(
			"background-image",
			'url("./imgs/bouton_recherche_avancee_activee.svg")'
		);
	} else {
		$("#advanced-search-container").css("display", "none");
		$("#btnAdvanced").css(
			"background-image",
			'url("./imgs/bouton_recherche_avancee_desactivee.svg")'
		);
		closeVille();
		closeLabs();
		closeEquipments();
		closeActivities();
	}
});
$("#btnAdvanced").mouseenter(function () {
	if (is_mobile) {
	} else {
		$("#id-survol-search").css("display", "block");
	}
});
$("#btnAdvanced").mouseleave(function () {
	$("#id-survol-search").css("display", "none");
});
$("#btn-search-ville").click(function () {
	closeLabs();
	closeEquipments();
	closeActivities();
	if ($("#detail-ville").css("display") == "block") {
		closeVille();
	} else {
		clearNoResult(); //!!!!!!!!!!!!!!!!!
		$("#idSimpleSearch").val("");
		$("#idVilleSearch").val("");
		$("#detail-ville").css("display", "block");
		$(".search-form").css("height", "90px");
		$(".btn-search").each(function (index) {
			$(this).css("color", "#999999");
		});
		$("#btn-search-ville").css("color", "#FFFFFF");
		$(".search-all-criteria").css("top", "190px");
	}
});
$("#btn-close-ville").click(function () {
	closeVille();
});

function closeVille() {
	$("#idSimpleSearch").val("");
	$("#idVilleSearch").val("");
	$("#detail-ville").css("display", "none");
	$(".search-form").css("height", "50px");

	$(".search-all-criteria").css("top", "140px");

	$(".btn-search").each(function (index) {
		$(this).css("color", "#FFFFFF");
	});

	clearNoResult();
}

$("#btn-search-labs").click(function () {
	closeVille();
	closeEquipments();
	closeActivities();
	if ($("#detail-labs").css("display") == "block") {
		closeLabs();
	} else {
		$("#detail-labs").css("display", "block");
		$(".search-form").css("height", "130px");
		$(".btn-search").each(function (index) {
			$(this).css("color", "#999999");
		});
		$("#btn-search-labs").css("color", "#FFFFFF");
		$(".search-all-criteria").css("top", "230px");
	}
});

function closeLabs() {
	$("#detail-labs").css("display", "none");
	$(".search-form").css("height", "50px");
	$(".search-all-criteria").css("top", "140px");
	/*$( ".btn-search-lab" ).each(function( index ) {
		$( this ).css('opacity',1);
	});*/
	$(".btn-search").each(function (index) {
		$(this).css("color", "#FFFFFF");
	});
}

$(".btn-search-lab").click(function () {
	//-- recherche de la valeur
	searchval = $(this).attr("val");

	var founded = tabMC.indexOf(searchval);
	if (founded == -1) {
		tabMC_ext[tabMC_ext.length] = searchval + "_a";
		tabMC[tabMC.length] = searchval;
		buildCriteria();
	} else {
	}
});

//----------------------------------

$("#btn-search-equipments").click(function () {
	if (equipmentLoaded == false) {
		// not loaded
	} else {
		closeVille();
		closeLabs();
		closeActivities();
		if ($("#detail-equipments").css("display") == "block") {
			closeEquipments();
		} else {
			$("#detail-equipments").css("display", "block");
			$("#search-gradient").css("display", "block");
			if (is_mobile) {
				$("#fond-scroll").css("display", "none");
				$("#cursor-scroll").css("display", "none");
			} else {
				$("#fond-scroll").css("display", "block");
				$("#cursor-scroll").css("display", "block");
			}
			/*$( ".btn-search-equipment" ).each(function( index ) {
				$( this ).css('opacity',1);
			});*/
			$(".search-form").css("height", "130px");
			$(".btn-search").each(function (index) {
				$(this).css("color", "#999999");
			});
			$("#btn-search-equipments").css("color", "#FFFFFF");
			$(".search-all-criteria").css("top", "230px");

			if (is_mobile) {
			} else {
				computeScroll();
			}
			/**/
		}
	}
});

function closeEquipments() {
	$("#detail-equipments").css("display", "none");
	$("#search-gradient").css("display", "none");
	$("#fond-scroll").css("display", "none");
	$("#cursor-scroll").css("display", "none");
	$(".search-form").css("height", "50px");

	$(".search-all-criteria").css("top", "140px");

	$(".btn-search").each(function (index) {
		$(this).css("color", "#FFFFFF");
	});
}

//----------------------------------

$("#btn-search-activities").click(function () {
	if (activitiesLoaded == false) {
		// not loaded
	} else {
		closeVille();
		closeLabs();
		closeEquipments();
		if ($("#detail-activities").css("display") == "block") {
			closeActivities();
		} else {
			$("#detail-activities").css("display", "block");
			$("#search-gradient").css("display", "block");
			if (is_mobile) {
				$("#fond-scroll").css("display", "none");
				$("#cursor-scroll").css("display", "none");
			} else {
				$("#fond-scroll").css("display", "block");
				$("#cursor-scroll").css("display", "block");
			}

			$(".search-form").css("height", "130px");
			$(".btn-search").each(function (index) {
				$(this).css("color", "#999999");
			});
			$("#btn-search-activities").css("color", "#FFFFFF");
			$(".search-all-criteria").css("top", "230px");

			if (is_mobile) {
			} else {
				computeScroll();
			}

			/**/
		}
	}
});

function closeActivities() {
	$("#detail-activities").css("display", "none");
	$("#search-gradient").css("display", "none");

	$("#fond-scroll").css("display", "none");
	$("#cursor-scroll").css("display", "none");
	$(".search-form").css("height", "50px");

	$(".search-all-criteria").css("top", "140px");

	$(".btn-search").each(function (index) {
		$(this).css("color", "#FFFFFF");
	});
}

//----------------------------------------
function computeScroll() {
	var searchScroll;
	var containerScroll;
	var typeScroll = "";
	var offset = 0;
	if ($("#detail-equipments").css("display") == "block") {
		searchScroll = "equipment";
		containerScroll = "equipments";
	} else {
	}
	if ($("#detail-activities").css("display") == "block") {
		searchScroll = "activities";
		containerScroll = "activities";
	} else {
	}
	if ($("#detail-fiche-container").css("display") == "block") {
		searchScroll = "fiche";
		containerScroll = "fiche";
		typeScroll = "-fiche";
		offset = 20;
	} else {
	}

	//-- compute cursor's size
	var ratio =
		(parseInt($("#detail-" + containerScroll).css("width")) - offset) /
		parseInt($("#container-" + containerScroll).css("width"));
	if (ratio >= 1) {
		$("#fond-scroll-fiche").css("display", "none");
		$("#cursor-scroll-fiche").css("display", "none");
	} else {
		//ratio=Math.min(0.8,ratio);
		$("#cursor-scroll" + typeScroll).css(
			"width",
			ratio * parseInt($("#fond-scroll" + typeScroll).css("width"))
		);
	}
}

function computeScrollArticle() {
	//-- compute cursor's size

	var ratio =
		parseInt($("#id-cartouche-content").css("height")) /
		parseInt($("#article-content").css("height"));

	if (ratio >= 1) {
		$("#fond-scroll-article").css("display", "none");
		$("#cursor-scroll-article").css("display", "none");
	} else {
		//ratio=Math.min(0.8,ratio);
		$("#cursor-scroll-article").css(
			"height",
			ratio * parseInt($("#fond-scroll-article").css("height"))
		);
		if (infoInCartouche == "fiche") {
			$("#fond-scroll-article").css("display", "block");
			$("#cursor-scroll-article").css("display", "block");
			TweenMax.to($("#cursor-scroll-article"), 0, {
				css: {
					y: 0,
				},
			});
			cursorDragArticle[0].update();
			$("#id-cartouche-content").scrollTop(0);
		} else {
		}
	}

	var myDraggable = cursorDragArticle[0];
	var posTop =
		$("#id-cartouche-content").offset().top -
		$("#id-cartouche").offset().top;
	myDraggable.applyBounds({
		top: posTop + 30,
		left: 0,
		height: parseInt($("#id-cartouche-content").css("height")) - 60,
		width: 10,
	});
}

var cursorDrag = Draggable.create("#cursor-scroll", {
	bounds: {
		top: 0,
		left: -10,
		width: parseInt($("#fond-scroll").css("width")),
		height: 10,
	},
	zIndexBoost: false,
	type: "x",
	cursor: "grab",
	onPress: function () {},

	onDragEnd: function (e) {
		//$("#fond-poi").css('z-index',10);
	},
	onDrag: updateDraggable,
});
function updateDraggable() {
	var maxX =
		parseInt($("#fond-scroll").css("width")) -
		parseInt($("#cursor-scroll").css("width"));
	var ratio = this.x / maxX;

	var containerScroll;
	if ($("#detail-equipments").css("display") == "block") {
		containerScroll = "equipments";
	} else {
		containerScroll = "activities";
	}
	var maxContain =
		parseInt($("#container-" + containerScroll).css("width")) -
		parseInt($("#detail-" + containerScroll).css("width")) +
		100;

	var newLeft = -parseInt(maxContain * ratio);
	//$('#container-'+containerScroll).css('left',newLeft+'px');
	var newScrollLeft = parseInt(maxContain * ratio);
	$("#detail-" + containerScroll).scrollLeft(newScrollLeft);
}

var cursorDragfiche = Draggable.create("#cursor-scroll-fiche", {
	bounds: { top: 0, left: 0, width: 530, height: 10 },
	zIndexBoost: false,
	type: "x",
	cursor: "grab",
	onPress: function () {},

	onDragEnd: function (e) {
		//$("#fond-poi").css('z-index',10);
	},
	onDrag: updateDraggablefiche,
});
function updateDraggablefiche() {
	var maxX =
		parseInt($("#fond-scroll-fiche").css("width")) -
		parseInt($("#cursor-scroll-fiche").css("width"));
	var ratio = this.x / maxX;

	var containerScroll = "fiche";
	var maxContain =
		parseInt($("#container-" + containerScroll).css("width")) -
		parseInt($("#detail-" + containerScroll).css("width")) +
		120;
	//console.log(maxContain);

	var newLeft = -parseInt(maxContain * ratio);
	//$('#container-'+containerScroll).css('left',newLeft+'px');

	var newScrollLeft = parseInt(maxContain * ratio);
	$("#detail-" + containerScroll).scrollLeft(newScrollLeft);
}

var cursorDragArticle = Draggable.create("#cursor-scroll-article", {
	bounds: { top: 0, left: 0, height: 300, width: 10 },
	zIndexBoost: false,
	type: "y",
	cursor: "grab",
	onPress: function () {},

	onDragEnd: function (e) {
		//$("#fond-poi").css('z-index',10);
	},
	onDrag: updateDraggableArticle,
});
function updateDraggableArticle() {
	var maxY =
		parseInt($("#fond-scroll-article").css("height")) -
		parseInt($("#cursor-scroll-article").css("height"));
	var ratio = this.y / maxY;

	var maxContain =
		parseInt($("#article-content").css("height")) -
		parseInt($("#id-cartouche-content").css("height")) +
		100;

	var newTop = -parseInt(maxContain * ratio);
	//console.log(newTop);
	var newTopScroll = parseInt(maxContain * ratio);
	$("#id-cartouche-content").scrollTop(newTopScroll);
	//console.log(cursorDragArticle[0].y);
}
function updateDraggableArticleWheel() {
	/*var maxY 		= parseInt($("#fond-scroll-article").css('height'))-parseInt($("#cursor-scroll-article").css('height'));
	var ratio=parseInt($("#cursor-scroll-article").css('top'))/maxY;

	var maxContain  = parseInt($("#article-content").css('height'))-300+50;

	var newTop = -parseInt(maxContain*ratio);
	//console.log(newTop);
	$('#article-content').css('top',newTop+'px');*/
	//console.log($('#id-cartouche-content').scrollTop());
	//-- compute new position :
	var maxContain =
		parseInt($("#article-content").css("height")) -
		parseInt($("#id-cartouche-content").css("height")) +
		100;
	var ratio =
		(($("#id-cartouche-content").scrollTop() * 1.0) / maxContain) * 1.0;
	var maxY =
		parseInt($("#fond-scroll-article").css("height")) -
		parseInt($("#cursor-scroll-article").css("height"));
	var newPos = ratio * maxY;
	//console.log(parseInt(newPos));

	TweenMax.to($("#cursor-scroll-article"), 0.4, {
		css: {
			y: newPos,
		},
	});
	/*TweenMax.set($('#cursor-scroll-article'), {
		css: {
			y: newPos
		}
	});*/
	// console.log('draggable after change: ' + cursorDragArticle[0].y);
	cursorDragArticle[0].update();
	//console.log('draggable after update: ' + cursorDragArticle[0].y);
}

$("#id-cartouche-content").bind("wheel", function (e) {
	/*var step=10;
	var currentY=parseInt($("#cursor-scroll-article").css('top'));
	var maxY 		= parseInt($("#fond-scroll-article").css('height'))-parseInt($("#cursor-scroll-article").css('height'));
	if(e.originalEvent.deltaY<0) {

		currentY=Math.max(0,currentY-step);
	}else{

		currentY=Math.min(maxY,currentY+step);
	}

	var posTop=$( ".article").offset().top-$( "#id-cartouche").offset().top;
	//$("#cursor-scroll-article").css('top',currentY+10+'px');*/
	updateDraggableArticleWheel();
});

/*
document.getElementById("id-cartouche-content").addEventListener("wheel", myFunction);

function myFunction() {
	console.log('scrolling down !');
}*/
/*---------------------------*/
function razTitle() {
	$("#id-cartouche-title").css("padding-top", "15px");
	//$('#id-cartouche-title').css('line-height','1.2em');
	$("#id-cartouche-rs").html("");

	$("#id-cartouche-title").css("line-height", "none");
	$("#id-cartouche-title").css("font-size", "1.2em");

	$("#id-cartouche-localisation").css("display", "none");
	$("#detail-fiche-container").css("display", "none");
	$("#fond-scroll-article").css("display", "none");
	$("#cursor-scroll-article").css("display", "none");
	$(".cache-right").css("display", "none");

	$("#id-cartouche-pages").css("display", "none");
	razBtnPages();
	infoInCartouche = "";

	$("#id-cartouche-content").css("display", "none");
	$("#id-cartouche").css("display", "none");
}
//----------------------------------------------------
function displayMarker(indexClick) {
	razTitle();
	var obj = dataList[indexClick];
	$("#id-cartouche-title").removeClass();

	$("#id-cartouche-title").addClass("cartouche-title");

	var typeHtml = "";

	var combi = "";
	if (obj.properties.type_lab.indexOf("fablab") > -1) {
		combi = "F";
	} else {
	}
	if (obj.properties.type_lab.indexOf("makerspace") > -1) {
		//combi+="M";
		combi = "M";
	} else {
	}
	if (obj.properties.type_lab.indexOf("hackerspace") > -1) {
		combi = "H";
	} else {
	}
	if (obj.properties.type_lab.indexOf("autre") > -1) {
		combi = "A";
	} else {
	}
	if (obj.properties.type_lab.indexOf("tiers-lieu") > -1) {
		combi = "TL";
	} else {
	}

	if (combi == "") {
		combi = "F";
	} else {
	}
	$("#id-cartouche-title").addClass("t-" + combi);

	/*
	switch(obj.properties.type_lab){
		case "fablab":
			$('#id-cartouche-title').addClass("t-fablab");
			typeHtml="fablab";
			break;
		case "hackerspace":
			$('#id-cartouche-title').addClass("t-hackerspace");
			typeHtml="hackerspace";
			break;
		case "makerspace":
			$('#id-cartouche-title').addClass("t-makerspace");
			typeHtml="makerspace";
			break;
		case "Third place":
			$('#id-cartouche-title').addClass("t-tierslieu");
			typeHtml="tiers lieu";
			break;
		default:
			$('#id-cartouche-title').addClass("t-autre");
			break;
	}
	*/
	if (obj.properties.type_lab == "") {
	} else {
		$("#id-cartouche-title").css("padding-top", "5px");
		$("#id-cartouche-title").css("font-size", "1em");
		//$('#id-cartouche-title').css('line-height','0.95em');
		typeHtml = '<div class="cartouche-subtitle">' + obj.properties.type_lab;
		typeHtml += "</div>";
	}

	if (obj.properties.website == "") {
		$("#id-cartouche-title").html(obj.properties.name + typeHtml);
	} else {
		$("#id-cartouche-title").html(
			'<a href="' +
				obj.properties.website +
				'" target="_blank">' +
				obj.properties.name +
				"</a>" +
				typeHtml
		);
	}

	//-- rs -----------------------------------
	var rsHtml = "";
	if (obj.properties.facebook != "") {
		rsHtml +=
			'<A href="' +
			obj.properties.facebook +
			'" target="_blank"><img src="./imgs/icon_fb.svg" id="imgfb"/></A>';
	} else {
	}
	if (obj.properties.twitter != "") {
		rsHtml +=
			'<A href="' +
			obj.properties.twitter +
			'" target="_blank"><img src="./imgs/icon_twitter.svg" id="imgtw"/></A>';
	} else {
	}
	$("#id-cartouche-rs").html(rsHtml);
	//--------------------------------------
	$("#id-cartouche-localisation").html(obj.properties.adress);
	$("#id-cartouche-localisation").css("display", "block");
	//--------------------------------------

	var contentHTML = '<div class="table-adv-row">';

	contentHTML += '<div class="table-adv-cell-fiche">';
	contentHTML += '<div class="label-fiche" >Activités :</div>';
	contentHTML += '<div class="label-fiche" >Equipements :</div>';
	contentHTML += "</div>";

	var arrayMachines = obj.properties.machines.split(",");
	var arrayThemes = obj.properties.themes.split(",");

	//
	var nbContent = Math.max(arrayMachines.length, arrayThemes.length);
	var nbTotal = 0;
	for (var i = 0; i < nbContent; i++) {
		contentHTML += '<div class="table-adv-cell-fiche">';

		if (i < arrayThemes.length && arrayThemes[i].trim() != "") {
			currentT = arrayThemes[i];
			contentHTML += '<div class="btn-fiche" >' + currentT + "</div>";
			nbTotal += 1;
		} else {
			currentT = "&nbsp;";
			contentHTML += '<div class="label-fiche" >' + currentT + "</div>";
		}

		if (i < arrayMachines.length && arrayMachines[i].trim() != "") {
			currentM = arrayMachines[i].trim();
			if (currentM == "les indispensables") {
				currentM =
					'<div class="label-indispensables">' +
					currentM +
					'&nbsp;&nbsp;</div><div id="btn-indispensables-fiche"></div>';
			} else {
			}
			contentHTML += '<div class="btn-fiche" >' + currentM + "</div>";
			nbTotal += 1;
		} else {
			currentM = "&nbsp;";
			contentHTML += '<div class="label-fiche" >' + currentM + "</div>";
		}

		contentHTML += "</div>";
	}

	contentHTML += "</div>";
	$("#container-fiche").html(contentHTML);

	$("#btn-indispensables-fiche").click(function (e) {
		e.preventDefault();
		configHtml("indispensables");

		return false;
	});
	//------------------------------------------
	infoInCartouche = "fiche";
	var contentArticle = loadArticle(obj.properties.id);

	//--------------------------------------------
	$("#id-cartouche").css("display", "block");
	if (nbTotal > 0) {
		$("#detail-fiche-container").css("display", "block");
		if (
			parseInt($("#container-fiche").css("width")) >
			parseInt($("#detail-fiche").css("width")) -
				parseInt($("#detail-fiche").css("padding-left")) -
				120
		) {
			if (is_mobile) {
				$("#fond-scroll-fiche").css("display", "none");
				$("#cursor-scroll-fiche").css("display", "none");
			} else {
				$("#fond-scroll-fiche").css("display", "block");
				$("#cursor-scroll-fiche").css("display", "block");
			}

			$("#fiche-gradient").css("display", "block");
		} else {
			$("#fond-scroll-fiche").css("display", "none");
			$("#cursor-scroll-fiche").css("display", "none");
			$("#fiche-gradient").css("display", "none");
		}
		if (is_mobile) {
		} else {
			computeScroll();
		}
	} else {
		$("#detail-fiche-container").css("display", "none");
	}
}
function loadArticle(id) {
	$.getJSON(
		"request-article.php?search=" + id,
		function (data) {
			if (data.article.length > 0) {
				if (data.article[0].length > 0) {
					var contentHTML =
						'<div class="big-title">' +
						"On en parle sur Makery" +
						"</div>";
					contentHTML +=
						'<div class="article"><div id="article-content">';
					contentHTML += data.article[0];
					contentHTML += '<div class="space-bottom-article"></div>';
					contentHTML += "</div></div>";
					$("#id-cartouche-content").html(contentHTML);
					$("#id-cartouche-content").css("display", "block");

					if (is_mobile) {
						$(".cache-right").css("display", "none");
						$("#fond-scroll-article").css("display", "none");
						$("#cursor-scroll-article").css("display", "none");
					} else {
						$(".cache-right").css("display", "block");
						$("#fond-scroll-article").css("display", "block");
						$("#cursor-scroll-article").css("display", "block");
						var posTop =
							$("#id-cartouche-content").offset().top -
							$("#id-cartouche").offset().top;

						$("#fond-scroll-article").css(
							"top",
							posTop + 30 + "px"
						);
						$("#cursor-scroll-article").css(
							"top",
							posTop + 30 + "px"
						);
						$(".cache-right").css("top", posTop + "px");
					}

					resizeWindow();
					if (is_mobile) {
					} else {
						computeScrollArticle();
						setTimeout(computeScrollArticle, 500);
					}
				} else {
					$("#id-cartouche-content").html("");
					$("#id-cartouche-content").css("display", "block");
				}
			} else {
				$("#id-cartouche-content").html("");
				$("#id-cartouche-content").css("display", "block");
			}
		},
		"json"
	).done(function () {
		//-- done ;
	});
}

$(window).resize(function () {
	resizeWindow();
});
function resizeWindow() {
	var wH = $(window).height();
	var vOffset = $("#id-cartouche-content").offset().top;
	$("#id-cartouche-content").css("max-height", wH - vOffset - 50 + "px");

	$("#fond-scroll-article").css(
		"height",
		parseInt($("#id-cartouche-content").css("height")) - 40 + "px"
	);
	//$('#fond-scroll-article').css('height',358+'px');

	if (is_mobile) {
	} else {
		computeScrollArticle();
	}

	$("#id-survol-search").css(
		"left",
		$("#btnAdvanced").offset().left - 60 + "px"
	); // -75 (1/2 width survol) + 15 (1/2 width btnAdvanced )

	var wW = $(window).width();
	var newW;
	if (wW >= 530) {
		newW = 530 - 80;
	} else {
		newW = wW - 80;
	}
	console.log(newW);
	var newH = (newW / 560) * 315; // 560*315 are the size of standard iframe youtube
	$(".iframeyoutube").css("width", newW + "px");
	$(".iframeyoutube").css("height", newH + "px");
}
resizeWindow();
