import { config } from "./config";
import { addEvent } from "../util/addEvent";
import debounce from "lodash/debounce";
import Tablist from "@accede-web/tablist";

export class AtlasBase {
    constructor(map, state, conf) {
        this.map = map;
        this.configMap();

        this.__handleResize = this._handleResize.bind(this);
        addEvent(window, "resize", debounce(this.__handleResize, 250));

        let container = document.getElementById(conf.containerId);
        let dispatch = conf.dispatch;
        let controls = conf.controls;
        this.state = state;
        this.dispatch = dispatch;
        this.container = container;

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
            jQuery("#" + this.map._container.id).off("ready", onready);
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
        // console.log("AB syncState state: ", state);
        //console.log("AB Syncstate this.state : ", this.state);
        this.state = state;
        for (let key in this.controls) {
            this.controls[key].syncState(state);
        }
    }

    // Compléter les variables state nécessaires
    setupState() {
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
        this.map.eachLayer((layer) => {
            let self = this;
            let handleClick = function (event) {
                if (this.feature) {
                    // console.log(this.feature, self);
                    self.dispatch({
                        type: "updateModalPosition",
                        action: "open",
                        openId: this.feature.id,
                        position: self.state.modal.position
                    });
                }
            };
            layer.on("click", handleClick);
            if (typeof layer.getChildCount !== "undefined") {
                $.each(layer.getAllChildMarkers(), function (i, sublayer) {
                    sublayer.on("click", handleClick);
                });
            }
        });
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
        let keywords = new Map(state.keywords);
        let keywordsSelected = new Map(state.keywordsSelected);
        switch (action.type) {
            case "addKeyword":
                keywords.set(action.keyword.value, action.keyword.label);
                keywordsSelected.set(
                    action.keyword.value,
                    action.keyword.label
                );
                state = Object.assign({}, state, {
                    keywords: keywords,
                    keywordsSelected: keywordsSelected,
                });
                break;
            case "removeKeywordSelected":
                keywords.delete(action.keyword.value);
                keywordsSelected.delete(action.keyword.value);
                state = Object.assign({}, state, {
                    keywords: keywords,
                    keywordsSelected: keywordsSelected,
                });
                break;
            //? A garder ?
            case "openModal":
                state = Object.assign({}, state, {
                    modal: { action: "open", data: action.data },
                });
                break;
            case "updateModalPosition":
                action.action = action.action || "";
                action.position = action.position || "";
                action.openId = action.openId || "";
                state = Object.assign({}, state, {
                    modal: {
                        action: action.action,
                        openId: action.openId,
                        position: action.position
                    },
                });
                break;
            case "updateWindowWidth":
                state = Object.assign({}, state, {
                    windowWidth: action.windowWidth,
                });
                break;
            case "updateSearchboxHeight":
                if (!action.searchboxHeight) {
                    action.searchboxHeight = this.controls.SearchBox._getHeight();
                }
                state = Object.assign({}, state, {
                    searchboxHeight: action.searchboxHeight,
                });
                break;
        }
        return state;
    }

    autocompleteAddKeyword(keyword) {
        this.dispatch({ type: "addKeyword", keyword: keyword });
    }


}
