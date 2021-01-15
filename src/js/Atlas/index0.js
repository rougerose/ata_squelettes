import { config } from "./config";
import { Tab } from "./Tab";
import { SearchBox } from "./SearchBox-t2";
import { Keyword } from "./Keyword-test";

class Atlas {
    constructor(map, state, config) {
        this.state = state;
        this.map = map;
        let container = document.getElementById(config.containerId);
        this.container = container;
        let controls = config.controls;
        let dispatch = config.dispatch;
        this.controls = controls.map(
            (Control) => new Control(state, { container, dispatch })
        );
    }
    syncState(state) {
        this.state = state;
        console.log("Atlas state", this.state);
        for (const ctrl of this.controls) {
            ctrl.syncState(state);
        }
    }
}

function atlasInit(map) {
    let state = {
        keywordValues: [],
        keywordLabels: [],
        keywordSelectedValues: [],
        keywordSelectedLabels: [],
    };
    let config = {
        containerId: "atlas",
        controls: [SearchBox, Tab, Keyword],
        dispatch: function dispatch(action) {
            atlas.syncState(state);
        },
    };
    let atlas = new Atlas(map, state, config);
}

export default atlasInit;

// class AtlasBase {
//     constructor(mapObj) {
//         this.map = mapObj;
//         this.container = this.map._container.parentNode;
//         const searchBoxContainer = this.container.querySelector("#" + config.searchBox.containerId);
//         const keywordsContainer = this.container.querySelector("." + config.keywords.containerClassName);
//         //! A définir
//         const startState = { tab: 0 };
//         const controls = [SearchBox, Keyword, Tab];
//         const containers = {
//             map: this.map._container,
//             searchBox: searchBoxContainer,
//         };

//         this.atlasSearch = new AtlasSearch(startState, {
//             controls,
//             containers,
//             dispatch(action) { console.log("dispatch");},
//         });
//     }
// }

// class AtlasSearch {
//     constructor(state, config) {
//         let { controls, containers, dispatch } = config;
//         this.state = state;
//         this.controls = controls.map(Control => new Control(state, config));
//         console.log(this);
//     }

//     syncState(state) {
//         this.state = state;
//     }
// }

// class AtlasBase {
//     constructor(mapObj) {
//         this._map = mapObj;
//         this._container = this._map._container;
//         this.searchBox = new SearchBox("SearchBox");
//         this._initEvents();
//     }

//     addKeyword(keyword) {
//         this.searchBox.keywords.addKeyword(keyword);
//     }

//     _initEvents() {
//         this._container.addEventListener("update", (event) => {
//             console.log(this, event, event.detail);
//         });
//     }
// }

// export default AtlasBase;
