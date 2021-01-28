import { config } from "./config";
import debounce from "lodash/debounce";
import Tablist from "@accede-web/tablist";

export class AtlasBase {
    constructor(map, state, conf) {
        this.map = map;
        this.configMap();

        // Ajouter gestionnaire sur window.onresize
        this.handleResize = this._handleResize.bind(this);
        window.addEventListener("resize", debounce(this.handleResize, 250));

        let container = document.getElementById(conf.containerId);
        let dispatch = conf.dispatch;
        let controls = conf.controls;
        this.state = state;
        this.dispatch = dispatch;
        this.container = container;
        this.memory = {};

        // Activer les modules "controls"
        this.controls = {};
        controls.forEach((Control) => {
            this.controls[Control.name] = new Control(state, {
                container,
                dispatch,
            });
        });

        // Activer Tablist @accede-web/tablist
        const list = this.container.querySelector("#Tab ul[role='tablist']");
        if (list) {
            let tablist = new Tablist(list);
            tablist.mount();
        }
    }

    configMap() {
        // Bug Leaflet : le click sur un marqueur est envoyé deux fois. Solution provisoire :
        // désactiver l'option "tap" : https://github.com/Leaflet/Leaflet/issues/7255
        L.Util.setOptions(this.map, { tap: false });

        // Position du crédit carto...
        L.Control.Attribution.prototype.options.position = "bottomleft";
        // ... et du zoom
        L.Control.Zoom.prototype.options.position = "bottomright";

        // Ajouter un gestionnaire de click sur chaque marqueur, mais après "ready"
        // car le module est chargé lors de l'événement "load" et les marqueurs
        // ne sont pas encore disponibles.
        let onready = () => {
            this._handleClickMarker();
            // jQuery("#" + this.map._container.id).off("ready", onready);
        };
        jQuery("#" + this.map._container.id).on("ready", onready);

        // Personnaliser les icones des clusters
        if (this.map.options.cluster) {
            this.map.options.clusterOptions.iconCreateFunction = this.clusterIcon;
        }
    }

    // Clusters personnalisés
    clusterIcon(cluster) {
        const SIZE = config.markerSize;
        let size, variant, count;
        count = cluster.getChildCount();
        if (count <= 3) {
            variant = "-xs";
            size = SIZE.xs;
        } else if (count <= 10) {
            variant = "-s";
            size = SIZE.s;
        } else if (count <= 50) {
            variant = "-m";
            size = SIZE.m;
        } else if (count <= 100) {
            variant = "-l";
            size = SIZE.l;
        } else if (count <= 250) {
            variant = "-xl";
            size = SIZE.xl;
        } else {
            variant = "-xxl";
            size = SIZE.xxl;
        }
        return new L.DivIcon({
            html: "<div><span>" + count + "</span></div>",
            className: "mp-MarkerCluster mp-MarkerCluster" + variant,
            iconSize: new L.Point(size, size),
        });
    }

    syncState(state) {
        if (state.keywordsSelected.size !== this.state.keywordsSelected.size) {
            if (state.keywordsSelected.size !== 0) {
                this.searchCollection(state.keywordsSelected);
                this.state = state;
            } else {
                // recharger la carte dans son état initial
                this.resetMap();
                this.state = state;
            }
        }

        if (Object.keys(state.centerMarker).length > 0) {
            this.centerOnMarker(state.centerMarker.coords, state.centerMarker.id);
        }

        if (state.moveZoom !== "") {
            this.moveZoom(state.moveZoom);
        }

        this.state = state;

        for (let key in this.controls) {
            this.controls[key].syncState(state);
        }
    }

    // Compléter les variables state nécessaires.
    // La fonction est appelée depuis atlas.init()
    setInitialState() {
        if (!this.state.windowWidth) {
            this.dispatch({
                type: "updateWindowWidth",
                windowWidth: this._getWindowWidth(),
            });
        }
        if (!this.state.searchboxHeight) {
            this.dispatch({
                type: "updateSearchboxHeight",
                searchboxHeight: this.controls.SearchBox._getHeight(),
            });
        }
    }

    _handleResize(event) {
        // resize : vérifier si la largeur de la fenêtre a changé
        this._checkWindowWidth();
    }

    _handleClickMarker() {
        const self = this;
        let markers = {};
        let cb = function (event) {
            self.dispatch({
                type: "addModalContent",
                openId: this.feature.id,
                modalId: "modalAssociation",
            });
            self.dispatch({
                type: "centerOnMarker",
                coords: this.feature.geometry.coordinates,
                id: this.feature.id,
            });
        };
        this.map.markerCluster.eachLayer((layer) => {
            // garder en mémoire les markers afin de pouvoir les réutiliser
            markers[layer.id] = layer;
            layer.on("click", cb);
        });
        this.memory.markers = markers;
    }

    _getWindowWidth() {
        const breakpoint = config.windowBreakpoint;
        let windowWidth =
            window.innerWidth >= breakpoint ? "desktop" : "mobile";
        return windowWidth;
    }

    _checkWindowWidth() {
        let currentWidth = this._getWindowWidth();
        if (this.state.windowWidth !== currentWidth) {
            this.dispatch({
                type: "updateWindowWidth",
                windowWidth: currentWidth,
            });
        }
    }

    handleAction(state, action) {
        // Corriger un écart entre les listes de mots-clés.
        // La liste keywords est celle qui est à jour
        // (en l'occurence qu'il n'y a plus aucun mot-clé sélectionné).
        if (state.keywords.size == 0 && state.keywordsSelected.size > 0) {
            state.keywordsSelected = new Map();
        }
        // Conserver en mémoire l'état actuel, et le distribuer à tous les
        // modules enfants, sauf celui relatif aux modales qui est temporaire.
        let currentState = this.state;
        currentState.modalAction = "";
        currentState.modalArgs = {};
        currentState.modalOpenId = "";
        currentState.modalId = "";
        currentState.centerMarker = {};
        currentState.moveZoom = "";

        let keywords;
        let keywordsSelected;

        switch (action.type) {
            case "addKeyword":
                keywords = new Map(state.keywords);
                keywordsSelected = new Map(state.keywordsSelected);
                keywords.set(action.keyword.value, action.keyword.label);
                keywordsSelected.set(
                    action.keyword.value,
                    action.keyword.label
                );

                state = Object.assign({}, currentState, {
                    keywords: keywords,
                    keywordsSelected: keywordsSelected,
                });
                break;
            case "removeKeywordSelected":
                keywords = new Map(state.keywords);
                keywordsSelected = new Map(state.keywordsSelected);
                keywords.delete(action.keyword.value);
                keywordsSelected.delete(action.keyword.value);

                state = Object.assign({}, currentState, {
                    keywords: keywords,
                    keywordsSelected: keywordsSelected,
                });
                break;
            case "addModalContent":
                action.action = "addModalContent";
                action.modalId = action.modalId;
                action.openId = action.openId || "";
                action.args = action.args || {};

                state = Object.assign({}, currentState, {
                    modalAction: action.action,
                    modalOpenId: action.openId,
                    modalArgs: action.args,
                    modalId: action.modalId,
                });
                break;
            case "updateModalPosition":
                action.action = action.action || "";
                action.modalId = action.modalId || "";
                action.openId = action.openId || "";
                action.args = action.args || {};

                state = Object.assign({}, currentState, {
                    modalAction: action.action,
                    modalOpenId: action.openId,
                    modalArgs: action.args,
                    modalId: action.modalId,
                });
                break;
            case "updateWindowWidth":
                state = Object.assign({}, currentState, {
                    windowWidth: action.windowWidth,
                });
                break;
            case "updateSearchboxHeight":
                if (!action.searchboxHeight) {
                    action.searchboxHeight = this.controls.SearchBox._getHeight();
                }
                state = Object.assign({}, currentState, {
                    searchboxHeight: action.searchboxHeight,
                });
                break;
            case "centerOnMarker":
                state = Object.assign({}, currentState, {
                    centerMarker: { coords: action.coords, id: action.id },
                });
                break;
            case "moveZoom":
                state = Object.assign({}, currentState, {
                    moveZoom: action.height
                });
                break;
        }
        return state;
    }

    autocompleteAddKeyword(keyword) {
        this.dispatch({ type: "addKeyword", keyword: keyword });
    }

    centerOnMarker(coords, id) {
        // const latLngs = L.GeoJSON.coordsToLatLng(coords);
        const marker = this.memory.markers[id];
        // console.log(latLngs);
        this.map.markerCluster.zoomToShowLayer(marker, function () {
            marker.openPopup();
        });
        // this.map.markerCluster.eachLayer((layer) => {
        //     if (layer.id == id) {
        //        this.map.markerCluster.zoomToShowLayer(layer, function () {});
        //    }
        // });



        // this.map.setView(latLngs);

        // const latLngs = [ L.GeoJSON.coordsToLatLng(coords) ];
        // const bounds = L.latLngBounds(latLngs);
        // this.map.fitBounds(bounds, {maxZoom: 10});
    }

    moveZoom(height) {
        const zoomControl = this.map.zoomControl.getContainer();
        zoomControl.style.transform = "translateY(" + height + "px)";
    }

    resetMap() {
        this.map.removeAllMarkers();
        this.map.loadData();
        this.dispatch({ type: "updateModalPosition", action: "closeModals" });
    }

    createQuery(keywords) {
        let query = {
            id_association: [],
            id_mot: [],
            id_adresse: [],
            limit: this.map.options.json_points.limit,
        };

        // la syntaxe key est la forme suivante : "id_objet_spip:identifiant_numerique"
        for (const [key] of keywords) {
            const objet_spip = key.split(":");
            const index = query[objet_spip[0]].length;
            query[objet_spip[0]][index] = objet_spip[1];
        }

        return query;
    }

    searchCollection(keywords) {
        const self = this;
        const map = self.map;
        const URL = "http.api/collectionjson/associations";
        let query = self.createQuery(keywords);
        query = jQuery.param(query);

        let collection = jQuery.getJSON(URL, query);
        collection.done(function (json) {
            let associations = { id_association: [] };
            let items = json.collection.items;
            for (const key in items) {
                if (Object.hasOwnProperty.call(items, key)) {
                    associations.id_association.push(items[key].data[0].value);
                }
            }
            let args = {};
            jQuery.extend(
                true,
                args,
                map.options.json_points.env,
                associations
            );
            args.objets = "associations_recherche";
            args.limit = map.options.json_points.limit;
            self.searchFeatures(map.options.json_points.url, args);
        });

        collection.fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            // TODO gestion erreur
            console.log("Request Failed: " + err);
        });
    }

    searchFeatures(url, args) {
        const self = this;
        const map = self.map;

        jQuery.getJSON(url, args, (data) => {
            if (data) {
                map.removeAllMarkers();
                // map.options.autocenterandzoom = true;
                map.parseGeoJson(data);
                jQuery("#" + map._container.id).trigger("ready", map);

                self.dispatch({
                    type: "addModalContent",
                    args: args,
                    modalId: "modalRecherche",
                });
            }
        });
    }
}
