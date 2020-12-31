import { SearchBox } from "./SearchBox-test";

class AtlasBase {
    constructor(mapObj) {
        this._map = mapObj;
        this._container = this._map._container;
        this.searchBox = new SearchBox("SearchBox");
        this._initEvents();
    }

    addKeyword(keyword) {
        this.searchBox.keywords.addKeyword(keyword);
    }

    _initEvents() {
        this._container.addEventListener("update", (event) => {
            console.log(this, event, event.detail);
        });
    }
}

export default AtlasBase;
